import React from 'react';

export default function Heatmap({

  sessions = []

}) {

  const days = [

    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat'
  ];

  const heatmap = {};

  sessions.forEach(session => {

    const date =
      new Date(session.timestamp);

    const day =
      days[date.getDay()];

    const hour =
      date.getHours();

    const key =
      `${day}-${hour}`;

    heatmap[key] =
      (heatmap[key] || 0) + 1;
  });

  const getIntensityClass = (
    value
  ) => {

    if (value >= 8)
      return "bg-emerald-400";

    if (value >= 5)
      return "bg-emerald-600";

    if (value >= 2)
      return "bg-emerald-800";

    return "bg-slate-800";
  };

  return (

    <div className="overflow-x-auto">

      <div className="min-w-[700px]">

        {/* HOURS */}

        <div className="flex mb-2">

          <div className="w-12"></div>

          {
            Array.from({
              length: 24
            }).map((_, i) => (

              <div
                key={i}
                className="flex-1 text-center text-xs text-slate-500"
              >

                {i}

              </div>
            ))
          }

        </div>

        {/* DAYS */}

        {
          days.map(day => (

            <div
              key={day}
              className="flex items-center gap-1 mb-1"
            >

              <div className="w-12 text-xs text-slate-400">

                {day}

              </div>

              {
                Array.from({
                  length: 24
                }).map((_, hour) => {

                  const key =
                    `${day}-${hour}`;

                  const value =
                    heatmap[key] || 0;

                  return (

                    <div
                      key={hour}
                      className={`

                        flex-1
                        aspect-square
                        rounded-sm
                        ${getIntensityClass(value)}

                      `}
                    />
                  );
                })
              }

            </div>
          ))
        }

      </div>

    </div>
  );
}