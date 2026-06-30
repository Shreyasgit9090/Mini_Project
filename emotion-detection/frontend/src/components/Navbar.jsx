import React from 'react';
import { BrainCircuit } from 'lucide-react';
import { useEmotion } from '../context/EmotionContext';

export default function Navbar() {
  const username = localStorage.getItem("user") || "Commander";
  const { isConnected } = useEmotion();

  return (
    <div className='h-20 w-full px-8 flex items-center justify-between'>

      {/* CONNECTION STATUS */}
      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/40 border border-slate-800 backdrop-blur-xl">
        <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
        <span className="text-xs text-slate-400 font-bold font-mono">
          CORE SERVER: {isConnected ? 'ONLINE' : 'OFFLINE'}
        </span>
      </div>

      {/* PROFILE */}
      <button className='flex items-center gap-3 p-2 pr-5 rounded-full bg-slate-900/40 border border-slate-800 hover:border-emerald-500/40 transition-all duration-300 backdrop-blur-xl group'>

        <div className='w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center overflow-hidden'>

          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`}
            alt='avatar'
            className='w-full h-full'
          />

        </div>

        <div className='flex flex-col items-start'>

          <span className='text-sm font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors'>

            {username}

          </span>

          <span className='text-xs text-slate-500'>

            Companion Premium

          </span>

        </div>

      </button>

    </div>
  );
}