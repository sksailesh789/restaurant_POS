import React,{useEffect} from "react";
import { Route,Link,useNavigate, Navigate } from "react-router-dom";
import { isAuthenticated , isAdmin} from "./index";



const PrivateRoute = ({children}) => {
 
    const authed = isAuthenticated() // isauth() returns true or false based on localStorage
    
    return authed ? children : <Navigate to="/login" />;
  }



export  {  PrivateRoute};
