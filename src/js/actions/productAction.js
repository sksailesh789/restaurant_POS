import axios from "axios";
import { GET_ERRORS,SET_MODAL,SET_SPINNER,REMOVE_SPINNER } from "./types";
import { API } from "../config";

export const addProductHandler = (product) => (dispatch) => {
  dispatch({
    type: SET_SPINNER,
  })
   axios
      .post(`${API}/product`, product)
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
      .catch((err) => {
        dispatch({
          type: REMOVE_SPINNER,
        })
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data,
        })
       
      });
};


