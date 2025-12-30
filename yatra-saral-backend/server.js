require('dotenv').config();
const express = require('express');
const Brevo = require('@getbrevo/brevo'); // Added Brevo
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const cron = require('node-cron');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

// --- Brevo Initialization ---
const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

// --- Database Connection ---
const client = new MongoClient(process.env.MONGO_URI);
let db;

client.connect()
  .then(() => {
    console.log('✅ Connected to MongoDB');
    db = client.db('yatra-saral');
  })
  .catch(err => console.error('Failed to connect to MongoDB', err));

// --- Helper function for Brevo Emails ---
const sendBrevoEmail = async (toEmail, subject, htmlContent, toName = "User") => {
  const sendSmtpEmail = new Brevo.SendSmtpEmail();
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = htmlContent;
  sendSmtpEmail.sender = { "name": "Yatra Saral", "email": process.env.EMAIL_USER };
  sendSmtpEmail.to = [{ "email": toEmail, "name": toName }];

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`Email sent successfully to ${toEmail}`);
    return true;
  } catch (error) {
    console.error(`Failed to send email to ${toEmail}:`, error);
    return false;
  }
};

const sendWelcomeEmail = async (email, name) => {
  const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h1 style="color: #0d6efd; text-align: center;">Welcome, ${name}!</h1>
          <p>We're thrilled to have you on board. With Yatra Saral, your train journeys are about to get a whole lot simpler.</p>
          <p>Here are a few things you can do to get started:</p>
          <ul>
            <li><strong>Book a Ticket:</strong> Find and book trains in just a few clicks.</li>
            <li><strong>Plan a Trip:</strong> Use our tools to plan your itinerary and budget.</li>
            <li><strong>Order Food:</strong> Get delicious meals delivered right to your seat.</li>
          </ul>
          <p>If you have any questions, feel free to visit our FAQ or contact our support team.</p>
          <p>Happy travels,<br/>The Yatra Saral Team</p>
        </div>
      </div>
    `;
  await sendBrevoEmail(email, `Welcome to Yatra Saral, ${name}!`, html, name);
};

// Hourly check for travel alerts
cron.schedule('0 * * * *', async () => {
  console.log('Running hourly check for travel alerts...');
  if (!db) {
    console.log('Database not connected, skipping alert check.');
    return;
  }

  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const tomorrowDateString = tomorrow.toISOString().split('T')[0];

  const subscriptions = await db.collection('alertSubscriptions').find({
    journeyDate: tomorrowDateString
  }).toArray();

  console.log(`Found ${subscriptions.length} subscriptions for journeys on ${tomorrowDateString}.`);

  for (const sub of subscriptions) {
    const possibleStatuses = [
      'is running on time.',
      'is delayed by 15 minutes.',
      'is delayed by 30 minutes.',
      'has been cancelled.',
      'has been rescheduled.',
      'platform has been changed to 5.',
    ];
    const randomStatus = possibleStatuses[Math.floor(Math.random() * possibleStatuses.length)];

    const html = `<div style="font-family: sans-serif; padding: 20px;">
              <p>Hi there,</p>
              <p>This is your hourly update for PNR ${sub.pnr}.</p>
              <p><b>Current Status:</b> Your train ${randomStatus}</p>
              <p>We will keep you updated.</p>
              <p>Thanks,<br/>Yatra Saral Team</p>
              </div>`;

    await sendBrevoEmail(sub.email, `Hourly Update for Train #${sub.trainNumber}`, html);
  }
});

