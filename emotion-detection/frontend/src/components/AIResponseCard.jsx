import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Sparkles } from 'lucide-react';
import TypingAnimation from './TypingAnimation';

export default function AIResponseCard({ message, emotion, isThinking }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-lg h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-400 font-medium flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-emerald-400" />
          Aura's Analysis
        </h3>
        {isThinking && (
          <div className="flex gap-1">
            <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity }} className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
          </div>
        )}
      </div>

      <div className="bg-slate-800/30 rounded-2xl p-4 border border-slate-700/50 min-h-[100px] relative">
        <Sparkles className="absolute top-4 right-4 w-4 h-4 text-slate-600" />
        {isThinking ? (
          <p className="text-slate-400 italic text-sm">Analyzing current emotional state...</p>
        ) : (
          <p className="text-slate-200 text-sm leading-relaxed">
             <TypingAnimation text={message || "I am monitoring your emotions to provide the best environment."} delay={30} />
          </p>
        )}
      </div>
    </motion.div>
  );
}
