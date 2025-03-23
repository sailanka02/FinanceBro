// API Keys and Environment Configuration

// This file contains API keys and configuration values for external services.
// For production, replace these values with your own API keys.

const ENV = {
  // Gemini API credentials
  GEMINI_API_KEY: 'AIzaSyAIXbCrtLLCvnNWObKJMRAu0jOUzu_Vzwk', // Sample key for testing - replace with your own for production
  
  // API configuration
  AI_MODEL: 'gemini-2.0-flash',     // The Gemini model to use
  MAX_TOKENS: 300,            // Maximum tokens for AI responses
  TEMPERATURE: 0.7,           // Creativity level (0-1)
  
  // Firebase configuration (already in index.html, kept here for reference)
  FIREBASE_CONFIG: {
    apiKey: "AIzaSyA8nJfZBavuUCYqcaadYx7vB0T0ugNDt4Y",
    authDomain: "stocky-cdd1f.firebaseapp.com",
    projectId: "stocky-cdd1f",
    storageBucket: "stocky-cdd1f.appspot.com",
    messagingSenderId: "1043773682180",
    appId: "1:1043773682180:web:9f23ff50d1d7eb70f0d042",
    measurementId: "G-QL4ZEK3BNT"
  },
  
  // Alpha Vantage API keys (used for stock data)
  ALPHA_VANTAGE_API_KEY: 'KO9Q5OPB94XH9XJR',
  
  // Alpaca API credentials (used for stock trading)
  ALPACA_API_KEY: 'PKJZ113M10RMIAP9C9QW',
  ALPACA_API_SECRET: 'BUrHgl6MdhYlnVHbciq94HEg5YVy8XQREnA7Tc1C',
  ALPACA_BASE_URL: 'https://paper-api.alpaca.markets'
};

// WARNING: In a production environment, never expose API keys in client-side code.
// Use a backend service or environment variables on your server to protect your keys.

// Export the configuration
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ENV;
} else {
  window.ENV = ENV;
} 