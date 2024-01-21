import React, {Component,Fragment,useState,useEffect} from 'react';
// import Modal from '../../components/UI/Modal/Modal';
// import Aux from '../Auxs/Aux';
import store from "../../store";

import setAuthToken from "../../utils/setAuthToken";
// import {useDispatch} from "react-redux";
import { SET_CURRENT_USER } from "../../actions/types";
import {logoutUser, setCurrentUser,removeCurrentUser} from "../../actions/auth"
import { GET_ERRORS, } from "../../actions/types";
import { useNavigate} from 'react-router-dom';

// const ErrorHandler = (WrappedComponent,axios) => {

//     return (props) => {

//     const [error, setError] = useState(null);
//     const navigate = useNavigate();
  
//     useEffect(() => {
//       // set up interceptors
//       const reqInterceptor = axios.interceptors.request.use((req) => {
//         setError(null);
//         return req;
//       });
//       const resInterceptor = axios.interceptors.response.use(
//         (res) => res,
//         (error) => {
//           setError(error);
//           console.log(error.response, "intercepo");
//           if (error.response.status === 401) {
//             localStorage.removeItem("jwtToken");
//             localStorage.removeItem("isAdmin");
  
//             // Remove auth header for future requests
//             setAuthToken(false);
//             store.dispatch(removeCurrentUser());
//             navigate("/login");
//           } else if (error.response.status === 500) {
//             console.log(error, "qwerty");
//             store.dispatch({
//               type: GET_ERRORS,
//               payload: error.response.data,
//             });
//             navigate("/error");
//           } else if (error.response.status === 400) {
//             store.dispatch({
//               type: GET_ERRORS,
//               payload: error.response.data,
//             });
//           } else {
//             // handle all other errors
//             console.error(error);
//             navigate("/error");
//           }
  
//           return Promise.reject(error);
//         }
//       );
  
//       // clean up interceptors
//       return () => {
//         axios.interceptors.request.eject(reqInterceptor);
//         axios.interceptors.response.eject(resInterceptor);
//       };
//     }, []);
  
//     return (
//       <Fragment>
//         {/* {error && <div>{error.message || "Something went wrong!"}</div>} */}
//         <WrappedComponent {...props} />
//       </Fragment>
//     );
//   };
// }



const ErrorHandler = (WrappedComponent,axios) => {
    
    return (props) => {
        const [error,setError] = useState(null)
        const navigate = useNavigate()

        useEffect(() => {
          
            axios.interceptors.request.use(req => {
                setError(null)
                return req;
            });
            axios.interceptors.response.use(res => {
                console.log(res,'ttttttttttttttt')
                    return res
            }  , error => {
                setError(error)
                console.log(error.response,'intercepo');
                if(error.response.status == "401" ) {
                    console.log('401');
                    
                    localStorage.removeItem("jwtToken");
                    localStorage.removeItem("isAdmin");
                 
                    // // // Remove auth header for future requests
                    setAuthToken(false) 
                    store.dispatch(removeCurrentUser())
                    store.dispatch({
                        type: GET_ERRORS,
                        payload: error.response.data,
                      })
                        console.log('wqwerty')
                 navigate('/login');
                    
                }
                else if(error.response.status == "500") {
                    console.log(error,'qwerty')
                     store.dispatch({
                        type: GET_ERRORS,
                        payload: error.response.data,
                      })
                     navigate('/error');

            
                }
                else if(error.response.status == "400") {
                    return store.dispatch({
                        type: GET_ERRORS,
                        payload: error.response.data,
                      })
                    
                   
                }else {
                    store.dispatch({
                        type: GET_ERRORS,
                        payload: error.response.data,
                      })
                    // navigate("/error");
                }
                return Promise.reject(error)

                
            });

            
          
        }, [])
        

        return (
            <Fragment >
                
                <WrappedComponent {...props} />
            </Fragment>
    )
        
    }
    
   
}

export default ErrorHandler;