// ---------------- Weather API Proxy ----------------
app.get('/api/weather', async (req, res) => {
  const city = req.query.city;
  const forecast = req.query.forecast === 'true';
  if (!city) return res.status(400).json({ error: 'City is required' });
  const API_KEY = process.env.WEATHER_API_KEY;
  try {
    const fetch = (await import('node-fetch')).default;
    const currentRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    if (!currentRes.ok) throw new Error('City not found');
    const currentJson = await currentRes.json();
    let forecastJson = null;
    if (forecast) {
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      if (!forecastRes.ok) throw new Error('Could not fetch forecast');
      forecastJson = await forecastRes.json();
    }
    res.json({ current: currentJson, forecast: forecastJson });
  } catch (err) {
    console.error('Weather API error:', err.message);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// ---------------- Forgot Password ----------------
app.post('/send-reset-code', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  const html = `<div style="font-family: sans-serif; text-align: center; padding: 20px;">
      <h2>Password Reset</h2>
      <p>Your 6-digit verification code is:</p>
      <p style="font-size: 24px; font-weight: bold; letter-spacing: 5px; background: #f0f0f0; padding: 10px; border-radius: 5px;">
        ${code}
      </p>
      <p>This code will expire in 10 minutes.</p>
    </div>`;

  const success = await sendBrevoEmail(email, 'Your Yatra Saral Password Reset Code', html);
  if (success) {
    res.status(200).json({ message: 'Email sent successfully', code: code });
  } else {
    res.status(500).json({ message: 'Failed to send email' });
  }
});

// --- API Endpoints for Saved Passengers ---
app.get('/api/passengers/:email', async (req, res) => {
  if (!db) return res.status(503).json({ message: 'Database not connected' });
  const { email } = req.params;
  const passengers = await db.collection('passengers').find({ userEmail: email }).toArray();
  res.json(passengers);
});
app.post('/api/passengers', async (req, res) => {
  if (!db) return res.status(503).json({ message: 'Database not connected' });
  const newPassengerData = req.body;
  const result = await db.collection('passengers').insertOne({ ...newPassengerData });
  const newPassenger = await db.collection('passengers').findOne({ _id: result.insertedId });
  res.status(201).json(newPassenger);
});
app.put('/api/passengers/:id', async (req, res) => {
  if (!db) return res.status(503).json({ message: 'Database not connected' });
  const { id } = req.params;
  const updatedData = req.body;
  delete updatedData._id;
  try {
    const result = await db.collection('passengers').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updatedData },
      { returnDocument: 'after' }
    );
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ message: 'Passenger not found with that ID' });
    }
  } catch (error) {
    console.error("Failed to update passenger:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
app.delete('/api/passengers/:id', async (req, res) => {
  if (!db) return res.status(503).json({ message: 'Database not connected' });
  const { id } = req.params;
  await db.collection('passengers').deleteOne({ _id: new ObjectId(id) });
  res.status(204).send();
});

// --- API Endpoints for Complaints ---
app.get('/api/complaints/:email', async (req, res) => {
  if (!db) return res.status(503).json({ message: 'Database not connected' });
  const { email } = req.params;
  const complaints = await db.collection('complaints').find({ userEmail: email }).toArray();
  res.json(complaints);
});

app.post('/api/complaints', async (req, res) => {
  if (!db) return res.status(503).json({ message: 'Database not connected' });

  const complaintData = req.body;
  const complaintId = 'COMP-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  const newComplaint = {
    id: complaintId,
    ...complaintData,
    date: new Date().toISOString(),
    status: 'Submitted'
  };

  const result = await db.collection('complaints').insertOne(newComplaint);
  const createdComplaint = await db.collection('complaints').findOne({ _id: result.insertedId });

  const { name, email, category, description, pnr } = complaintData;

  if (email) {
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px; max-width: 600px; margin: auto; border-radius: 8px;">
        <h1 style="color: #dc3545; text-align: center;">Complaint Registered</h1>
        <p>Hi ${name},</p>
        <p>This is to confirm that we have successfully registered your complaint. Our team will review the details and get back to you within 24-48 hours.</p>
        <p>Please use the following Complaint ID for any future correspondence:</p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; text-align: center;">
            <p style="margin: 0; font-size: 18px; font-weight: bold; letter-spacing: 2px;">${createdComplaint.id}</p>
        </div>
        <hr>
        <h3 style="color: #555;">Summary of Your Complaint:</h3>
        <p><b>Category:</b> ${category}</p>
        ${pnr ? `<p><b>PNR/Train:</b> ${pnr}</p>` : ''}
        <p><b>Description:</b> <i>"${description}"</i></p>
        <hr>
        <p style="text-align: center; font-size: 12px; color: #777;">We appreciate your patience.<br/>The Yatra Saral Support Team</p>
      </div>
    `;
    await sendBrevoEmail(email, `Complaint Registered [ID: ${createdComplaint.id}]`, emailHtml, name);
  }
  res.status(201).json(createdComplaint);
});

// --- API Endpoints for Train Tickets ---
app.get('/api/tickets/:email', async (req, res) => {
  if (!db) return res.status(503).json({ message: 'Database not connected' });
  const { email } = req.params;
  const tickets = await db.collection('tickets').find({
    $or: [
      { 'passenger.email': email },
      { 'email': email }
    ]
  }).toArray();
  res.json(tickets);
});
app.post('/api/tickets', async (req, res) => {
  if (!db) return res.status(503).json({ message: 'Database not connected' });
  const ticketData = req.body;
  const ticketId = 'TKT' + Math.random().toString(36).substr(2, 9).toUpperCase();
  const newTicket = {
    id: ticketId,
    ...ticketData,
    status: 'Confirmed',
    bookedAt: new Date().toISOString()
  };
  const result = await db.collection('tickets').insertOne(newTicket);
  const createdTicket = await db.collection('tickets').findOne({ _id: result.insertedId });
  res.status(201).json(createdTicket);
});

// --- API Endpoints for Pantry Food Orders ---
app.get('/api/food-orders/:email', async (req, res) => {
  if (!db) return res.status(503).json({ message: 'Database not connected' });
  const { email } = req.params;
  const orders = await db.collection('food-orders').find({ userEmail: email }).toArray();
  res.json(orders);
});

app.post('/api/food-orders', async (req, res) => {
  if (!db) return res.status(503).json({ message: 'Database not connected' });

  const orderData = req.body;
  const orderId = 'PF' + Math.random().toString(36).substr(2, 9).toUpperCase();
  const newOrder = {
    id: orderId,
    ...orderData,
    status: 'Confirmed',
    estimatedDelivery: '30 minutes',
    orderedAt: new Date().toISOString()
  };

  const result = await db.collection('food-orders').insertOne(newOrder);
  const createdOrder = await db.collection('food-orders').findOne({ _id: result.insertedId });

  const { foodType, trainNumber, coach, seatNumber, name, email } = orderData;

  if (email) {
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px; max-width: 600px; margin: auto; border-radius: 8px;">
        <h1 style="color: #f97316; text-align: center;">Pantry Food Order Confirmed!</h1>
        <p>Hi ${name},</p>
        <p>Your food order has been successfully placed. Our pantry staff will deliver it to your seat shortly. Here are your order details:</p>
        <hr>
        <table style="width: 100%; border-collapse: collapse;">
            <tr style="background-color: #f8f9fa;">
                <td style="padding: 10px; font-weight: bold;">Order ID:</td>
                <td style="padding: 10px;"><b>${createdOrder.id}</b></td>
            </tr>
            <tr>
                <td style="padding: 10px; font-weight: bold;">Food Type:</td>
                <td style="padding: 10px;">${foodType}</td>
            </tr>
            <tr style="background-color: #f8f9fa;">
                <td style="padding: 10px; font-weight: bold;">Train Number:</td>
                <td style="padding: 10px;">${trainNumber}</td>
            </tr>
            <tr>
                <td style="padding: 10px; font-weight: bold;">Delivery Location:</td>
                <td style="padding: 10px;">Coach: ${coach}, Seat: ${seatNumber}</td>
            </tr>
        </table>
        <hr>
        <p><b>Please Note:</b> Payment is to be made upon delivery.</p>
        <p style="text-align: center; font-size: 12px; color: #777;">Enjoy your meal,<br/>The Yatra Saral Team</p>
      </div>
    `;
    await sendBrevoEmail(email, `Your Pantry Food Order #${createdOrder.id} is Confirmed!`, emailHtml, name);
  }
  res.status(201).json(createdOrder);
});


// --- API Endpoints for Feedback ---
app.post('/api/feedback', async (req, res) => {
  if (!db) return res.status(503).json({ message: 'Database not connected' });

  const feedbackData = req.body;
  const newFeedback = {
    ...feedbackData,
    submittedAt: new Date().toISOString()
  };

  await db.collection('feedback').insertOne(newFeedback);

  const { name, email, category, message } = feedbackData;

  if (email) {
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px; max-width: 600px; margin: auto; border-radius: 8px;">
        <h1 style="color: #333; text-align: center;">Thank You For Your Feedback!</h1>
        <p>Hi ${name},</p>
        <p>We've successfully received your feedback and appreciate you taking the time to help us improve our service. A member of our team will review it shortly.</p>
        <hr>
        <h3 style="color: #555;">Your Submission Summary:</h3>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
            <p><b>Category:</b> ${category}</p>
            <p><b>Message:</b></p>
            <p><i>"${message}"</i></p>
        </div>
        <hr>
        <p style="text-align: center; font-size: 12px; color: #777;">Sincerely,<br/>The Yatra Saral Team</p>
      </div>
    `;
    await sendBrevoEmail(email, `We've Received Your Feedback`, emailHtml, name);
  }
  res.status(201).json({ message: 'Feedback submitted successfully' });
});


// Sends Sign Up OTP and checks if user exists ---
app.post('/api/send-signup-otp', async (req, res) => {
  if (!db) return res.status(503).json({ message: 'Database not connected' });
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const existingUser = await db.collection('users').findOne({ email: email });
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const html = `<div style="font-family: sans-serif; text-align: center; padding: 20px;">
            <h2>Email Verification</h2>
            <p>Thank you for signing up. Please use the following code to verify your email address:</p>
            <p style="font-size: 24px; font-weight: bold; letter-spacing: 5px; background: #f0f0f0; padding: 10px; border-radius: 5px;">
              ${otp}
            </p>
          </div>`;

    await sendBrevoEmail(email, 'Your Verification Code for Yatra Saral', html);
    res.status(200).json({ message: 'OTP sent successfully', otp: otp });

  } catch (error) {
    res.status(500).json({ message: 'Failed to send verification email.' });
  }
});

