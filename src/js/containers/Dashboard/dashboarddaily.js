import React,{useEffect,useState} from 'react'
import {API,imageAPI} from "../../config"
import axios from "axios"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
} from 'chart.js';
import { Line,Bar } from 'react-chartjs-2';

const dashboarddaily = () => {

  const [data, setData] = useState({ labels: [], datasets: [] });
    
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'weekly Sales',
      },
    },
  };
  
  
  useEffect(()=> {
  let newdata = [] , newlabel = [];
  
  let setDataLabelHandler = (data) => {
    data.map(d => {
      newdata.push(d.totalSales)
      newlabel.push(d.dayName)
      // newlabel.push(d.monthName.toString())
  
  
    })
    console.log(newdata,newlabel)
    const newData = {
      labels : newlabel,
      datasets: [
        {
          label: 'Sales',
          data: newdata,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
      ],
    };
    setData(newData);
  }
  axios
        .get(`${API}/billing/salesByEachDay`)
        .then((res) =>
            {console.log(res,'res')
            setDataLabelHandler(res.data)
            }
            )
        .catch((err) => {
          console.log(err,'iii')
        });
        
  },[])

  return (
    <>
    {data && <Line options={options} data={data} />}
    </>
  )
}

export default dashboarddaily