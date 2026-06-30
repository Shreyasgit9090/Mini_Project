import React, {
    useEffect,
    useRef,
    useState
} from 'react'

import axios from 'axios'

import {
    useNavigate
} from 'react-router-dom'



const Calibration = () => {

    const videoRef = useRef(null)

    const canvasRef = useRef(null)

    const navigate = useNavigate()

    const [countdown, setCountdown] = useState(5)

    useEffect(() => {

        startCamera()

    }, [])

    const startCamera = async () => {

        const stream = await navigator.mediaDevices.getUserMedia({
            video: true
        })

        videoRef.current.srcObject = stream

        startCalibration()
    }

    const captureFrame = () => {

        const canvas = canvasRef.current

        const video = videoRef.current

        const ctx = canvas.getContext("2d")

        canvas.width = video.videoWidth

        canvas.height = video.videoHeight

        ctx.drawImage(
            video,
            0,
            0
        )

        return canvas.toDataURL("image/jpeg")
    }

    const startCalibration = () => {

        let counter = 5

        const interval = setInterval(async () => {

            counter--

            setCountdown(counter)

            if (counter <= 0) {

                clearInterval(interval)

                try {
                    const image = captureFrame()

                    const username = localStorage.getItem("user")

                    await axios.post(
                        "http://127.0.0.1:5000/save_baseline",
                        {
                            username,
                            image,
                            baseline: {
                                Neutral: 0.2
                            }
                        }
                    )
                } catch (err) {
                    console.log("Calibration request failed:", err)
                }

                navigate("/dashboard")
            }

        }, 1000)
    }

    return (

        <>

            <div className='text-center'>

                <h1 className='text-5xl font-black'>

                    Baseline Calibration

                </h1>

                <p className='text-zinc-400 mt-5 text-lg'>

                    Keep a neutral expression for calibration

                </p>

                {/* CAMERA */}

                <div className='mt-10 rounded-3xl overflow-hidden border border-white/10'>

                    <video
                        ref={videoRef}
                        autoPlay
                        className='w-full'
                    />

                </div>

                {/* COUNTDOWN */}

                <div className='mt-10 text-7xl font-black text-emerald-400'>

                    {countdown}

                </div>

            </div>

            <canvas
                ref={canvasRef}
                className='hidden'
            />

        </>
    )
}

export default Calibration