import React from 'react'

import {
    motion
} from 'framer-motion'

import {
    Link
} from 'react-router-dom'

import AnimatedBackground from '../components/AnimatedBackground'

const Landing = () => {

    return (

        <AnimatedBackground emotion="neutral">
            <div className='min-h-screen bg-transparent flex flex-col items-center justify-center text-white relative overflow-hidden z-10'>

            {/* HERO */}

            <motion.h1
                initial={{ opacity: 0, y: -60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className='text-8xl font-black text-center leading-tight'
            >

                Emotion <span className='text-emerald-400'>Companion</span>

            </motion.h1>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className='mt-10 text-2xl text-zinc-400 text-center max-w-3xl'
            >

                Personalized AI Emotion Intelligence powered by
                Facial Emotion Recognition, Temporal Stability,
                Personalized Baselines, and Adaptive Learning.

            </motion.p>

            {/* BUTTONS */}

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className='flex gap-8 mt-16'
            >

                <Link
                    to="/register"
                    className='px-10 py-5 bg-emerald-500 text-black text-xl font-bold rounded-2xl hover:scale-105 transition'
                >

                    Get Started

                </Link>

                <Link
                    to="/login"
                    className='px-10 py-5 border border-white/20 bg-white/5 backdrop-blur-xl text-xl rounded-2xl hover:bg-white/10 transition'
                >

                    Login

                </Link>

            </motion.div>

            {/* FEATURE CARDS */}

            <div className='grid grid-cols-3 gap-8 mt-28 w-[85%]'>

                {
                    [
                        "Real-Time AI Detection",
                        "Personalized Baselines",
                        "Adaptive Learning"
                    ].map((item, index) => (

                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 60 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.3 }}
                            className='bg-white/5 border border-white/10 rounded-3xl p-10 backdrop-blur-xl'
                        >

                            <h1 className='text-3xl font-black text-emerald-400'>

                                0{index + 1}

                            </h1>

                            <p className='text-2xl font-semibold mt-6'>

                                {item}

                            </p>

                        </motion.div>
                    ))
                }

            </div>

            </div>
        </AnimatedBackground>
    )
}

export default Landing