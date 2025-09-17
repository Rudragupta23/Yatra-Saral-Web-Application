import React from 'react';
import { motion } from 'framer-motion';
import { Train } from 'lucide-react';

const containerVariants = {
  start: {
    transition: {
      staggerChildren: 0.1,
    },
  },
  end: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const letterVariants = {
  start: {
    opacity: 0,
    y: 20,
    rotateX: -90,
    filter: 'blur(5px)',
  },
  end: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      damping: 12,
      stiffness: 100,
    },
  },
};

export const Preloader = () => {
  const siteName = "Yatra Saral";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background overflow-hidden">
      <motion.div
        className="relative flex flex-col items-center justify-center"
        variants={containerVariants}
        initial="start"
        animate="end"
      >
        <motion.div
          className="absolute border-2 border-primary rounded-full"
          initial={{ width: 0, height: 0, opacity: 1 }}
          animate={{ width: 400, height: 400, opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }}
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Train className="h-20 w-20 text-primary" style={{ filter: 'drop-shadow(0 0 15px hsl(var(--primary)))' }} />
          </motion.div>
        </motion.div>

        <motion.h1
          className="flex text-5xl md:text-6xl font-black tracking-widest text-primary mt-8"
          variants={containerVariants}
          aria-label={siteName}
        >
          {siteName.split('').map((char, index) => (
            <motion.span
              key={index}
              variants={letterVariants}
              aria-hidden="true"
              className="inline-block"
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.h1>

        <div className="absolute -bottom-16 h-1 w-64 bg-primary/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </div>
  );
};