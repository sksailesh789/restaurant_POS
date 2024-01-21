import axios from "axios";
import { GET_ERRORS,SET_CURRENT_USER,REMOVE_CURRENT_USER,SET_MESSAGE,SET_SPINNER,REMOVE_SPINNER ,SET_MODAL} from "./types";
import { API } from "../config";
import setAuthToken from "../utils/setAuthToken"
import {useDispatch} from "react-redux"
import jwt_decode from "jwt-decode"

export const registerUser = (userData) => (dispatch) => {
  dispatch({
    type: SET_SPINNER,
  })
  axios
    .post(`${API}/users/register`, userData)
    .then((res) => 
    { console.log(res,'res789')
      if(res.status && res.status == 200 || res.status == 201) {
        dispatch({
          type: SET_MODAL,
        })
        dispatch({
          type: REMOVE_SPINNER,
        })
      }else {
        dispatch({
          type: REMOVE_SPINNER,
        })
      }}
    )
    .catch((err) =>
    {   
      dispatch({
        type: REMOVE_SPINNER,
      })
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })}
    );
};
export const loginUser = (userData) => (dispatch) => {
  dispatch({
    type: SET_SPINNER,
  })
    axios
      .post(`${API}/users/login`, userData)
      .then((res) => {
        console.log(res,'oooooo')
        if (res && res.data && res.data.success == true) {
          const { token,isAdmin } = res.data;
          // set token to ls
          localStorage.setItem("jwtToken", token);
          localStorage.setItem("isAdmin", isAdmin);
  
          // set token to Auth Header
          setAuthToken(token);
          // Decode Token to get user data
          const decoded = jwt_decode(token);
          decoded.isAdmin = isAdmin;
          console.log(decoded,'dc')
          dispatch({
            type: REMOVE_SPINNER,
          })  
          // set current User
          return dispatch(setCurrentUser(decoded));
      }
      dispatch({
        type: REMOVE_SPINNER,
      })  
      })
      .catch((err) =>{ 
      dispatch({
        type: REMOVE_SPINNER,
      })    
      }
      );
  };
  
  // Set logged in user
  export const setCurrentUser = (decoded) => {
    console.log(decoded,'dc5')
    return {
      type: SET_CURRENT_USER,
      payload: decoded,
    };
  };

  // Log user out
export const logoutUser = () => (dispatch) => {
  // Remove token from localStorage
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("isAdmin");

  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to {} which will set isAuthenticated to false
  dispatch(removeCurrentUser({}));
};

export const removeCurrentUser = (decoded) => {
  return {
    type: REMOVE_CURRENT_USER,
    payload: decoded,
  };
};


export const forgetPassword = (data) => (dispatch) => {
  dispatch({
    type: SET_MESSAGE,
    payload: ''
  })
  dispatch({
    type: GET_ERRORS,
    payload: {email:""},
  })
  axios.post(`${API}/users/forgotpassword` , data)
        .then(data => {
          dispatch({
            type: SET_MESSAGE,
            payload: data.data.message
          })
          
        })
        .catch(err => 
          dispatch({
            type: GET_ERRORS,
            payload: err.response.data,
          }))
  
};

export const resetPassword = (data) => (dispatch) => {
  
  axios.post(`${API}/users/resetpassword/${data.email}/${data.code}` , {password: data.password , password2:data.password2})
        .then(data => {
          dispatch({
            type: SET_MESSAGE,
            payload: data.data.message
          })
        })
        .catch(err => 
         { 
           
          dispatch({
            type: GET_ERRORS,
            payload: err.response.data,
          })})
  
};