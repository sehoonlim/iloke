import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { fetchSalesData } from "../../services/api"; // API 호출 import

function SalesChart() {
  const [type, setType] = useState("daily");
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    fetchSalesData(type)
      .then((response) => {
        setSalesData(response.data);
      })
      .catch((err) => {
        console.error("❌ [Error] Error fetching sales data:", err);
      });
  }, [type]);

  const chartData = {
    labels: salesData.map((data) => data.date || data.product_name),
    datasets: [
      {
        label: "매출 금액 (₩)",
        data: salesData.map((data) => data.sales),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "매출 데이터",
      },
    },
    scales: {
      x: {
        type: "category",
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="daily">일별 매출</option>
        <option value="monthly">월별 매출</option>
        <option value="yearly">연별 매출</option>
        <option value="product">상품별 매출</option>
      </select>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
}

export default SalesChart;
