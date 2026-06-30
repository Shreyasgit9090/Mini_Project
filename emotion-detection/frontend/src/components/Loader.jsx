import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit } from 'lucide-react';

export default function Loader({ fullScreen = false }) {
  const loaderContent = (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
          scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
        }}
        className="w-16 h-16 rounded-full border-b-2 border-emerald-500 flex items-center justify-center"
      >
        <BrainCircuit className="w-8 h-8 text-cyan-400" />
      </motion.div>
      <motion.p 
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-emerald-400 font-medium tracking-widest text-sm uppercase"
      >
        Initializing Companion...
      </motion.p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-slate-950 flex items-center justify-center z-50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-950 to-slate-950"></div>
        <div className="relative z-10">
          {loaderContent}
        </div>
      </div>
    );
  }

  return loaderContent;
}
