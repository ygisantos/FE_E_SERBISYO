import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Pie } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const PieChart = ({ title, data, height = 300 }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: !!title,
        text: title,
        font: {
          size: 16,
          weight: "bold",
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value * 100) / total).toFixed(1);
            return `${label}: ${percentage}% (${value})`;
          },
        },
      },
    },
  };

  const chartData = {
    labels: data.map((item) => item.label),
    datasets: [
      {
        data: data.map((item) => item.value),
        backgroundColor: [
          "rgba(127, 29, 29, 0.8)", // red-900
          "rgba(30, 64, 175, 0.8)", // blue-800
          "rgba(146, 64, 14, 0.8)", // amber-800
          "rgba(21, 128, 61, 0.8)", // green-700
          "rgba(109, 40, 217, 0.8)", // violet-700
        ],
        borderColor: "white",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div style={{ height }}>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default PieChart;
