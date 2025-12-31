# Yatra Saral - Your Journey Made Simple ✨

An advanced, feature-rich web application designed to revolutionize the train travel experience in India. Yatra Saral provides a seamless, intuitive, and all-in-one platform for booking tickets, planning detailed journeys, and accessing a comprehensive suite of on-the-go services. Built with a modern tech stack including React, Vite, Node.js, and shadcn/ui for a fast, responsive, and accessible experience.

Website link - <a href="https://yatrasaral.onrender.com/" target="_blank" rel="noopener noreferrer">www.yatrasaral.com</a>

## 🚀 Core Features

-   **Seamless Authentication:** Secure user registration, login, and password recovery Forgot Password workflows. OTP verification via email ensures a secure sign-up process.
-   **Comprehensive User Profile:** A central hub for users to manage their activity history, saved passengers, and personal settings.
-   **Dynamic Ticket Management:** Easily view, download, or cancel booked tickets directly from the user dashboard.
-   **Advanced Trip Planning Tools:** From creating detailed itineraries with the Trip Planner to managing expenses with the Budget Calculator, users have everything they need to plan their journey.
-   **Real-time Information:** Integrated service like Weather Forecasts keep travelers informed and prepared.
-   **Accessibility Focused:** Multi-language support (English & Hindi), adjustable font sizes, and a "Read Aloud" feature ensure the platform is usable by everyone.
-   **Favorites System:** Users can mark their most-used services for quick and easy access.
-   **Modern, Animated UI:** Built with Framer Motion for smooth transitions and a delightful user experience, including an engaging preloader animation.
-   **Emergency Support:** A dedicated page with quick access to emergency contacts and information.
-   **Feedback and Complaints:** A streamlined process for users to provide feedback or file complaints.
-   **FAQ Section:** A comprehensive FAQ section to answer common user queries.

## 🛤️ Our Services

| Service               | Description                                                 | Features                                                    |
| :-------------------- | :---------------------------------------------------------- | :---------------------------------------------------------- |
| **Train Booking** | Complete ticket booking with multiple coach options.        | Multiple classes, Seat selection, E-ticket generation       |
| **Group Booking** | Easily book tickets for large groups and enjoy special discounts | E-ticket generation, For large groups                          |
| **Platform Services** | Book cloak rooms, coolies, wheelchairs, and dormitories.   | Instant booking, Flexible timing, Secure payments           |
| **Pantry Food** | Order fresh meals delivered to your seat.                   | Veg/Non-veg/Jain options, 30-min delivery, Quality assured  |
| **View Tickets** | Manage all your booked tickets in one place.                | Download tickets, Booking history, Cancel/modify            |
| **Live Train Tracking**| Track your train's location and status                | Current Status, Arrival/departure times, Platform numbers   |
| **Travel Insurance** | Secure your journey with comprehensive travel insurance     | Comprehensive coverage, Easy claims, Affordable premium     |
| **Travel Alerts** | Get notifications about delays, cancellations, and platform changes | Delay notifications, Cancellation alerts, Platform changes      |
| **Seat Upgrades** | Upgrade your seat class before or during travel             | Upgrade class, Request window seat, Check availability      |
| **Platform Tickets** | Buy platform entry tickets for non-passengers               | Instant digital ticket, Valid for 2 hours, For non-passengers |
| **Weather Forecast** | Get accurate weather updates for your destination           | Hourly updates, 5-day forecast, For any station, city       |
| **Trip Planner** | Create detailed day-by-day itineraries                      | Day-by-day plans, Save itineraries, Printable view          |
| **Budget Calculator** | Plan your travel expenses with our smart budget tracking tool | Track expenses, Set budget limits, Export reports           |
| **Travel Checklist** | Never forget important items with our travel checklist      | Pre-built checklist, Add custom items, Export the list      |
| **File Complaint** | Report issues with train services.                          | Quick resolution, Status tracking, RPF support              |
## 🛠️ Tech Stack

* **Frontend Framework:** React with Vite
* **Language:** TypeScript
* **UI Components:** shadcn/ui
* **Styling:** Tailwind CSS
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **Deployment** Git, GitHub, Render

