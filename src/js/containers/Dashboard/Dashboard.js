import React,{useState,useEffect} from 'react'
import { FaAngleRight } from "react-icons/fa";
import MultiMenus from './multiMenus';
import Sidebar from "./Sidebar"
import socketIOClient from "socket.io-client"
import {API,imageAPI} from "../../config"
import axios from "axios"
import classnames from "classnames";
import { useNavigate} from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
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
import ErrorHandler from "../ErrorHandler/ErrorHandler";
import Dashboardbar from "./dashboardbar"
import Dashboarddaily from "./dashboarddaily"
import DashboardToday from "./DashboardToday"




const Dashboard = (props) => {
  const [msg, setMsg] = useState({});
  const [modal, setModal] = useState(false);
  const [data, setData] = useState({ labels: [], datasets: [] });
  const [slider,setSlider] = useState(true)

  const isAuth = useSelector(state => state.auth)
  const navigate = useNavigate();
  const sliderState = useSelector(state => state.slider)

  useEffect(() => {
    setSlider(sliderState.isSlider)
    
  }, [sliderState])
    
// const socket = socketIOClient('http://192.168.1.2:5005')
// socket.on("order_confirmed" , (message) => {
//   // setMsg(message);
//   // setModal(true);
//   console.log(message,'messg')
  
// } ) 
useEffect(() => {
  
  if (!isAuth.isAuthenticated) {
    navigate('/login')
        }

}, [isAuth])

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
      text: 'Total Sales',
    },
  },
};


useEffect(()=> {
let newdata = [] , newlabel = [];

let setDataLabelHandler = (data) => {
  data.map(d => {
    newdata.push(d.totalSales)
    newlabel.push(d.monthName)
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
      .get(`${API}/billing/salesByEachMonth`)
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
    <div className="dashboard_wrapper">
          <div className="container-fluid">
            <div className="row">
              {/* <div className="w-17"> */}
                  <Sidebar />
              {/* </div> */}
              <div 
                 className={classnames( slider ? 'w-82' : 'w-100')}>
                <div className='dashboard_right'>
                  <div className="line-wrapper">
                      {data && <Line options={options} data={data} />}
                    </div>
                  <div className="bar-wrapper">
                    <Dashboardbar />
                  </div>
                  <div className="bar-wrapper">
                    <Dashboarddaily />
                  </div>
                  <div className="bar-wrapper">

                  <DashboardToday />
                  </div>
                </div>
              </div>
            </div>
          </div>
    </div>
  )
}
export default ErrorHandler(Dashboard,axios) ;

