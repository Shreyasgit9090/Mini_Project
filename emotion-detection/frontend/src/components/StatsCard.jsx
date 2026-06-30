import React from 'react';
import { motion } from 'framer-motion';

export default function StatsCard({ title, value, subtitle, icon: Icon, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 relative overflow-hidden group"
    >
      <div 
        className="absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"
        style={{ backgroundColor: color }}
      />
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-slate-400 font-medium mb-1">{title}</p>
          <h4 className="text-3xl font-bold text-slate-100">{value}</h4>
          {subtitle && (
            <p className="text-sm text-slate-500 mt-2">{subtitle}</p>
          )}
        </div>
        <div 
          className="p-3 rounded-2xl bg-slate-800/50"
          style={{ color }}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
}
