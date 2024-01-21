
import { SET_SPINNER,REMOVE_SPINNER } from "../actions/types";

const initialState = {
  isSpinner : false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_SPINNER:
      return {
        ...state,
        isSpinner: true,
      };
      case REMOVE_SPINNER:
      return {
        ...state,
        isSpinner: false,
      };
    default:
      return state;
  }
}
