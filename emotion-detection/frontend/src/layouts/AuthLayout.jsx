import React from 'react';
import { Outlet } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';

export default function AuthLayout() {
  return (
    <AnimatedBackground emotion="neutral">
      <div className="flex min-h-screen items-center justify-center p-4 relative z-10">
        <Outlet />
      </div>
    </AnimatedBackground>
  );
}