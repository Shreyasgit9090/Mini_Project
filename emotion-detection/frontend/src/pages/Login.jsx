import React, {
    useState
} from 'react'

import axios from 'axios'

import {
    useNavigate,
    Link
} from 'react-router-dom'

import {
    motion
} from 'framer-motion'

import toast from 'react-hot-toast'

import {
    Loader2,
    BrainCircuit
} from 'lucide-react'

const Login = () => {

    const navigate = useNavigate()

    const [username, setUsername] =
        useState("")

    const [password, setPassword] =
        useState("")

    const [loading, setLoading] =
        useState(false)

    // LOGIN

    const handleLogin = async () => {

        if (!username || !password) {

            toast.error(
                "Fill all login fields"
            )

            return
        }

        try {

            setLoading(true)

            const res = await axios.post(

                "http://127.0.0.1:5000/login",

                {
                    username,
                    password
                }
            )

            if (res.data.success) {

                localStorage.setItem(
                    "user",
                    username
                )

                toast.success(
                    "Authentication successful"
                )

                setTimeout(() => {

                    navigate("/dashboard")

                }, 1200)

            } else {

                toast.error(
                    "Invalid credentials"
                )
            }

        } catch (err) {

            console.log(err)

            toast.error(
                "Backend server unavailable"
            )

        } finally {

            setLoading(false)
        }
    }

    return (

        <div className='w-full flex justify-center'>

            <motion.div

                initial={{
                    opacity: 0,
                    y: 40
                }}

                animate={{
                    opacity: 1,
                    y: 0
                }}

                className='w-full max-w-2xl'
            >

                {/* HEADER */}

                <div className='text-center'>

                    <div className='flex justify-center mb-6'>

                        <div className='w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-2xl shadow-emerald-500/20'>

                            <BrainCircuit className='w-12 h-12 text-black' />

                        </div>

                    </div>

                    <h1 className='text-6xl font-black'>

                        Companion AI

                    </h1>

                    <p className='text-zinc-400 text-lg mt-5 max-w-xl mx-auto leading-relaxed'>

                        Personalized emotional intelligence system
                        powered by adaptive AI and real-time emotion analysis.

                    </p>

                </div>

                {/* LOGIN CARD */}

                <div className='mt-14 bg-white/5 border border-white/10 rounded-[35px] p-10 backdrop-blur-2xl shadow-2xl'>

                    <h2 className='text-4xl font-black mb-10 text-center'>

                        Welcome Back

                    </h2>

                    {/* INPUTS */}

                    <div className='space-y-6'>

                        <input

                            type="text"

                            placeholder='Username'

                            value={username}

                            onChange={(e) =>
                                setUsername(e.target.value)
                            }

                            className='w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-lg outline-none focus:border-emerald-400 transition-all'
                        />

                        <input

                            type="password"

                            placeholder='Password'

                            value={password}

                            onChange={(e) =>
                                setPassword(e.target.value)
                            }

                            className='w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-lg outline-none focus:border-emerald-400 transition-all'
                        />

                    </div>

                    {/* BUTTON */}

                    <button

                        onClick={handleLogin}

                        disabled={loading}

                        className='w-full mt-10 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 transition-all rounded-2xl py-5 text-black text-xl font-black flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/20'
                    >

                        {
                            loading ? (

                                <>

                                    <Loader2 className='w-5 h-5 animate-spin' />

                                    Authenticating...

                                </>

                            ) : (

                                "Login"
                            )
                        }

                    </button>

                    {/* FEATURES */}

                    <div className='mt-10 grid grid-cols-2 gap-5'>

                        <div className='bg-white/5 border border-white/10 rounded-2xl p-5 text-center'>

                            <p className='text-sm text-zinc-400 mb-2'>

                                Emotion Engine

                            </p>

                            <h4 className='text-xl font-bold text-emerald-400'>

                                Adaptive AI

                            </h4>

                        </div>

                        <div className='bg-white/5 border border-white/10 rounded-2xl p-5 text-center'>

                            <p className='text-sm text-zinc-400 mb-2'>

                                Analytics

                            </p>

                            <h4 className='text-xl font-bold text-cyan-400'>

                                Real-time

                            </h4>

                        </div>

                    </div>

                    {/* FOOTER */}

                    <p className='text-center mt-10 text-zinc-400 text-lg'>

                        Don’t have an account?

                        <Link

                            to="/register"

                            className='text-emerald-400 ml-2 hover:text-emerald-300 transition-colors'
                        >

                            Register

                        </Link>

                    </p>

                </div>

            </motion.div>

        </div>
    )
}

export default Login