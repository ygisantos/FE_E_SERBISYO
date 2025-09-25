import React from "react";

const BarChart = ({ data }) => {
  const maxValue = Math.max(...data.map((item) => item.value));

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[300px]">
        <svg width="100%" height="200" viewBox="0 0 400 200" className="w-full">
          {/* Y-axis lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((percent, index) => (
            <g key={index}>
              <line
                x1="30"
                y1={30 + 140 * (1 - percent)}
                x2="380"
                y2={30 + 140 * (1 - percent)}
                stroke="#f3f4f6"
                strokeWidth="1"
              />
              <text
                x="25"
                y={30 + 140 * (1 - percent) + 3}
                textAnchor="end"
                fontSize="10"
                fill="#6b7280"
              >
                {Math.round(maxValue * percent)}
              </text>
            </g>
          ))}

          {/* Bars */}
          {data.map((item, index) => {
            const barHeight = (item.value / maxValue) * 140;
            const barWidth = 25;
            const x = 40 + index * 30;

            return (
              <g key={index}>
                <rect
                  x={x}
                  y={30 + 140 - barHeight}
                  width={barWidth}
                  height={barHeight}
                  fill="#6366f1"
                  rx="2"
                />
                <text
                  x={x + barWidth / 2}
                  y={185}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#6b7280"
                >
                  {item.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default BarChart;
