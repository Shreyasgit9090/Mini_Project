import React, {

  useState,
  useEffect

} from 'react';

import { motion } from 'framer-motion';

import {

  Camera,
  Volume2,
  Shield,
  Sliders,
  RefreshCcw,
  LogOut

} from 'lucide-react';

import API from '../services/api';

export default function Settings() {

  const [

    settings,
    setSettings

  ] = useState({

    autoPlayMusic: true,

    aiVoice: false,

    darkMode: true,

    cameraAutoStart: true,

    sensitivity: 75,

    smoothing: 60
  });

  useEffect(() => {

    const saved =
      localStorage.getItem(
        "companion_settings"
      );

    if (saved) {

      setSettings(
        JSON.parse(saved)
      );
    }

  }, []);

  // SAVE SETTINGS

  const saveSettings = (

    updated

  ) => {

    setSettings(updated);

    localStorage.setItem(

      "companion_settings",

      JSON.stringify(updated)
    );
  };

  // TOGGLE

  const toggleSetting = (

    key

  ) => {

    const updated = {

      ...settings,

      [key]:
        !settings[key]
    };

    saveSettings(updated);
  };

  // RESET USER DATA

  const resetData = async () => {

    const username =
      localStorage.getItem("user");

    const confirmReset =
      confirm(
        "Reset all Companion emotional data?"
      );

    if (!confirmReset) return;

    try {

      await API.post(
        `/reset/${username}`
      );

      alert(
        "Companion data reset successful."
      );

    } catch (error) {

      console.log(error);
    }
  };

  // LOGOUT

  const logout = () => {

    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  // TOGGLE UI

  const Toggle = ({
    active,
    onClick
  }) => (

    <button

      onClick={onClick}

      className={`

        w-12
        h-6
        rounded-full
        transition-colors
        relative

        ${active
          ?
          'bg-emerald-500'
          :
          'bg-slate-700'
        }

      `}
    >

      <motion.div

        animate={{
          x:
            active
              ?
              24
              :
              2
        }}

        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30
        }}

        className="w-5 h-5 rounded-full bg-white absolute top-0.5 shadow-sm"
      />

    </button>
  );

  return (

    <div className="max-w-4xl mx-auto space-y-8 pb-12">

      {/* HEADER */}

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

          System
          {" "}
          <span className="text-slate-400">

            Settings

          </span>

        </motion.h1>

      </div>

      <div className="space-y-6">

        {/* GENERAL */}

        <motion.div

          initial={{
            opacity: 0,
            y: 20
          }}

          animate={{
            opacity: 1,
            y: 0
          }}

          className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden"
        >

          <div className="p-6 border-b border-slate-800/50 bg-slate-800/20">

            <h3 className="text-lg font-bold text-white flex items-center gap-2">

              <Sliders className="w-5 h-5 text-emerald-400" />

              General Preferences

            </h3>

          </div>

          <div className="p-6 space-y-6">

            {/* MUSIC */}

            <div className="flex items-center justify-between">

              <div>

                <p className="text-white font-medium">

                  Auto-play Music

                </p>

                <p className="text-sm text-slate-400">

                  Spotify changes automatically

                </p>

              </div>

              <Toggle

                active={
                  settings.autoPlayMusic
                }

                onClick={() =>
                  toggleSetting(
                    'autoPlayMusic'
                  )
                }
              />

            </div>

          </div>

        </motion.div>

        {/* DANGER */}

        <motion.div

          initial={{
            opacity: 0,
            y: 20
          }}

          animate={{
            opacity: 1,
            y: 0
          }}

          className="bg-red-950/10 border border-red-900/30 rounded-3xl p-6"
        >

          <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">

            <Shield className="w-5 h-5" />

            Danger Zone

          </h3>

          <div className="space-y-4">

            {/* RESET */}

            <div className="flex items-center justify-between">

              <div>

                <p className="text-white font-medium">

                  Reset Baseline Calibration

                </p>

                <p className="text-sm text-slate-400">

                  Clear Companion emotional memory

                </p>

              </div>

              <button

                onClick={resetData}

                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl transition-colors flex items-center gap-2"
              >

                <RefreshCcw className="w-4 h-4" />

                Reset Data

              </button>

            </div>

            {/* LOGOUT */}

            <div className="flex items-center justify-between">

              <div>

                <p className="text-white font-medium">

                  Logout

                </p>

                <p className="text-sm text-slate-400">

                  End current Companion session

                </p>

              </div>

              <button

                onClick={logout}

                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl transition-colors flex items-center gap-2"
              >

                <LogOut className="w-4 h-4" />

                Logout

              </button>

            </div>

          </div>

        </motion.div>

      </div>

    </div>
  );
}