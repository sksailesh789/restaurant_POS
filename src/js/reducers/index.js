import { combineReducers } from "redux";
import errorReducer from "./errorReducer";
import authReducer from "./authReducer";
import modalReducer from "./modalReducer";
import categoryReducer from "./categoryReducer";
import spinnerReducer from "./spinnerReducer";
import sliderReducer from "./sliderReducer.js"



export default combineReducers({
    errors: errorReducer,
    auth:authReducer,
    modal:modalReducer,
    categoryData:categoryReducer,
    spinner:spinnerReducer,
    slider:sliderReducer
});