// --- Your existing Authentication endpoints ---
app.post('/api/register', async (req, res) => {
  if (!db) return res.status(503).json({ message: 'Database not connected' });
  const { name, email, phone, password } = req.body;

  const existingUser = await db.collection('users').findOne({ email: email });
  if (existingUser) {
    return res.status(409).json({ message: 'User with this email already exists.' });
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const result = await db.collection('users').insertOne({ name, email, phone, password: hashedPassword });
  const newUser = await db.collection('users').findOne({ _id: result.insertedId });

  if (newUser) {
    sendWelcomeEmail(newUser.email, newUser.name);
  }

  delete newUser.password;
  res.status(201).json(newUser);
});

app.post('/api/login', async (req, res) => {
  if (!db) return res.status(503).json({ message: 'Database not connected' });
  const { email, password } = req.body;

  const user = await db.collection('users').findOne({ email: email });

  const passwordMatch = user ? await bcrypt.compare(password, user.password) : false;

  if (user && passwordMatch) {
    sendWelcomeEmail(user.email, user.name);
    delete user.password;
    res.status(200).json(user);
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

app.post('/api/reset-password', async (req, res) => {
  if (!db) return res.status(503).json({ message: 'Database not connected' });
  const { email, newPassword } = req.body;

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  const result = await db.collection('users').updateOne(
    { email: email },
    { $set: { password: hashedPassword } }
  );
  if (result.matchedCount === 0) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json({ message: 'Password updated successfully' });
});

// --- API Endpoints for User Settings ---
app.post('/api/users/change-password', async (req, res) => {
  if (!db) return res.status(503).json({ message: 'Database not connected' });
  const { email, currentPassword, newPassword } = req.body;
  const user = await db.collection('users').findOne({ email: email });

  const passwordMatch = user ? await bcrypt.compare(currentPassword, user.password) : false;

  if (!user || !passwordMatch) {
    return res.status(401).json({ message: 'Invalid credentials or user not found' });
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  const result = await db.collection('users').updateOne(
    { email: email },
    { $set: { password: hashedPassword } }
  );
  if (result.modifiedCount === 0) {
    return res.status(500).json({ message: 'Could not update password' });
  }
  res.status(200).json({ message: 'Password updated successfully' });
});

app.delete('/api/users/delete-account', async (req, res) => {
  if (!db) return res.status(503).json({ message: 'Database not connected' });
  const { email, password } = req.body;
  const user = await db.collection('users').findOne({ email: email });

  const passwordMatch = user ? await bcrypt.compare(password, user.password) : false;

  if (!user || !passwordMatch) {
    return res.status(401).json({ message: 'Invalid password. Could not delete account.' });
  }

  await db.collection('users').deleteOne({ email: email });
  res.status(200).json({ message: 'Account deleted successfully' });
});

// --- API Endpoints for Service Bookings ---
app.get('/api/bookings/:email', async (req, res) => {
  if (!db) return res.status(503).json({ message: 'Database not connected' });
  const { email } = req.params;
  const bookings = await db.collection('bookings').find({ userEmail: email }).toArray();
  res.json(bookings);
});

app.post('/api/bookings', async (req, res) => {
  if (!db) return res.status(503).json({ message: 'Database not connected' });

  const bookingData = req.body;
  const bookingId = 'SB' + Math.random().toString(36).substr(2, 9).toUpperCase();
  const newBooking = {
    id: bookingId,
    ...bookingData,
    status: 'Confirmed',
    bookedAt: new Date().toISOString()
  };

  const result = await db.collection('bookings').insertOne(newBooking);
  const createdBooking = await db.collection('bookings').findOne({ _id: result.insertedId });

  const { name, email, service, station, date, time, price, hours } = bookingData;

  if (email) {
    let introductoryParagraph = '';
    let finalInstruction = '';

    switch (service) {
      case 'Cloak Room':
        introductoryParagraph = `Your booking for the Cloak Room is confirmed. You can now securely store your luggage at our facility.`;
        finalInstruction = `Please show this confirmation email and a valid photo ID at the Cloak Room counter to deposit your luggage.`;
        break;

      case 'Coolie Service':
        introductoryParagraph = `Your request for a Coolie (Porter) is confirmed. A licensed porter will be available to assist you with your luggage.`;
        finalInstruction = `Please look for a licensed porter in a red uniform at your designated platform and show them this booking confirmation.`;
        break;

      case 'Wheelchair Assistance':
        introductoryParagraph = `Your request for Wheelchair Assistance is confirmed. Our staff is ready to ensure a smooth and comfortable transit through the station.`;
        finalInstruction = `Please approach the Station Manager's office or the main inquiry counter upon arrival and show this confirmation email. Our staff will assist you from there.`;
        break;

      case 'Dormitory':
        introductoryParagraph = `Your booking for a bed in the railway Dormitory is confirmed. Enjoy a comfortable rest during your transit.`;
        finalInstruction = `Please proceed to the Dormitory reception at the station and present this confirmation email along with a valid photo ID to check in.`;
        break;

      default:
        introductoryParagraph = `Your request for ${service} has been confirmed. Our staff will be available to assist you. Please find the details of your booking below:`;
        finalInstruction = `Please show this email to our staff at the station for assistance.`;
        break;
    }

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px; max-width: 600px; margin: auto; border-radius: 8px;">
        <h1 style="color: #17a2b8; text-align: center;">Service Booking Confirmed!</h1>
        <p>Hi ${name},</p>
        <p>${introductoryParagraph}</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; text-align: center; margin-bottom: 20px;">
            <h3 style="margin: 0;">Booking ID: <span style="color: #333; letter-spacing: 1px;">${createdBooking.id}</span></h3>
        </div>

        <table style="width: 100%; border-collapse: collapse;">
            <tr style="background-color: #f8f9fa;">
                <td style="padding: 10px; font-weight: bold;">Service Booked:</td>
                <td style="padding: 10px;"><b>${service}</b></td>
            </tr>
            <tr>
                <td style="padding: 10px; font-weight: bold;">Station:</td>
                <td style="padding: 10px;">${station}</td>
            </tr>
            <tr style="background-color: #f8f9fa;">
                <td style="padding: 10px; font-weight: bold;">Date & Time:</td>
                <td style="padding: 10px;">${date} at ${time}</td>
            </tr>
             <tr>
                <td style="padding: 10px; font-weight: bold;">Duration:</td>
                <td style="padding: 10px;">${hours} ${hours > 1 ? 'Hours' : 'Hour'}</td>
            </tr>
             <tr style="background-color: #f8f9fa;">
                <td style="padding: 10px; font-weight: bold;">Total Amount Paid:</td>
                <td style="padding: 10px;">₹${price}</td>
            </tr>
        </table>
        <hr style="margin-top: 20px;">
        <p style="text-align: center; font-size: 12px; color: #777;">${finalInstruction}<br/>The Yatra Saral Team</p>
      </div>
    `;
    await sendBrevoEmail(email, `Service Booking Confirmed [ID: ${createdBooking.id}]`, emailHtml, name);
  }

  res.status(201).json(createdBooking);
});

// --- API Endpoints for Ticket Management ---
app.patch('/api/tickets/:id/cancel', async (req, res) => {
  if (!db) return res.status(503).json({ message: 'Database not connected' });
  const { id } = req.params;
  const result = await db.collection('tickets').updateOne(
    { id: id },
    { $set: { status: 'Cancelled' } }
  );
  if (result.matchedCount === 0) {
    return res.status(404).json({ message: 'Ticket not found' });
  }
  await db.collection('alertSubscriptions').deleteOne({ pnr: id });
  console.log(`Removed alert subscription for cancelled PNR: ${id}`);
  res.status(200).json({ message: 'Ticket cancelled and alert subscription removed successfully' });
});

app.delete('/api/tickets/cancelled', async (req, res) => {
  if (!db) return res.status(503).json({ message: 'Database not connected' });
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }
  await db.collection('tickets').deleteMany({
    status: 'Cancelled',
    $or: [
      { 'passenger.email': email },
      { 'email': email }
    ]
  });
  res.status(200).json({ message: 'Cancelled tickets removed successfully' });
});

// --- API Endpoints for Deleting History Items ---
const deleteItemById = async (collectionName, id, res) => {
  if (!db) return res.status(503).json({ message: 'Database not connected' });
  try {
    const result = await db.collection(collectionName).deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete item' });
  }
};
app.delete('/api/food-orders/:id', (req, res) => deleteItemById('food-orders', req.params.id, res));
app.delete('/api/complaints/:id', (req, res) => deleteItemById('complaints', req.params.id, res));
app.delete('/api/bookings/:id', (req, res) => deleteItemById('bookings', req.params.id, res));
app.delete('/api/tickets/:id', async (req, res) => {
  if (!db) return res.status(503).json({ message: 'Database not connected' });
  try {
    const result = await db.collection('tickets').deleteOne({ id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    res.status(200).json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete ticket' });
  }
});

// --- API Endpoints for Group Ticket Booking ---
app.post('/api/group-tickets', async (req, res) => {
  if (!db) return res.status(503).json({ message: 'Database not connected' });
  const ticketData = req.body;
  const ticketId = 'GRP' + Math.random().toString(36).substr(2, 9).toUpperCase();
  const newGroupTicket = {
    id: ticketId,
    ...ticketData,
    isGroup: true,
    status: 'Confirmed',
    bookedAt: new Date().toISOString()
  };
  const result = await db.collection('tickets').insertOne(newGroupTicket);
  const createdTicket = await db.collection('tickets').findOne({ _id: result.insertedId });
  res.status(201).json(createdTicket);
});

// --- API Endpoints for Platform Tickets ---
app.get('/api/platform-tickets/:email', async (req, res) => {
  if (!db) return res.status(503).json({ message: 'Database not connected' });
  const { email } = req.params;
  const tickets = await db.collection('platform-tickets').find({ userEmail: email }).toArray();
  res.json(tickets);
});
app.post('/api/platform-tickets', async (req, res) => {
  if (!db) return res.status(503).json({ message: 'Database not connected' });
  const ticketData = req.body;
  const ticketId = 'PT-' + Date.now().toString(36).toUpperCase();
  const newTicketPurchase = {
    id: ticketId,
    ...ticketData,
    date: new Date().toISOString(),
  };

  const result = await db.collection('platform-tickets').insertOne(newTicketPurchase);
  const createdTicket = await db.collection('platform-tickets').findOne({ _id: result.insertedId });

  const { station, count, email, price, paymentMethod } = ticketData;

  if (email) {
    const ticketHtml = `
        <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px; max-width: 600px; margin: auto; border-radius: 8px;">
            <h1 style="color: #333; text-align: center;">Platform Ticket Confirmation</h1>
            <p>Hi there,</p>
            <p>Thank you for your purchase. Here are your platform ticket details:</p>
            <hr>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px; font-weight: bold;">Station:</td>
                    <td style="padding: 8px;">${station}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; font-weight: bold;">Number of Tickets:</td>
                    <td style="padding: 8px;">${count}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; font-weight: bold;">Total Price:</td>
                    <td style="padding: 8px;">₹${price}</td>
                </tr>
                 <tr>
                    <td style="padding: 8px; font-weight: bold;">Payment Method:</td>
                    <td style="padding: 8px;">${paymentMethod}</td>
                </tr>
            </table>
            <hr>
            <p style="text-align: center; font-size: 12px; color: #777;">This is an automated email. Please do not reply.</p>
        </div>
    `;
    await sendBrevoEmail(email, `Your Platform Ticket for ${station}`, ticketHtml);
  }
  res.status(201).json(createdTicket);
});

// --- API Endpoints for Travel Insurance ---
app.get('/api/insurance-applications/:email', async (req, res) => {
  if (!db) return res.status(503).json({ message: 'Database not connected' });
  const { email } = req.params;
  const applications = await db.collection('insurance-applications').find({ userEmail: email }).toArray();
  res.json(applications);
});

app.post('/api/insurance-applications', async (req, res) => {
  if (!db) return res.status(503).json({ message: 'Database not connected' });

  const applicationData = req.body;
  const applicationId = 'INS-' + Date.now().toString(36).toUpperCase();
  const newApplication = {
    id: applicationId,
    ...applicationData,
    submittedAt: new Date().toISOString()
  };

  const result = await db.collection('insurance-applications').insertOne(newApplication);
  const createdApplication = await db.collection('insurance-applications').findOne({ _id: result.insertedId });

  const {
    selectedPlan,
    planPrice,
    tripDuration,
    fullName,
    email,
    destination,
    startDate,
    endDate
  } = applicationData;

  if (email) {
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px; max-width: 600px; margin: auto; border-radius: 8px;">
        <h1 style="color: #007bff; text-align: center;">Travel Insurance Application Received</h1>
        <p>Hi ${fullName},</p>
        <p>Thank you for submitting your travel insurance application. We have received your details and your policy is now being processed. Here is a summary of your application:</p>
        <hr>
        <table style="width: 100%; border-collapse: collapse;">
            <tr style="background-color: #f8f9fa;">
                <td style="padding: 10px; font-weight: bold;">Plan Selected:</td>
                <td style="padding: 10px;"><b>${selectedPlan}</b></td>
            </tr>
            <tr>
                <td style="padding: 10px; font-weight: bold;">Price:</td>
                <td style="padding: 10px;">${planPrice}</td>
            </tr>
            <tr style="background-color: #f8f9fa;">
                <td style="padding: 10px; font-weight: bold;">Destination:</td>
                <td style="padding: 10px;">${destination}</td>
            </tr>
            <tr>
                <td style="padding: 10px; font-weight: bold;">Trip Dates:</td>
                <td style="padding: 10px;">${startDate} to ${endDate} (${tripDuration})</td>
            </tr>
        </table>
        <hr>
        <p>You will receive your official policy documents in a separate email shortly. Please keep this confirmation for your records.</p>
        <p style="text-align: center; font-size: 12px; color: #777;">Safe travels,<br/>The Yatra Saral Team</p>
      </div>
    `;
    await sendBrevoEmail(email, `Your Travel Insurance Application for ${destination} is Confirmed!`, emailHtml, fullName);
  }
  res.status(201).json(createdApplication);
});

// --- API Endpoints for Seat Upgrades ---
app.get('/api/seat-upgrades/:email', async (req, res) => {
  if (!db) return res.status(503).json({ message: 'Database not connected' });
  const { email } = req.params;
  const upgrades = await db.collection('seat-upgrades').find({ userEmail: email }).toArray();
  res.json(upgrades);
});

app.post('/api/seat-upgrades', async (req, res) => {
  if (!db) return res.status(503).json({ message: 'Database not connected' });

  const upgradeData = req.body;
  const upgradeId = 'UPG-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  const newUpgradeRequest = {
    id: upgradeId,
    ...upgradeData,
    date: new Date().toISOString(),
  };

  const result = await db.collection('seat-upgrades').insertOne(newUpgradeRequest);
  const createdUpgrade = await db.collection('seat-upgrades').findOne({ _id: result.insertedId });

  const { pnr, from, to, requestWindowSeat, status, userEmail } = upgradeData;

  if (userEmail) {
    let title = status === 'Confirmed Upgrade' ? 'Your Seat Upgrade is Confirmed!' : 'Your Seat Upgrade is Waitlisted';
    let infoParagraph = '';

    if (status === 'Confirmed Upgrade') {
      infoParagraph = `Congratulations! Your seat upgrade request has been successfully confirmed. Any fare difference, if applicable, will be collected by the TTE on board the train.`;
    } else {
      infoParagraph = `Your request to be on the waitlist for a seat upgrade has been received. You will be notified via email and SMS if an upgrade becomes available.`;
    }

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px; max-width: 600px; margin: auto; border-radius: 8px;">
        <h1 style="color: #4f46e5; text-align: center;">${title}</h1>
        <p>Hi there,</p>
        <p>${infoParagraph}</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; text-align: center; margin-bottom: 20px;">
            <h3 style="margin: 0;">Request ID: <span style="color: #333; letter-spacing: 1px;">${createdUpgrade.id}</span></h3>
        </div>

        <table style="width: 100%; border-collapse: collapse;">
            <tr style="background-color: #f8f9fa;">
                <td style="padding: 10px; font-weight: bold;">PNR Number:</td>
                <td style="padding: 10px;">${pnr}</td>
            </tr>
            <tr>
                <td style="padding: 10px; font-weight: bold;">From Coach:</td>
                <td style="padding: 10px;">${from}</td>
            </tr>
            <tr style="background-color: #f8f9fa;">
                <td style="padding: 10px; font-weight: bold;">To Class:</td>
                <td style="padding: 10px;"><b>${to}</b></td>
            </tr>
             <tr>
                <td style="padding: 10px; font-weight: bold;">Window Seat Preference:</td>
                <td style="padding: 10px;">${requestWindowSeat ? 'Yes' : 'No'}</td>
            </tr>
            <tr style="background-color: #f8f9fa;">
                <td style="padding: 10px; font-weight: bold;">Final Status:</td>
                <td style="padding: 10px; font-weight: bold; color: ${status === 'Confirmed Upgrade' ? '#16a34a' : '#f59e0b'};">${status}</td>
            </tr>
        </table>
        <hr style="margin-top: 20px;">
        <p style="text-align: center; font-size: 12px; color: #777;">Wishing you a comfortable journey!<br/>The Yatra Saral Team</p>
      </div>
    `;
    await sendBrevoEmail(userEmail, `Seat Upgrade Update for PNR ${pnr} [ID: ${createdUpgrade.id}]`, emailHtml);
  }
  res.status(201).json(createdUpgrade);
});

// --- API Endpoint for PNR Verification ---
app.post('/api/tickets/verify-pnr', async (req, res) => {
  if (!db) return res.status(503).json({ message: 'Database not connected' });
  const { pnr, email } = req.body;
  if (!pnr || !email) {
    return res.status(400).json({ message: 'PNR and email are required' });
  }
  const ticket = await db.collection('tickets').findOne({
    id: pnr,
    $or: [
      { 'passenger.email': email },
      { 'email': email }
    ]
  });
  if (ticket) {
    res.status(200).json({ success: true, ticket: ticket });
  } else {
    res.status(404).json({ success: false, message: 'PNR not found or does not belong to this user.' });
  }
});

// --- API Endpoints for Travel Alerts ---
app.post('/api/subscribe-alerts', async (req, res) => {
  if (!db) return res.status(503).json({ message: 'Database not connected' });
  const { pnr, email } = req.body;
  if (!pnr || !email) {
    return res.status(400).json({ message: 'PNR and email are required' });
  }
  const ticket = await db.collection('tickets').findOne({
    id: pnr,
    status: { $ne: 'Cancelled' },
    $or: [
      { 'passenger.email': email },
      { 'email': email }
    ]
  });
  if (!ticket) {
    return res.status(404).json({ message: 'Valid, active PNR not found for this email address.' });
  }
  const existingSubscription = await db.collection('alertSubscriptions').findOne({ pnr: pnr });
  if (existingSubscription) {
    return res.status(409).json({ message: 'You are already subscribed for alerts for this PNR.' });
  }
  const newSubscription = {
    pnr,
    email,
    trainNumber: ticket.trainNumber,
    journeyDate: ticket.date,
    subscribedAt: new Date(),
  };
  await db.collection('alertSubscriptions').insertOne(newSubscription);
  res.status(201).json({ message: `Successfully subscribed for alerts for PNR ${pnr}.` });
});

app.delete('/api/unsubscribe-alerts/:pnr', async (req, res) => {
  if (!db) return res.status(503).json({ message: 'Database not connected' });
  const { pnr } = req.params;
  await db.collection('alertSubscriptions').deleteOne({ pnr: pnr });
  res.status(204).send();
});


// --- Budget Report Email ---
app.post('/api/send-budget-report', async (req, res) => {
  if (!db) return res.status(503).json({ message: 'Database not connected' });

  const { items, totalCost, email, name } = req.body;

  if (!email || !items || !Array.isArray(items) || totalCost === undefined) {
    return res.status(400).json({ message: 'Missing required data for the report.' });
  }

  try {
    const itemRows = items.map(item => `
        <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">₹${item.cost.toFixed(2)}</td>
        </tr>
    `).join('');

    const emailHtml = `
        <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px; max-width: 600px; margin: auto; border-radius: 8px;">
            <h1 style="color: #af19ff; text-align: center;">Your Trip Budget Report</h1>
            <p>Hi ${name || 'there'},</p>
            <p>Here is the budget you prepared for your upcoming trip using the Yatra Saral Budget Calculator.</p>
            <hr>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th style="padding: 8px; text-align: left; background-color: #f8f9fa;">Category</th>
                        <th style="padding: 8px; text-align: right; background-color: #f8f9fa;">Cost</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemRows}
                </tbody>
                <tfoot>
                    <tr style="font-weight: bold; border-top: 2px solid #ddd;">
                        <td style="padding: 10px;">Total Estimated Budget</td>
                        <td style="padding: 10px; text-align: right; font-size: 18px; color: #af19ff;">₹${totalCost.toFixed(2)}</td>
                    </tr>
                </tfoot>
            </table>
            <hr style="margin-top: 20px;">
            <p style="text-align: center; font-size: 12px; color: #777;">Happy and safe travels!<br/>The Yatra Saral Team</p>
        </div>
    `;
    await sendBrevoEmail(email, 'Your Yatra Saral Trip Budget Report', emailHtml, name);
    res.status(200).json({ message: 'Report sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send report email.' });
  }
});

// --- Travel Checklist Email ---
app.post('/api/send-travel-checklist', async (req, res) => {
  if (!db) return res.status(503).json({ message: 'Database not connected' });

  const { checklist, email, name } = req.body;

  if (!email || !checklist) {
    return res.status(400).json({ message: 'Email and checklist are required' });
  }

  try {
    let checklistHtml = '';
    Object.entries(checklist).forEach(([category, items]) => {
      checklistHtml += `<h3 style="color:#2d6a4f;">${category}</h3><ul>`;
      items.forEach(item => {
        checklistHtml += `<li>${item.completed ? '✅' : '⬜'} ${item.label}</li>`;
      });
      checklistHtml += '</ul>';
    });

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height:1.6;">
        <h2 style="color:#1b4332;">Travel Checklist Report</h2>
        <p>Hello ${name || 'Traveler'},</p>
        <p>Here’s your travel checklist summary from <strong>Yatra Saral</strong>:</p>
        ${checklistHtml}
        <p style="margin-top:20px;">✅ Safe travels and enjoy your journey!</p>
      </div>
    `;
    await sendBrevoEmail(email, "Your Travel Checklist - Yatra Saral", htmlContent, name);
    res.json({ success: true, message: 'Travel checklist emailed successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send travel checklist email' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
