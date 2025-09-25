import React from "react";

const PieChart = ({ data, width = 200, height = 200 }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  const center = width / 2;
  const radius = Math.min(width, height) / 2 - 15;

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full max-w-[200px] mx-auto">
        <svg
          width="100%"
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="mb-3"
        >
          {data.map((item, index) => {
            const percentage = item.value / total;
            const angle = percentage * 2 * Math.PI;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;

            const x1 = center + radius * Math.cos(startAngle);
            const y1 = center + radius * Math.sin(startAngle);
            const x2 = center + radius * Math.cos(endAngle);
            const y2 = center + radius * Math.sin(endAngle);

            const largeArc = angle > Math.PI ? 1 : 0;

            const pathData = [
              `M ${center} ${center}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
              "Z",
            ].join(" ");

            currentAngle += angle;

            return (
              <path
                key={index}
                d={pathData}
                fill={item.color}
                stroke="white"
                strokeWidth="2"
              />
            );
          })}
        </svg>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-xs text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieChart;
