"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
export default function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_BASE}/ingredient-stats`);
        if (res.data.ok) setData(res.data.stats);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const chartData = {
    labels: data.map((item) => item.chemical),
    datasets: [
      {
        label: "Search Count",
        data: data.map((item) => item.freq),
        backgroundColor: data.map((item) =>
          item.status === "banned"
            ? "#ff4d4f"
            : item.status === "restricted"
            ? "#faad14"
            : "#1890ff"
        ),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: "y", 
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: { title: { display: true, text: "Search Count" }, beginAtZero: true },
      y: {
        title: { display: true, text: "Ingredient" },
        ticks: { autoSkip: false },
      },
    },
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-8">Ingredient Search Dashboard</h1>

      <div className="w-full max-w-5xl h-[800px] overflow-y-auto">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
