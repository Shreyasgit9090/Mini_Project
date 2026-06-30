import React from 'react';
import { motion } from 'framer-motion';
import { getEmotionColor } from '../utils/emotionColors';

export default function AIOrb({ emotion = 'neutral', isThinking = false }) {
  const color = getEmotionColor(emotion);
  
  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      {/* Outer Pulse */}
      <motion.div
        animate={{
          scale: isThinking ? [1, 1.4, 1] : [1, 1.2, 1],
          opacity: isThinking ? [0.2, 0.5, 0.2] : [0.1, 0.3, 0.1],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-full blur-2xl"
        style={{ backgroundColor: color }}
      />
      
      {/* Inner Glow Rings */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute w-36 h-36 rounded-full border border-white/10"
        style={{ borderColor: `${color}40`, borderStyle: 'dashed' }}
      />
      
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute w-32 h-32 rounded-full border-2 border-white/5"
        style={{ borderColor: `${color}80`, borderTopColor: 'transparent', borderBottomColor: 'transparent' }}
      />

      {/* Core Orb */}
      <motion.div
        animate={{
          scale: isThinking ? [0.95, 1.05, 0.95] : [0.98, 1.02, 0.98],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-24 h-24 rounded-full overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] z-10"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${color}, #000)`,
          boxShadow: `0 0 60px ${color}80, inset 0 0 20px ${color}`
        }}
      >
        {/* Shine highlight */}
        <div className="absolute top-1 left-2 w-10 h-6 bg-white/30 rounded-full blur-[2px] transform -rotate-45" />
      </motion.div>
    </div>
  );
}