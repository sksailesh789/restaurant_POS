import axios from "axios";

import { API } from "../config";
import { 
    GET_ALL_CATEGORIES_SUCCESS,
    GET_ALL_CATEGORIES_REQUEST,
    GET_ALL_CATEGORIES_FAILURE,
    ADD_NEW_CATEGORY_REQUEST,
    ADD_NEW_CATEGORY_SUCCESS,
    ADD_NEW_CATEGORY_FAIL
} 
        from "./types"



export const getAllCategory = () => {
    return async dispatch => {
        dispatch({type: GET_ALL_CATEGORIES_REQUEST})
        const res = await axios.get(`${API}/category`);
        console.log(res ,'opop');
        if(res.status === 200) {
            dispatch({
                type: GET_ALL_CATEGORIES_SUCCESS,
                payload: {categories: res.data}
            })
        }else{
            dispatch({
                type: GET_ALL_CATEGORIES_FAILURE,
                payload: {error: res.data.error}
            })
        }
    }
}
export const addCategory = (form) => {
    return async dispatch => {
        dispatch({type: ADD_NEW_CATEGORY_REQUEST})
        const res = await axios.post(`${API}/category`,form)
        console.log(res,'reeeeeee');
        if(res.status === 201) {
            dispatch({
                type : ADD_NEW_CATEGORY_SUCCESS ,
                // payload : {category : res.data.category}
                payload : {category : res.data}

            })
            
        } else {
            dispatch({
                type : ADD_NEW_CATEGORY_FAIL,
                payload : res.data.error
            })
            
        }
    }
}
export const updateCategories = (form) => {
    return async dispatch => {
        const res = await axios.post(`${API}/category/update`,form)
        console.log(res,'reeeeeee');
        if(res.status === 201) {
            return true;
            console.log(res,'ree')
            
        } else {
            
            console.log(res,'ree1')
            
        }
    }
}

export const deleteCategories = (ids) => {
    return async dispatch => {
        const res = await axios.post(`${API}/category/delete`,{
            payload: {
                ids
            }
        })
        if(res.status == 201) {
            return true;
        } else {
             return false;
        }
    }
}