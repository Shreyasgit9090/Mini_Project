import React from 'react';
import { motion } from 'framer-motion';
import { Music, PlayCircle } from 'lucide-react';
import { getEmotionColor } from '../utils/emotionColors';

export default function MusicCard({ spotifyData, emotion }) {
  const color = getEmotionColor(emotion);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-[35px] p-6 relative overflow-hidden group shadow-lg flex flex-col h-full"
    >
      <div 
        className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"
        style={{ 
          background: `radial-gradient(circle at 80% 20%, ${color}, transparent 60%)` 
        }}
      />

      <div className="flex items-center justify-between mb-6 relative z-10">
        <h3 className="text-slate-400 font-medium flex items-center gap-2">
          <Music className="w-5 h-5" style={{ color }} />
          AI Soundtrack
        </h3>
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>

      <div className="flex-1 flex flex-col relative z-10">
        <p className="text-slate-300 text-sm mb-4 italic px-2 border-l-2" style={{ borderColor: color }}>
          "{spotifyData.message}"
        </p>
        
        <div className="flex-1 min-h-[152px] rounded-2xl overflow-hidden border border-slate-800 relative group/player">
          {spotifyData.playlistUrl ? (
            <iframe
              src={spotifyData.playlistUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="absolute inset-0 w-full h-full"
            ></iframe>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800/30 text-slate-500 gap-3">
              <PlayCircle className="w-10 h-10 opacity-50" />
              <span className="text-sm">Connecting to Spotify...</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}