import React from 'react';
import { motion } from 'framer-motion';
import { getEmotionGradient } from '../utils/emotionColors';
import ParticleLayer from './ParticleLayer';

export default function AnimatedBackground({ emotion = 'neutral', children }) {
  const gradientClass = getEmotionGradient(emotion);

  return (
    <div className="relative min-h-screen w-full bg-[#020617] overflow-hidden text-zinc-100">
      {/* Dynamic Background Gradient */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-30`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />

      {/* Floating Blur Orbs */}
      <motion.div 
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500 rounded-full mix-blend-screen filter blur-[128px] opacity-20 pointer-events-none"
      />
      <motion.div 
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-[128px] opacity-20 pointer-events-none"
      />

      {/* Particle Layer */}
      <ParticleLayer emotion={emotion} />

      {/* Content */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}