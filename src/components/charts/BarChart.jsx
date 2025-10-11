import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ title, data, height = 300 }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
      },
    },
  };

  const chartData = {
    labels: data.map(item => item.label),
    datasets: [
      {
        label: 'Count',
        data: data.map(item => item.value),
        backgroundColor: 'rgba(127, 29, 29, 0.8)',  
        borderColor: 'rgb(127, 29, 29)', 
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ height }}>
      <Bar options={options} data={chartData} />
    </div>
  );
};

export default BarChart;
  