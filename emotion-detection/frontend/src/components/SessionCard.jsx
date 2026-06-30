import React from 'react';

import {
  Calendar,
  Clock
} from 'lucide-react';

export default function SessionCard({

  session

}) {

  const date =
    new Date(session.timestamp);

  return (

    <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-4">

      <div className="flex justify-between items-center mb-3">

        <div className="flex items-center gap-2 text-slate-400 text-sm">

          <Calendar className="w-4 h-4" />

          <span>

            {date.toLocaleDateString()}

          </span>

        </div>

        <div className="flex items-center gap-2 text-slate-400 text-sm">

          <Clock className="w-4 h-4" />

          <span>

            {date.toLocaleTimeString()}

          </span>

        </div>

      </div>

      <div className="flex items-center justify-between">

        <div>

          <p className="text-slate-200 font-semibold">

            {session.stable_emotion}

          </p>

          <p className="text-xs text-slate-500">

            Stable Emotion

          </p>

        </div>

        <div>

          <p className="text-emerald-400 font-bold">

            {session.confidence}%

          </p>

          <p className="text-xs text-slate-500">

            Confidence

          </p>

        </div>

      </div>

    </div>
  );
}