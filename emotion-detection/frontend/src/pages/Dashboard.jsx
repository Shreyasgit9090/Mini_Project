import React, {
  useState,
  useEffect,
  useRef
} from 'react';

import { motion } from 'framer-motion';

import {
  Camera,
  Activity as ActivityIcon,
  Brain
} from 'lucide-react';

import {
  useNavigate
} from 'react-router-dom';

import EmotionCard from '../components/EmotionCard';
import MusicCard from '../components/MusicCard';
import AIOrb from '../components/AIOrb';
import AIResponseCard from '../components/AIResponseCard';

import {
  getSpotifyRecommendation
} from '../utils/spotifyMap';

import API from '../services/api';
import { useEmotion } from '../context/EmotionContext';

export default function Dashboard() {
  const { setEmotion } = useEmotion();
  const navigate = useNavigate();

  // REFS

  const videoRef = useRef(null);

  const canvasRef = useRef(null);

  const streamRef = useRef(null);

  const intervalRef = useRef(null);

  const isPredictingRef = useRef(false);

  const lastSpokenRef = useRef("");

  // SETTINGS

  const savedSettings =
    JSON.parse(
      localStorage.getItem("companion_settings")
    ) || {};

  // STATES

  const [currentEmotion, setCurrentEmotion] =
    useState('Neutral');

  const [stableEmotion, setStableEmotion] =
    useState('Neutral');

  const [confidence, setConfidence] =
    useState(0);

  const [cameraOn, setCameraOn] =
    useState(false);

  const [loadingCamera, setLoadingCamera] =
    useState(true);

  const [showFeedback, setShowFeedback] =
    useState(false);

  const [aiMessage, setAiMessage] =
    useState(
      "Initializing Companion neural engine..."
    );

  // SETTINGS VALUES

  const sensitivity =
    savedSettings.sensitivity || 75;

  const smoothing =
    savedSettings.smoothing || 60;

  const autoPlayMusic =
    savedSettings.autoPlayMusic ?? true;

  const aiVoice =
    savedSettings.aiVoice ?? false;

  const cameraAutoStart =
    savedSettings.cameraAutoStart ?? true;

  // FEEDBACK EMOTIONS

  const emotions = [

    "Happy",
    "Sad",
    "Angry",
    "Fear",
    "Surprise",
    "Neutral"
  ];

  // CAMERA START

  useEffect(() => {

    if (cameraAutoStart) {

      startCamera();
    }

    return () => {

      cleanupResources();
    };

  }, []);

  // AI VOICE

  useEffect(() => {

    if (!aiVoice) return;

    if (
      aiMessage &&
      aiMessage !== lastSpokenRef.current
    ) {

      speechSynthesis.cancel();

      const utterance =
        new SpeechSynthesisUtterance(
          aiMessage
        );

      utterance.rate = 1;

      utterance.pitch = 1;

      utterance.volume = 1;

      speechSynthesis.speak(
        utterance
      );

      lastSpokenRef.current =
        aiMessage;
    }

  }, [aiMessage]);

  // CLEANUP

  const cleanupResources = () => {

    if (intervalRef.current) {

      clearInterval(intervalRef.current);

      intervalRef.current = null;
    }

    if (streamRef.current) {

      streamRef.current
        .getTracks()
        .forEach(track => track.stop());

      streamRef.current = null;
    }

    setCameraOn(false);
  };

  // START CAMERA

  const startCamera = async () => {

    try {

      cleanupResources();

      const stream =
        await navigator.mediaDevices.getUserMedia({

          video: {

            width: 640,
            height: 480,
            facingMode: "user"
          },

          audio: false
        });

      streamRef.current = stream;

      if (videoRef.current) {

        videoRef.current.srcObject = stream;

        setCameraOn(true);

        setLoadingCamera(false);

        setAiMessage(
          "Companion neural engine active."
        );

        startPredictionLoop();
      }

    } catch (error) {

      console.log(error);

      setLoadingCamera(false);

      setAiMessage(
        "Camera access denied."
      );
    }
  };

  // CAPTURE FRAME

  const captureFrame = () => {

    const video = videoRef.current;

    const canvas = canvasRef.current;

    if (!video || !canvas) return null;

    if (
      video.readyState !== 4 ||
      video.videoWidth === 0
    ) {

      return null;
    }

    const ctx = canvas.getContext("2d");

    canvas.width = 320;

    canvas.height = 240;

    ctx.drawImage(

      video,

      0,

      0,

      320,

      240
    );

    return canvas.toDataURL(

      "image/jpeg",

      0.7
    );
  };

  // PREDICTION LOOP

  const startPredictionLoop = () => {

    if (intervalRef.current) {

      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(

      async () => {

        if (isPredictingRef.current) return;

        isPredictingRef.current = true;

        try {

          const image = captureFrame();

          if (!image) {

            isPredictingRef.current = false;

            return;
          }

          const username =
            localStorage.getItem("user");

          const response =
            await API.post("/predict", {
              image,
              username,
              sensitivity,
              smoothing
            });

          const data = response.data;

          // INSTANTANEOUS EMOTION (updates immediately)
          setCurrentEmotion(data.instant_emotion || "Neutral");

          // STABLE EMOTION (uses confidence filter and temporal smoothing)
          if (
            data.confidence >=
            sensitivity * 0.5
          ) {
            setStableEmotion(data.stable_emotion || "Neutral");
            setEmotion(data.stable_emotion || "Neutral");
          }

          setConfidence(data.confidence || 0);

          setAiMessage(
            data.response ||
            "Companion monitoring..."
          );

        } catch (error) {
          console.log(error);
          setAiMessage("Core server connection issues. Check server status.");
          setConfidence(0);
        } finally {

          isPredictingRef.current = false;
        }

      },

      Math.max(
        1200,
        4000 - smoothing * 20
      )
    );
  };

  // FEEDBACK

  const sendFeedback = async (

    correctedEmotion

  ) => {

    try {

      const username =
        localStorage.getItem("user");

      await API.post("/feedback", {

        username,

        predicted: currentEmotion,

        corrected: correctedEmotion
      });

      setShowFeedback(false);

      setAiMessage(
        "Companion adapted from your feedback."
      );

    } catch (error) {

      console.log(error);
    }
  };

  // SPOTIFY

  const spotifyData =
    autoPlayMusic
      ?
      getSpotifyRecommendation(
        stableEmotion
      )
      :
      null;

  return (

    <div className="max-w-7xl mx-auto space-y-6">

      {/* HEADER */}

      <div className="flex items-end justify-between mb-8">

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

            Companion{" "}

            <span className="text-emerald-400">

              Control Center

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
              delay: 0.2
            }}

            className="text-slate-400"
          >

            Personalized emotional intelligence system

          </motion.p>

        </div>

        <div className="flex gap-3">

          <button
            onClick={cameraOn ? cleanupResources : startCamera}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-xl text-slate-300 transition-colors"
          >

            <Camera className="w-4 h-4" />

            <span>

              {
                cameraOn
                  ?
                  "Camera Active"
                  :
                  "Camera Offline"
              }

            </span>

          </button>

        </div>

      </div>

      {/* MAIN */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT */}

        <div className="lg:col-span-4 space-y-6">

          <motion.div

            initial={{
              opacity: 0,
              scale: 0.95
            }}

            animate={{
              opacity: 1,
              scale: 1
            }}

            className="relative rounded-[35px] overflow-hidden border border-slate-700/50 shadow-2xl bg-slate-900/50 backdrop-blur-xl aspect-[4/3]"
          >

            {
              loadingCamera && (

                <div className="absolute inset-0 flex items-center justify-center z-50 bg-black">

                  <div className="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />

                </div>
              )
            }

            <video

              ref={videoRef}

              autoPlay

              playsInline

              muted

              className="w-full h-full object-cover"
            />

            <canvas

              ref={canvasRef}

              className="hidden"
            />

            <div className="absolute top-4 left-4 z-30 flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">

              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>

              <span className="text-xs font-medium text-white">

                LIVE

              </span>

            </div>

            <div className="absolute bottom-4 right-4 z-30 flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">

              <Brain className="w-4 h-4 text-emerald-400" />

              <span className="text-xs font-mono text-emerald-400">

                ADAPTIVE AI

              </span>

            </div>

          </motion.div>

          <EmotionCard

            title="Instantaneous Emotion"

            emotion={currentEmotion}

            confidence={confidence}
          />

        </div>

        {/* CENTER */}

        <div className="lg:col-span-4 flex flex-col items-center justify-center relative">

          <div className="text-center mb-8">

            <h2 className="text-xl font-bold text-slate-200 tracking-widest uppercase mb-1">

              Companion Core

            </h2>

            <p className="text-xs text-slate-500 uppercase tracking-widest">

              Personalized Neural Engine

            </p>

          </div>

          <div className="flex-1 flex items-center justify-center">

            <AIOrb emotion={stableEmotion} />

          </div>

        </div>

        {/* RIGHT */}

        <div className="lg:col-span-4 space-y-6">

          <EmotionCard

            title="Stable Environment State"

            emotion={stableEmotion}

            confidence={confidence}

            className="border-emerald-500/30 bg-emerald-950/10"
          />

          {/* MUSIC */}

          {
            autoPlayMusic && spotifyData && (

              <div className="h-[280px]">

                <MusicCard

                  spotifyData={spotifyData}

                  emotion={stableEmotion}
                />

              </div>
            )
          }

          {/* ANALYTICS */}

          <button

            onClick={() =>
              navigate("/activity")
            }

            className="w-full flex flex-col items-center justify-center gap-2 p-4 bg-slate-800/40 hover:bg-slate-700/50 rounded-2xl border border-slate-700/50 transition-all group backdrop-blur-md"
          >

            <ActivityIcon className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />

            <span className="text-sm font-medium text-slate-300">

              View Analytics

            </span>

          </button>

        </div>

      </div>

    </div>
  );
}