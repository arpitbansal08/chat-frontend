import {
    ArcElement,
    CategoryScale,
    Chart as ChartJS,
    Filler,
    LineElement,
    LinearScale,
    PointElement,
    Tooltip,
} from "chart.js";
import React from "react";
import { Doughnut, Line } from "react-chartjs-2";
import { matBlack } from "../../constants/color";
import { getLast7days } from "../../lib/features";

ChartJS.register(
  CategoryScale,
  LinearScale,
  Tooltip,
  Filler,
  PointElement,
  LineElement,
  ArcElement
);

const labels = getLast7days();
const lineChartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    title: { display: false },
  },
  scales: {
    x: {
      beginAtZero: true,
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        display: false,
      },
    },
  },
};
const LineChart = ({ value = [] }) => {
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Messages",
        data: value,
        fill: true,
        borderColor: ["rgba(255, 206, 86, 1)"],
        backgroundColor: ["rgba(255, 206, 86, 0.3)"],
      },
    ],
  };

  return <Line data={data} options={lineChartOptions}></Line>;
};

const doughnutChartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    title: { display: false },
  },
  cutout: "70%",
};

const DoughnutChart = ({ value = [], labels = [] }) => {
  const data = {
    labels,
    datasets: [
      {
        data: value,
        backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)"],
        borderColor: matBlack,
        hoverOffset: 4,
        offset:20
      },
    ],
  };
  return <Doughnut style={{zIndex:1}} data={data} options={doughnutChartOptions} />;
};

export { DoughnutChart, LineChart };
