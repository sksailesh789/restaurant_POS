import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import {API} from "../../config";
import axios from "axios"

const Dashboardbar = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Fetch data from API
    axios.get(`${API}/billing/salesByTopProduct`)
      .then(res => {
        // Transform data to match chart format
        const labels = res.data.map(item => item.month);
        const products = [...new Set(res.data.flatMap(item => item.products.map(product => product.product.name)))];
        const datasets = products.map(product => {
          const dataPoints = res.data.map(item => {
            const productItem = item.products.find(p => p.product.name === product);
            return productItem ? productItem.totalSales : 0;
          });
          const backgroundColor = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
          return {
            label: product,
            data: dataPoints,
            backgroundColor,
          };
        });
        // console.log(labels,datasets,'ld')
        setChartData({ labels, datasets });
      })
      .catch(error => console.error(error));
  }, []);

  const options = {
    plugins: {
      title: {
        display: true,
        text: "Product sales Monthly"
      }
    },
    responsive: true,
    scales: {
      x: {
        stacked: true
      },
      y: {
        stacked: true
      }
    }
  };

  return (
    <div>
      {chartData ? <Bar options={options} data={chartData} /> : <p>Loading...</p>}
    </div>
  );
};

export default Dashboardbar