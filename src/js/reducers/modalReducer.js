
import { SET_MODAL,REMOVE_MODAL } from "../actions/types";

const initialState = {
  isModal : false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_MODAL:
      return {
        ...state,
        isModal: true,
      };
      case REMOVE_MODAL:
      return {
        ...state,
        isModal: false,
      };
    default:
      return state;
  }
}
