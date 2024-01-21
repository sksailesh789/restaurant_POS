import {createStore,applyMiddleware,compose} from "redux"
import thunkMiddleware from 'redux-thunk'
import rootReducers from "../reducers/index"
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

       
const store = createStore(
    rootReducers,
    composeEnhancers(applyMiddleware(thunkMiddleware))
)
export default store