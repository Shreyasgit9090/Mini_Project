import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Calibration from './pages/Calibration';

import Dashboard from './pages/Dashboard';
import Activity from './pages/Activity';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import { Toaster } from 'react-hot-toast';
import { EmotionProvider } from './context/EmotionContext';

function App() {
  return (
    <EmotionProvider>
      <BrowserRouter>
        <Toaster position="top-right" theme="dark" />
        <Routes>
        {/* PUBLIC: Landing and Auth */}
        <Route path="/" element={<Landing />} />
        
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/calibration" element={<Calibration />} />
        </Route>

        {/* PRIVATE: Main App using MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
    </EmotionProvider>
  );
}

export default App;