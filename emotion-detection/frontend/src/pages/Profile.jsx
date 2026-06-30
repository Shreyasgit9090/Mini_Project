import React, {

  useEffect,
  useState

} from 'react';

import { motion } from 'framer-motion';

import {

  User,
  Award,
  Flame,
  Brain

} from 'lucide-react';

import API from '../services/api';

export default function Profile() {

  const [

    analytics,
    setAnalytics

  ] = useState(null);

  const [

    loading,
    setLoading

  ] = useState(true);

  useEffect(() => {

    fetchProfile();

  }, []);

  const fetchProfile = async () => {

    try {

      const username =
        localStorage.getItem("user");

      const response =
        await API.get(
          `/analytics/${username}`
        );

      setAnalytics(
        response.data
      );

      setLoading(false);

    } catch (error) {

      console.log(error);

      setLoading(false);
    }
  };

  if (loading) {

    return (

      <div className="flex justify-center items-center min-h-[80vh]">

        <div className="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />

      </div>
    );
  }

  const username =
    localStorage.getItem("user");

  const totalSessions =
    analytics?.total_sessions || 0;

  const dominantMood =
    analytics?.dominant_emotion || "Neutral";

  const averageConfidence =
    analytics?.average_confidence || 0;

  const streak =
    Math.min(
      totalSessions,
      30
    );

  return (

    <div className="max-w-4xl mx-auto space-y-8 pb-12">

      {/* HEADER */}

      <motion.div

        initial={{
          opacity: 0,
          y: 20
        }}

        animate={{
          opacity: 1,
          y: 0
        }}

        className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-[40px] p-8 relative overflow-hidden shadow-2xl"
      >

        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 mt-12">

          {/* AVATAR */}

          <div className="relative">

            <div className="w-32 h-32 rounded-full border-4 border-slate-900 bg-slate-800 overflow-hidden relative">

              <img

                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`}

                alt="Profile"

                className="w-full h-full object-cover"
              />

            </div>

          </div>

          {/* USER */}

          <div className="flex-1 text-center md:text-left mb-2">

            <h1 className="text-3xl font-bold text-white mb-1">

              {username}

            </h1>

            <p className="text-slate-400 font-medium">

              Companion AI Member

            </p>

          </div>

          {/* STATS */}

          <div className="flex gap-4 mb-2">

            <div className="text-center px-4">

              <p className="text-2xl font-bold text-white">

                {totalSessions}

              </p>

              <p className="text-xs text-slate-500 uppercase tracking-wider">

                Sessions

              </p>

            </div>

            <div className="w-px h-10 bg-slate-700"></div>

            <div className="text-center px-4">

              <p className="text-2xl font-bold text-white">

                {averageConfidence}%

              </p>

              <p className="text-xs text-slate-500 uppercase tracking-wider">

                Stability

              </p>

            </div>

          </div>

        </div>

      </motion.div>

      {/* GRID */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* BASELINE */}

        <motion.div

          initial={{
            opacity: 0,
            x: -20
          }}

          animate={{
            opacity: 1,
            x: 0
          }}

          className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6"
        >

          <div className="flex items-center gap-3 mb-6">

            <Brain className="w-6 h-6 text-emerald-400" />

            <h3 className="text-xl font-bold text-slate-200">

              Emotional Profile

            </h3>

          </div>

          <div className="space-y-6">

            {/* DOMINANT */}

            <div>

              <div className="flex justify-between text-sm mb-1">

                <span className="text-slate-300">

                  Dominant Emotion

                </span>

                <span className="text-emerald-400">

                  {dominantMood}

                </span>

              </div>

              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">

                <div

                  className="h-full bg-emerald-500 rounded-full"

                  style={{
                    width: "80%"
                  }}
                />

              </div>

            </div>

            {/* CONFIDENCE */}

            <div>

              <div className="flex justify-between text-sm mb-1">

                <span className="text-slate-300">

                  AI Stability

                </span>

                <span className="text-cyan-400">

                  {averageConfidence}%

                </span>

              </div>

              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">

                <div

                  className="h-full bg-cyan-500 rounded-full"

                  style={{
                    width: `${averageConfidence}%`
                  }}
                />

              </div>

            </div>

            {/* ACTIVITY */}

            <div>

              <div className="flex justify-between text-sm mb-1">

                <span className="text-slate-300">

                  Activity Level

                </span>

                <span className="text-yellow-400">

                  {Math.min(totalSessions, 100)}%

                </span>

              </div>

              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">

                <div

                  className="h-full bg-yellow-500 rounded-full"

                  style={{
                    width: `${Math.min(totalSessions, 100)}%`
                  }}
                />

              </div>

            </div>

          </div>

        </motion.div>

        {/* BADGES */}

        <motion.div

          initial={{
            opacity: 0,
            x: 20
          }}

          animate={{
            opacity: 1,
            x: 0
          }}

          className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6"
        >

          <div className="flex items-center gap-3 mb-6">

            <Award className="w-6 h-6 text-purple-400" />

            <h3 className="text-xl font-bold text-slate-200">

              Badges & Streaks

            </h3>

          </div>

          <div className="grid grid-cols-2 gap-4">

            {/* STREAK */}

            <div className="bg-slate-800/50 rounded-2xl p-4 flex flex-col items-center justify-center text-center border border-slate-700/50">

              <Flame className="w-8 h-8 text-orange-500 mb-2" />

              <p className="text-white font-bold">

                {streak} Day

              </p>

              <p className="text-xs text-slate-400">

                Active Streak

              </p>

            </div>

            {/* ZEN */}

            <div className="bg-slate-800/50 rounded-2xl p-4 flex flex-col items-center justify-center text-center border border-slate-700/50">

              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center mb-2">

                <div className="w-4 h-4 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]"></div>

              </div>

              <p className="text-white font-bold">

                Zen Master

              </p>

              <p className="text-xs text-slate-400">

                High Stability

              </p>

            </div>

          </div>

        </motion.div>

      </div>

    </div>
  );
}