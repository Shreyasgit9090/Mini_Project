import React, {
    useState,
    useRef,
    useEffect
} from 'react'

import axios from 'axios'

import {
    useNavigate,
    Link
} from 'react-router-dom'

import {
    motion
} from 'framer-motion'

import Webcam from 'react-webcam'

import {
    Camera,
    CheckCircle2,
    ScanFace
} from 'lucide-react'

const Register = () => {

    const navigate = useNavigate()

    const webcamRef = useRef(null)

    const [username, setUsername] = useState("")

    const [password, setPassword] = useState("")

    const [capturedImage, setCapturedImage] =
        useState(null)

    const [loading, setLoading] =
        useState(false)

    const [cameraReady, setCameraReady] =
        useState(false)

    // CAMERA READY

    useEffect(() => {

        setTimeout(() => {

            setCameraReady(true)

        }, 1000)

    }, [])

    // CAPTURE FACE

    const captureFace = () => {

        const imageSrc =
            webcamRef.current.getScreenshot()

        setCapturedImage(imageSrc)
    }

    // REGISTER

    const handleRegister = async () => {

        if (
            !username ||
            !password
        ) {

            alert("Fill all fields")

            return
        }

        if (!capturedImage) {

            alert(
                "Capture your face first"
            )

            return
        }

        try {

            setLoading(true)

            const res = await axios.post(

                "http://127.0.0.1:5000/register",

                {
                    username,
                    password,
                    image: capturedImage
                }
            )

            if (res.data.success) {

                localStorage.setItem(
                    "user",
                    username
                )

                navigate("/calibration")

            } else {

                alert(
                    "User already exists"
                )
            }

        } catch (err) {

            console.log(err)

            alert("Server error")

        } finally {

            setLoading(false)
        }
    }

    return (

        <div className='w-full'>

            <motion.div
                initial={{
                    opacity: 0,
                    y: 40
                }}
                animate={{
                    opacity: 1,
                    y: 0
                }}
            >

                {/* HEADER */}

                <div className='text-center'>

                    <div className='flex justify-center mb-6'>

                        <div className='w-20 h-20 rounded-3xl bg-emerald-500/20 flex items-center justify-center border border-emerald-400/20'>

                            <ScanFace className='w-10 h-10 text-emerald-400' />

                        </div>

                    </div>

                    <h1 className='text-5xl font-black'>

                        Face Enrollment

                    </h1>

                    <p className='text-zinc-400 text-lg mt-4 max-w-xl mx-auto'>

                        Create your personalized Companion AI profile
                        with adaptive emotional memory and face recognition.

                    </p>

                </div>

                {/* CAMERA SECTION */}

                <div className='mt-12 grid lg:grid-cols-2 gap-10'>

                    {/* CAMERA */}

                    <div className='bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl'>

                        <div className='flex items-center justify-between mb-5'>

                            <h3 className='text-2xl font-bold'>

                                Face Scan

                            </h3>

                            <div className='flex items-center gap-2 text-emerald-400 text-sm'>

                                <div className='w-2 h-2 rounded-full bg-emerald-400 animate-pulse' />

                                AI ACTIVE

                            </div>

                        </div>

                        <div className='overflow-hidden rounded-3xl border border-white/10'>

                            {
                                cameraReady && (

                                    <Webcam
                                        ref={webcamRef}
                                        screenshotFormat="image/jpeg"
                                        className='w-full h-[420px] object-cover'
                                    />
                                )
                            }

                        </div>

                        <button
                            onClick={captureFace}
                            className='w-full mt-6 bg-emerald-500 hover:bg-emerald-400 transition rounded-2xl py-4 text-black text-lg font-black flex items-center justify-center gap-3'
                        >

                            <Camera className='w-5 h-5' />

                            Capture Face

                        </button>

                    </div>

                    {/* FORM */}

                    <div className='bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl'>

                        <h3 className='text-3xl font-black mb-8'>

                            Account Setup

                        </h3>

                        {/* FACE STATUS */}

                        <div className='mb-8'>

                            {
                                capturedImage ? (

                                    <div className='flex items-center gap-3 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4'>

                                        <CheckCircle2 className='w-6 h-6' />

                                        Face enrolled successfully

                                    </div>

                                ) : (

                                    <div className='text-zinc-500 bg-white/5 border border-white/10 rounded-2xl p-4'>

                                        Capture your face to continue

                                    </div>
                                )
                            }

                        </div>

                        {/* PREVIEW */}

                        {
                            capturedImage && (

                                <div className='mb-8'>

                                    <img
                                        src={capturedImage}
                                        alt="Captured"
                                        className='w-40 h-40 object-cover rounded-3xl border border-emerald-500/30'
                                    />

                                </div>
                            )
                        }

                        {/* INPUTS */}

                        <div className='space-y-6'>

                            <input
                                type="text"
                                placeholder='Username'
                                value={username}
                                onChange={(e) =>
                                    setUsername(e.target.value)
                                }
                                className='w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-lg outline-none focus:border-emerald-400 transition'
                            />

                            <input
                                type="password"
                                placeholder='Password'
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                className='w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-lg outline-none focus:border-emerald-400 transition'
                            />

                        </div>

                        {/* BUTTON */}

                        <button
                            onClick={handleRegister}
                            disabled={loading}
                            className='w-full mt-10 bg-emerald-500 hover:bg-emerald-400 transition rounded-2xl py-5 text-black text-xl font-black'
                        >

                            {
                                loading
                                    ? "Creating AI Profile..."
                                    : "Complete Registration"
                            }

                        </button>

                        {/* FOOTER */}

                        <p className='text-center mt-8 text-zinc-400'>

                            Already have an account?

                            <Link
                                to="/login"
                                className='text-emerald-400 ml-2'
                            >

                                Login

                            </Link>

                        </p>

                    </div>

                </div>

            </motion.div>

        </div>
    )
}

export default Register