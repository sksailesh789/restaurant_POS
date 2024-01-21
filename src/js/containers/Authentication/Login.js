import React, { Component,Fragment,useState,useEffect } from "react";
import { connect } from "react-redux";
import { loginUser } from "../../actions/auth";
import classnames from "classnames";
import { useDispatch,useSelector } from 'react-redux';
import ErrorHandler from "../ErrorHandler/ErrorHandler";
import axios from "axios"
import { useNavigate} from 'react-router-dom';
import Spinner from "../../components/Spinner"


const Login = () =>{
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [errors,setErrors] = useState('')
    const [loading , setLoading] = useState(false)

    const dispatch = useDispatch();
    const navigate = useNavigate();
  
  const isAuth = useSelector(state => state.auth)
  const error = useSelector(state => state.errors)
  const spinnerState = useSelector(state => state.spinner)

useEffect(() => {
  setErrors(error)
  
}, [error])

useEffect(() => {
  setLoading(spinnerState.isSpinner)
}, [spinnerState])

useEffect(() => {
  if (isAuth.isAuthenticated) {
    console.log(isAuth,'ia')
    navigate('/')
        }

}, [isAuth])



  const onSubmit = (e) => {
    e.preventDefault();

    const userData = {
        email ,
      password
    };
console.log(userData,'ud')
console.log(error,'eeeff')
console.log(isAuth,'ia')
    dispatch(loginUser(userData));
    
  }

  
    // const { errors } = this.state;

    return (
      <Fragment>
        {loading ? <Spinner /> : ''}

      <section className="container  ">
        <div className = "loginmargin contact-wrap">
        {/* {errors? (
          <div className="alert alert-danger">Invalid credentials</div>
        ) : (
          ""
        )} */}
        <h1 >Sign In</h1>
        <p className="lead">
          <i className="fas fa-user"></i> Sign into Your Account
        </p>
        <form noValidate className="form" onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Email"
              className={classnames({ "is-invalid": errors.email })}
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
              placeholder="Password"
              className={classnames({ "is-invalid": errors.password })}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}

              
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
          </div>
          <input type="submit" className="btn " value="Login" />
        </form>
        {/* <p className="my-1">
          Don't have an account? <a href="register.html">Sign Up</a>
        </p> */}
        </div>
      </section>
      {/* <Footer/> */}
      </Fragment>
    );
  }





export default ErrorHandler(Login,axios) ;
