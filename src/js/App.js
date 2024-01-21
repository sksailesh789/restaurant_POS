import React from 'react';
import {Provider} from 'react-redux'
import Login from './containers/Authentication/Login';
import Register from './containers/Authentication/Register';
import AddProduct from './containers/Product/AddProduct';
import AdminProductList from './containers/Product/AdminProductLists';
import AdminTableList from './containers/Table/AdminTableList';
import AddTable from './containers/Table/AddTable';
import Category from "./containers/category/index"
import UserList from "./containers/User/UserList"
import ErrorPage from './containers/ErrorHandler/ErrorPage';
import FastBilling from './containers/FastBilling/FastBilling';
import TableBilling from './containers/TableBilling/TableBilling';
import TableBooking from './containers/TableBooking/TableBooking';
import BillingLists from './containers/TableBilling/BillingLists';
import ForgetPassword from "./containers/Authentication/ForgetPassword"


import Dashboard from "./containers/Dashboard/Dashboard"
import OrderList from "./containers/Order/OrderList"

import Home from "./components/Home"
import store from "./store/index"

import Navbar from './components/Navbar';
import setAuthToken from "./utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { setCurrentUser } from "./actions/auth";
import { PrivateRoute} from "./containers/Authentication/PrivateRoute";


import {
  HashRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

if (localStorage.jwtToken) {
  // set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // decode token and get user info and exp
  const decode = jwt_decode(localStorage.jwtToken);
  console.log(decode,'kl');
  decode.isAdmin = localStorage.isAdmin;
  store.dispatch(setCurrentUser(decode));
  
}

export default function App() {
  return (
    <Provider store={store}>
        <Router>
        <Navbar />
        <div className='content-wrapper'>
            <Routes>
            <Route path="/" exact element={<PrivateRoute><Dashboard/></PrivateRoute>}  />
            <Route path="/login" element={<Login/>}  />
            <Route path="/register" element={<Register/>}  />
            <Route path="/addProduct" element={<PrivateRoute><AddProduct/></PrivateRoute>}  />
            <Route path="/adminProductList" element={<PrivateRoute><AdminProductList/></PrivateRoute>}  />
            <Route path="/addTable" element={<PrivateRoute><AddTable/></PrivateRoute>}  />
            <Route path="/table/edit/:tableId" element={<PrivateRoute><AddTable/></PrivateRoute>}  />
            <Route path="/product/edit/:productId" element={<PrivateRoute><AddProduct/></PrivateRoute>}  />
            <Route path="/admin/table" element={<PrivateRoute><AdminTableList/></PrivateRoute>}  />
            <Route path="/addCategory" element={<PrivateRoute><Category/></PrivateRoute>}  />
            <Route path="/UserList" element={<PrivateRoute><UserList/></PrivateRoute>}  />
            <Route path="/OrderList" element={<PrivateRoute><OrderList/></PrivateRoute>}  />
            <Route path="/FastBilling" element={<PrivateRoute><FastBilling/></PrivateRoute>}  />
            <Route path="/TableBilling" element={<PrivateRoute><TableBilling/></PrivateRoute>}  />
            <Route path="/tableBook" element={<PrivateRoute ><TableBooking /></PrivateRoute>}/>
            <Route path="/billingLists" element={<PrivateRoute><BillingLists/></PrivateRoute>} />
            {/* <Route path="/forgetpassword" element={<ForgetPassword/>} /> */}
            <Route path="/error" element={<ErrorPage/>}  />
            </Routes>
        </div>
        </Router>
    </Provider>

  )
}
