import React from 'react'

import {
    LineChart,
    Line,
    XAxis,
    Tooltip,
    ResponsiveContainer
} from 'recharts'

const EmotionChart = ({ timeline }) => {

    const data = timeline.map((item, index) => ({
        name: index,
        emotion: item.length
    }))

    return (

        <div className='w-full h-72 bg-white/5 rounded-3xl p-5 border border-white/10'>

            <h1 className='text-white text-2xl font-bold mb-5'>

                Emotion Timeline

            </h1>

            <ResponsiveContainer width="100%" height="100%">

                <LineChart data={data}>

                    <XAxis dataKey="name" stroke="#999" />

                    <Tooltip />

                    <Line
                        type="monotone"
                        dataKey="emotion"
                        stroke="#10b981"
                        strokeWidth={4}
                    />

                </LineChart>

            </ResponsiveContainer>

        </div>
    )
}

export default EmotionChart