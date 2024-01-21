import React, { Fragment,useState,useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";
import { registerUser } from "../../actions/auth";
import classnames from "classnames";
import Sidebar from "../Dashboard/Sidebar"
import { GET_ERRORS } from "../../actions/types";
import Spinner from "../../components/Spinner"
import Modal from "../../components/Modal"
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { removeModalHandler } from "../../actions/modalAction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const Register = () => {

  const [name , setName] = useState('')
  const [mobileNo , setMobileNo] = useState('')
  const [email , setEmail] = useState('')
  const [password , setPassword] = useState('')
  const [password2 , setPassword2] = useState('')
  const [errors , setErrors] = useState('')
  const [slider,setSlider] = useState(true)
  const [loading , setLoading] = useState(false)
  const [showModal , setShowModal] = useState(false)

  const dispatch = useDispatch();
  const isAuth = useSelector(state => state.auth)
  const error = useSelector(state => state.errors)
  const sliderState = useSelector(state => state.slider)
  const spinnerState = useSelector(state => state.spinner)
  const modalState = useSelector(state => state.modal)


  const onSubmit = (e) => {
    e.preventDefault();

    const newUser = {
      name: name,
      mobileNo: mobileNo,
      password: password,
      password2: password2,
      email : email
    };

    dispatch(registerUser(newUser));
  }

  useEffect(() => {
    dispatch({
        type: GET_ERRORS,
        payload: '',
      })
      return () => {
        dispatch({
          type: GET_ERRORS,
          payload: '',
        })
      }
  }, [])

  useEffect(() => {
    setShowModal(modalState.isModal)
    
  }, [modalState])

  useEffect(() => {
    setLoading(spinnerState.isSpinner)
  }, [spinnerState])
 
  useEffect(() => {
    setErrors(error)
    return() => {
      setErrors('')
    }
  }, [error])
  
  useEffect(() => {
    setSlider(sliderState.isSlider)
    
  }, [sliderState])

  const closeModalHandler = () => {
    dispatch(removeModalHandler())
    // setShowModal(false)
    setName('')
    setMobileNo('')
    setEmail('')
    setPassword('')
    setPassword2('')
    setErrors('')
}
   

    return (
      <Fragment>
        {showModal ? 
            <Modal 
              show={showModal} 
              handleClose={() => {
                closeModalHandler()
              }} 
            > 
               <h5>User Registered successfully</h5> 
               <FontAwesomeIcon
                icon={faCheckCircle}
                style={{ fontSize: '40px',display: 'block',color: 'green' ,textAlign: 'center', margin: 'auto auto 22px' }}
                />
              <button className="btn-edit" 
                  onClick = {() => {
                    closeModalHandler()
              }}> Close</button>
            </Modal> 
            : "" 
          } 
          {loading ? <Spinner /> : ''}
        <div className="dashboard_wrapper">
          <div className="container-fluid">
          <div className="row">
            {/* <div className="w-17"> */}
                <Sidebar />
            {/* </div> */}
            <div 
             className={classnames( slider ? 'w-82' : 'w-100')}>
            {/* <div className='dashboard_right'></div> */}
      <section className="container ">
        <div className= "loginmargin contact-wrap">
        <h1 className="large ">Register</h1>
        <p className="lead">
          <i className="fas fa-user"></i> 
          Create Your Account
        </p>
        <form noValidate className="form" onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="text"
              className={classnames({ "is-invalid": errors.name })}
              placeholder="Name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name}</div>
            )}
          </div>
          <div className="form-group">
            <input
              type="number"
              className={classnames({ "is-invalid": errors.mobileNo })}
              placeholder="Mobile No"
              name="mobileNo"
              value={mobileNo}
              onChange={(e) => setMobileNo(e.target.value)}
            />
            {errors.mobileNo && (
              <div className="invalid-feedback">{errors.mobileNo}</div>
            )}
           
          </div>
          <div className="form-group">
            <input
              type="email"
              className={classnames({ "is-invalid": errors.email })}
              placeholder="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
           
          </div>
          <div className="form-group">
            <input
              type="password"
              className={classnames({ "is-invalid": errors.password })}
              placeholder="Password"
              name="password"
              minLength="6"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
          </div>
          <div className="form-group">
            <input
              type="password"
              className={classnames({ "is-invalid": errors.password2 })}
              placeholder="Confirm Password"
              name="password2"
              minLength="6"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />
            {errors.password2 && (
              <div className="invalid-feedback">{errors.password2}</div>
            )}
          </div>
          <input type="submit" className="btn " value="Register" />
        </form>
        </div>
      </section>
      </div>
      </div>
      </div>
      </div>
      </Fragment>
    );
  }



export default Register;

