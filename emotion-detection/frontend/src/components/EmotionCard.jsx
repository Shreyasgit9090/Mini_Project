import React from 'react';
import { motion } from 'framer-motion';
import { Activity, BrainCircuit } from 'lucide-react';
import { getEmotionColor } from '../utils/emotionColors';

export default function EmotionCard({ title, emotion, confidence, className }) {
  const color = getEmotionColor(emotion);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className={`bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 relative overflow-hidden group shadow-lg ${className}`}
    >
      {/* Background Glow */}
      <div 
        className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"
        style={{ backgroundColor: color }}
      />

      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-slate-400 font-medium flex items-center gap-2">
          <BrainCircuit className="w-5 h-5" style={{ color }} />
          {title}
        </h3>
        {confidence && (
          <span className="px-3 py-1 bg-slate-800 rounded-full text-xs font-bold text-slate-300 border border-slate-700">
            {Math.round(confidence)}%
          </span>
        )}
      </div>

      <div className="flex items-end justify-between relative z-10 mt-6">
        <div>
          <motion.p 
            key={emotion}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-bold capitalize tracking-tight"
            style={{ color }}
          >
            {emotion || 'Calibrating...'}
          </motion.p>
        </div>
        
        {/* Miniature waveform visualization */}
        {confidence && (
           <div className="flex items-end gap-1 h-8 opacity-80">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  height: [`${Math.random() * 40 + 20}%`, `${Math.random() * 80 + 20}%`, `${Math.random() * 40 + 20}%`]
                }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                className="w-1.5 rounded-full"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
