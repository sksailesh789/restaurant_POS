
import { SET_SLIDER,REMOVE_SLIDER } from "../actions/types";

const initialState = {
  isSlider : true,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_SLIDER:
      return {
        ...state,
        isSlider: true,
      };
      case REMOVE_SLIDER:
      return {
        ...state,
        isSlider: false,
      };
    default:
      return state;
  }
}
