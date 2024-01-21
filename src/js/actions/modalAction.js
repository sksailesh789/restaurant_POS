import axios from "axios";
import { GET_ERRORS,REMOVE_MODAL } from "./types";

export const removeModalHandler = () => (dispatch) => {
  console.log('removemodal')
        dispatch({
          type: REMOVE_MODAL,
        })
      
};


