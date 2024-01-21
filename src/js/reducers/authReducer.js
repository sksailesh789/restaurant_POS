
import { SET_CURRENT_USER,REMOVE_CURRENT_USER ,SET_MESSAGE} from "../actions/types";

const initialState = {
  isAuthenticated: false,
  user: {},
  message: ''
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      };
    case REMOVE_CURRENT_USER:
        return {
          ...state,
          isAuthenticated: false,
          user: {},
        };
    case SET_MESSAGE:
        return {
          ...state,
          message: action.payload
          };
    default:
      return state;
  }
}
