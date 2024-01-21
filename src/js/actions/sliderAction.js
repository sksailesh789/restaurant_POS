import { SET_SLIDER,REMOVE_SLIDER } from "./types";

export const removeSliderHandler = () => (dispatch) => {
        dispatch({
          type: REMOVE_SLIDER,
        })
      
};

export const setSliderHandler = () => (dispatch) => {
    dispatch({
      type: SET_SLIDER,
    })
  
};
