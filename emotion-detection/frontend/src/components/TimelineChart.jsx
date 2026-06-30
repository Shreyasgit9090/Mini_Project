import React from 'react';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function TimelineChart({ data = [] }) {

  const CustomTooltip = ({
    active,
    payload,
    label
  }) => {

    if (
      active &&
      payload &&
      payload.length
    ) {

      return (

        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl">

          <p className="text-slate-300 text-sm">

            {label}

          </p>

          <p className="text-emerald-400 font-bold">

            Confidence:
            {" "}
            {payload[0].value}%

          </p>

        </div>
      );
    }

    return null;
  };

  return (

    <div className="h-72 w-full">

      <ResponsiveContainer
        width="100%"
        height="100%"
      >

        <AreaChart
          data={data}
        >

          <defs>

            <linearGradient
              id="confidence"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >

              <stop
                offset="5%"
                stopColor="#10b981"
                stopOpacity={0.4}
              />

              <stop
                offset="95%"
                stopColor="#10b981"
                stopOpacity={0}
              />

            </linearGradient>

          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#334155"
          />

          <XAxis
            dataKey="time"
            stroke="#94a3b8"
          />

          <YAxis
            stroke="#94a3b8"
            domain={[0, 100]}
          />

          <Tooltip
            content={<CustomTooltip />}
          />

          <Area
            type="monotone"
            dataKey="confidence"
            stroke="#10b981"
            fill="url(#confidence)"
            strokeWidth={3}
          />

        </AreaChart>

      </ResponsiveContainer>

    </div>
  );
}