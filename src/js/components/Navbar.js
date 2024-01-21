import React,{useState,useEffect} from 'react';
import { Link,useNavigate,useMatch,useLocation} from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
import { logoutUser } from "../actions/auth";
import classnames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser ,faCaretDown} from "@fortawesome/free-solid-svg-icons";
import socketIOClient from "socket.io-client"
import { removeSliderHandler,setSliderHandler } from "../actions/sliderAction";


const  Navbar = (props) => {
  const navigate = useNavigate();
  const { pathname } = useLocation()
  console.log(pathname,'pathname')

  const [profileShow,setProfileShow] = useState(false)
  const [isOn, setIsOn] = useState(navigator.onLine);

  const dispatch = useDispatch();

  const isAuth = useSelector(state => state.auth)
  const isSlider = useSelector(state => state.slider)


  // const socket = socketIOClient('http://192.168.1.2:5005')
  // socket.on("order_confirmed" , (message) => {
  //   // setMsg(message);
  //   // setModal(true);
  //   console.log(message,'messg1')
    
  // } ) 
//  const intervalId = setInterval(() => {
//     console.log(navigator,'oo99onlineoffline')
//       setIsOn(navigator.onLine);
//   }, 5000); // Update every 5 seconds

// useEffect(() => {

// },[isAuth])
  
  useEffect(() => {
    function handleOnlineStatus() {
      console.log('oo99onlineoffline')
      setIsOn(navigator.onLine);
    }
    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOnlineStatus);

      // Check if the user is offline when the component first renders
      if (!navigator.onLine) {
        setIsOn(false);
      }
    return () => {
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOnlineStatus);
    };
  }, []);


  const sliderChangedHandler= () => {
    if(isSlider.isSlider !== true) {
      console.log(isSlider.isSlider,'iss')
      dispatch(setSliderHandler())
    }else {
      console.log(isSlider.isSlider,'issn')
      dispatch(removeSliderHandler())
    }
  }


  const showProfileHandler = () => {
    setProfileShow(!profileShow)
  }
  const logoutHandler = () => {
    dispatch(logoutUser())
  }
  const passwordChangeHandler = () => {
    navigate('/forgetpassword')
  }

  return (
  <>
  {isAuth.isAuthenticated ? (
    <div className="chat-navbar">
    <nav className="chat-navbar-inner">
    
      <div className="chat-navbar-inner-right">
         { pathname == "/" ?
          (<div className="slider" onClick={sliderChangedHandler}>
            <div className="slider-element"></div>
            <div className="slider-element"></div>
            <div className="slider-element"></div>
          </div>) : (<div></div>)
        }
      
        <Link
        to="/tableBook"
          className={classnames("btn",{"isactive": pathname ==  "/tableBook"})}
          >Table Book</Link>
          <Link
        to="/TableBilling"
          className={classnames("btn",{"isactive": pathname ==  "/TableBilling"})}
          >Table Billing</Link>

          <Link
            to="/"
            className={classnames("btn",{"isactive": pathname ==  "/"})}
          >Dashboard</Link>
          <Link
            to="/FastBilling"
            className={classnames("btn",{"isactive": pathname ==  "/FastBilling"})}
          >Fast Billing</Link>

          
      </div>
      <div className='profile'>
      <div className={classnames(   isOn ? "online_info": "offline_info")}></div>
        <div className="profile-wrap" onClick={showProfileHandler}>
          <FontAwesomeIcon  icon={faUser}
                style={{ fontSize: '15px',color: '#5e5959' ,marginRight: '5px' }}
                />
          {isAuth.user ? isAuth.user.name : ''}
          <FontAwesomeIcon
                icon={faCaretDown}
                style={{ fontSize: '15px',color: '#5e5959',marginLeft: '5px' }}
                />
          </div>
          {profileShow ? (
              <div className="profile_list">
                <ul>
                  <li>Icodertech</li>
                  <li onClick={passwordChangeHandler}>change password</li>
                  <li onClick={logoutHandler}>logout</li>
                </ul>
            </div>
          ):''}
        
      </div>
    </nav>
  </div>

  ):(<div></div>)}
  </>
    
  )
}
export default Navbar