## 📂 Project Structure

```
Yatra-Saral-Web-Application/
├── yatra-saral-backend/
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
├── public/
│   ├── favicon.ico
│   ├── placeholder.svg
│   ├── robots.txt
│   └── train.jpg
├── src/
│   ├── assets/
│   │   ├── me.png
│   │   ├── p1.jpg
│   │   ├── p2.jpg
│   │   └── p3.jpg
│   ├── components/
│   │   ├── services/
│   │   │   ├── BudgetCalculatorPage.tsx
│   │   │   ├── GroupBookingPage.tsx
│   │   │   ├── LiveTrainTrackingPage.tsx
│   │   │   ├── PlatformTicketsPage.tsx
│   │   │   ├── SeatUpgradesPage.tsx
│   │   │   ├── TravelAlertsPage.tsx
│   │   │   ├── TravelChecklistPage.tsx
│   │   │   ├── TravelInsurancePage.tsx
│   │   │   ├── TripPlannerPage.tsx
│   │   │   └── WeatherForecastPage.tsx
│   │   ├── ui/
│   │   │   ├── accordion.tsx
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── alert.tsx
│   │   │   ├── aspect-ratio.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── breadcrumb.tsx
│   │   │   ├── button.tsx
│   │   │   ├── calendar.tsx
│   │   │   ├── card.tsx
│   │   │   ├── carousel.tsx
│   │   │   ├── chart.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── collapsible.tsx
│   │   │   ├── command.tsx
│   │   │   ├── context-menu.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── drawer.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── form.tsx
│   │   │   ├── hover-card.tsx
│   │   │   ├── input-otp.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── menubar.tsx
│   │   │   ├── navigation-menu.tsx
│   │   │   ├── pagination.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── radio-group.tsx
│   │   │   ├── resizable.tsx
│   │   │   ├── scroll-area.tsx
│   │   │   ├── select.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── slider.tsx
│   │   │   ├── sonner.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── toaster.tsx
│   │   │   ├── toggle-group.tsx
│   │   │   ├── toggle.tsx
│   │   │   ├── tooltip.tsx
│   │   │   └── use-toast.ts
│   │   ├── AboutPage.tsx
│   │   ├── AuthModal.tsx
│   │   ├── BookingServicesPage.tsx
│   │   ├── ComplaintPage.tsx
│   │   ├── ContactPage.tsx
│   │   ├── EmergencyPage.tsx
│   │   ├── FAQPage.tsx
│   │   ├── FeedbackPage.tsx
│   │   ├── Header.tsx
│   │   ├── HistoryPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── PantryFoodPage.tsx
│   │   ├── Preloader.tsx
│   │   ├── SavedPassengersPage.tsx
│   │   ├── ServicesPage.tsx
│   │   ├── SettingsPage.tsx
│   │   ├── Sidebar.tsx
│   │   ├── TrainBookingPage.tsx
│   │   └── ViewTicketsPage.tsx
│   ├── contexts/
│   │   └── AppContext.tsx
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib/
│   │   └── utils.ts
│   ├── pages/
│   │   ├── Index.tsx
│   │   └── NotFound.tsx
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── .gitignore
├── bun.lockb
├── components.json
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.app.json
├── tsconfig.json
└── tsconfig.node.json
```

## ⚙️ Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Rudragupta23/Yatra-Saral-Web-Application.git
    cd Yatra-Saral-Web-Application
    ```

2.  **Install frontend dependencies:**
    ```bash
    npm install
    ```

3.  **Install backend dependencies:**
    ```bash
    cd yatra-saral-backend
    npm install
    ```

## ▶️ Usage

To run the application, you need to run both the frontend and backend servers.

1.  **Run the backend server:**
    ```bash
    cd yatra-saral-backend
    node server.js
    ```

2.  **Run the frontend development server:**
    ```bash
    cd Yatra-Saral-Web-Application
    npm run dev
    ```

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

Please read `CODE_OF_CONDUCT.md` for details on our code of conduct and the process for submitting pull requests to us.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
