import React, {

  useEffect,
  useState

} from 'react';

import { motion } from 'framer-motion';

import {

  Activity,
  TrendingUp,
  Target,
  Zap

} from 'lucide-react';

import StatsCard from '../components/StatsCard';

import TimelineChart from '../components/TimelineChart';

import ActivityChart from '../components/ActivityChart';

import Heatmap from '../components/Heatmap';

import SessionCard from '../components/SessionCard';

import API from '../services/api';

export default function ActivityPage() {

  const [

    analytics,
    setAnalytics

  ] = useState(null);

  const [

    loading,
    setLoading

  ] = useState(true);

  useEffect(() => {

    fetchAnalytics();

  }, []);

  const fetchAnalytics = async () => {

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

  // LOADING

  if (loading) {

    return (

      <div className="flex justify-center items-center min-h-[80vh]">

        <div className="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />

      </div>
    );
  }

  // BACKEND DATA

  const sessions =
    analytics?.sessions || [];

  // TIMELINE DATA

  const timelineData =
    sessions.slice(-20).map((s, i) => ({

      time:
        new Date(
          s.timestamp
        ).toLocaleTimeString(),

      confidence:
        s.confidence
    }));

  // WEEKLY DISTRIBUTION

  const emotionCounts = {};

  sessions.forEach(session => {

    const emotion =
      session.stable_emotion;

    emotionCounts[emotion] =
      (emotionCounts[emotion] || 0) + 1;
  });

  const weeklyData =
    Object.entries(emotionCounts).map(

      ([emotion, count]) => ({

        emotion,
        count
      })
    );

  return (

    <div className="max-w-7xl mx-auto space-y-8 pb-12">

      {/* HEADER */}

      <div className="flex items-end justify-between">

        <div>

          <motion.h1

            initial={{
              opacity: 0,
              y: -20
            }}

            animate={{
              opacity: 1,
              y: 0
            }}

            className="text-4xl font-bold text-white mb-2"
          >

            Activity
            {" "}
            <span className="text-emerald-400">

              Analytics

            </span>

          </motion.h1>

          <motion.p

            initial={{
              opacity: 0
            }}

            animate={{
              opacity: 1
            }}

            transition={{
              delay: 0.1
            }}

            className="text-slate-400"
          >

            Real-time emotional intelligence insights

          </motion.p>

        </div>

      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatsCard

          title="Total Sessions"

          value={
            analytics.total_sessions
          }

          subtitle="Tracked by Companion AI"

          icon={Activity}

          color="#10b981"

          delay={0.1}
        />

        <StatsCard

          title="Dominant Mood"

          value={
            analytics.dominant_emotion
          }

          subtitle="Most frequent emotion"

          icon={TrendingUp}

          color="#3b82f6"

          delay={0.2}
        />

        <StatsCard

          title="Avg Confidence"

          value={`${analytics.average_confidence}%`}

          subtitle="Prediction stability"

          icon={Target}

          color="#eab308"

          delay={0.3}
        />

        <StatsCard

          title="Emotion States"

          value={
            Object.keys(
              emotionCounts
            ).length
          }

          subtitle="Detected emotions"

          icon={Zap}

          color="#8b5cf6"

          delay={0.4}
        />

      </div>

      {/* MAIN GRID */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT */}

        <div className="lg:col-span-2 space-y-6">

          {/* TIMELINE */}

          <motion.div

            initial={{
              opacity: 0,
              y: 20
            }}

            animate={{
              opacity: 1,
              y: 0
            }}

            className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6"
          >

            <h3 className="text-xl font-bold text-slate-200 mb-6">

              Confidence Timeline

            </h3>

            <TimelineChart
              data={timelineData}
            />

          </motion.div>

          {/* DISTRIBUTION */}

          <motion.div

            initial={{
              opacity: 0,
              y: 20
            }}

            animate={{
              opacity: 1,
              y: 0
            }}

            className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6"
          >

            <h3 className="text-xl font-bold text-slate-200 mb-6">

              Emotion Distribution

            </h3>

            <ActivityChart
              data={weeklyData}
            />

          </motion.div>

          {/* HEATMAP */}

          <motion.div

            initial={{
              opacity: 0,
              y: 20
            }}

            animate={{
              opacity: 1,
              y: 0
            }}

            className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6"
          >

            <h3 className="text-xl font-bold text-slate-200 mb-6">

              Activity Heatmap

            </h3>

            <Heatmap
              sessions={sessions}
            />

          </motion.div>

        </div>

        {/* RIGHT */}

        <div className="space-y-6">

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

            <h3 className="text-xl font-bold text-slate-200 mb-6">

              Recent Sessions

            </h3>

            <div className="space-y-4 max-h-[900px] overflow-y-auto pr-2">

              {
                sessions
                  .slice()
                  .reverse()
                  .slice(0, 10)
                  .map((session, index) => (

                    <SessionCard

                      key={index}

                      session={session}

                    />
                  ))
              }

            </div>

          </motion.div>

        </div>

      </div>

    </div>
  );
}