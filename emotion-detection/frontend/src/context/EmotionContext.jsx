import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const EmotionContext = createContext();

export const EmotionProvider = ({ children }) => {
  const [emotion, setEmotion] = useState('Neutral');
  const [isConnected, setIsConnected] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  const checkConnection = async () => {
    try {
      // Connect to Flask on 5000
      const res = await axios.get('http://127.0.0.1:5000/health');
      if (res.status === 200 && res.data.status === 'healthy') {
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    } catch (error) {
      setIsConnected(false);
    } finally {
      setCheckingStatus(false);
    }
  };

  useEffect(() => {
    checkConnection();
    // Poll connection status every 10 seconds
    const interval = setInterval(checkConnection, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <EmotionContext.Provider value={{ emotion, setEmotion, isConnected, checkConnection, checkingStatus }}>
      {children}
    </EmotionContext.Provider>
  );
};

export const useEmotion = () => {
  const context = useContext(EmotionContext);
  if (!context) {
    throw new Error('useEmotion must be used within an EmotionProvider');
  }
  return context;
};
