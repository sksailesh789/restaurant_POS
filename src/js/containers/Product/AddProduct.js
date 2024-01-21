import React, { Component, Fragment, useState ,useEffect} from "react";
import { withRouter } from "react-router-dom";
import classnames from "classnames";
import BeatLoader from "react-spinners/BeatLoader";
import { GET_ERRORS,REMOVE_MODAL } from "../../actions/types";
import { removeModalHandler } from "../../actions/modalAction";

import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { API } from "../../config";
import Sidebar from "../Dashboard/Sidebar"
import Modal from "../../components/Modal"
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import {addProductHandler} from "../../actions/productAction"
import { useDispatch,useSelector } from "react-redux"
import ErrorHandler from "../ErrorHandler/ErrorHandler";
import store from "../../store/index"
import {useParams} from "react-router"
import Spinner from "../../components/Spinner"



const AddProduct = (props) => {
    const [id , setId] = useState('')
    const [name , setName] = useState('')
    const [category , setCategory] = useState('')
    const [price , setPrice] = useState('')
    const [image , setImage] = useState('')
    const [errors , setErrors] = useState('')
    const [loading , setLoading] = useState(false)
    const [option , setOption] = useState('')
    const [categoryList , setCategoryList] = useState([])
    const [cat_Hiearchy , setCat_Hiearchy] = useState([])
    const [showModal , setShowModal] = useState(false)
    const [slider,setSlider] = useState(true)


  const dispatch = useDispatch();
  const error = useSelector(state => state.errors)
  const modalState = useSelector(state => state.modal)
  const spinnerState = useSelector(state => state.spinner)

  const { productId } = useParams();

  const sliderState = useSelector(state => state.slider)

  useEffect(() => {
    setSlider(sliderState.isSlider)
    
  }, [sliderState])
  
  useEffect(() => {
    axios.get(`${API}/category/all`).then((res) => {
         setCategoryList( res.data)
    }).catch((err) => setErrors(err));

 
    

    return () => {
      dispatch({
        type: GET_ERRORS,
        payload: '',
      })
    }
    
  }, [])
  useEffect(() => {
    if(productId) {

    axios
        .get(`${API}/product/${productId}`)
        .then((res) => {
          setId(res.data._id),
              setName(res.data.name),
              setCategory (res.data.category),
              setPrice (res.data.price),
              setImage (res.data.image),
              setOption(res.data.option)
        })
        .catch((err) => console.log(err));

      }
  }, [])

  useEffect(() => {
    setErrors(error)
    
  }, [error])
  useEffect(() => {
    setShowModal(modalState.isModal)
    
  }, [modalState])
  
  useEffect(() => {
    setLoading(spinnerState.isSpinner)
  }, [spinnerState])
  
  useEffect(() => {
    dispatch({
        type: GET_ERRORS,
        payload: '',
      })
      return () => {
        dispatch({
          type: GET_ERRORS,
          payload: '',
        })
      }
  }, [])
  

  const onSubmit = (e) => {
    store.dispatch({
      type: GET_ERRORS,
      payload: '',
    })
    e.preventDefault();
    setLoading(true)
    const fd = new FormData();
    fd.append("name", name);
    // if(productId) {
      console.log(category,'ccid')
    fd.append("category", category._id ? category._id : category);
    // }
    // else {
    // fd.append("category", category);
    // }
    fd.append("price", price);
    fd.append("_id", id);
    fd.append("option" , option );
    // fd.append("parentCategory", this.state.cat_Hiearchy);
    for (const key of Object.keys(cat_Hiearchy)) {
      fd.append('parentCategory', cat_Hiearchy[key])
  }
    for (const key of Object.keys(image)) {
      fd.append('image', image[key])
  }

   dispatch(addProductHandler(fd))
  }
  const handleStateChange = (event) => {
    setOption(event.target.value);
  };
  const getCategoryHiearchy = (catego ,catHiearchy) => {
    // const catHiearchy = [];
    if(catego === "") {
      return
    }
    let abc =  categoryList.filter( (x) => x._id === catego);
    console.log(abc,'categgo');
    console.log(catHiearchy,'cathiearchy');

    if(! abc[0].parentId && catHiearchy){
      return catHiearchy;
    }

    catHiearchy.push(abc[0].parentId);
    getCategoryHiearchy(abc[0].parentId , catHiearchy )

  }
  const handleCategoryChange = (event) => {
   setCategory( event.target.value)
    let catHiearchy = [];
    getCategoryHiearchy(event.target.value , catHiearchy);
    setCat_Hiearchy(catHiearchy)
  }
 
    const handleChange = (name) => (event) => {
      console.log(event.target.files , 'fil');
      // const value =
      //   name === "image" ? event.target.files[0] : event.target.value;
      // this.setState({ image: value });
      setImage (event.target.files )
    };
    let optionState = [
      { id: 1, name: "per plate" },
      { id: 0, name: "per kg" },
      { id: 2, name: "per piece" },
      { id: 3, name: "per litre" },
      
    ];

    const closeModalHandler = () => {
        dispatch(removeModalHandler())
        // setShowModal(false)
        setName(''),
        setCategory (''),
        setPrice (''),
        setImage (''),
        setOption('')
        setId('')
    }

    return (
      <Fragment>
          {showModal ? 
            <Modal 
              show={showModal} 
              handleClose={() => {
                closeModalHandler()
              }} 
            > 
               <h5>Product added successfully</h5> 
               <FontAwesomeIcon
                icon={faCheckCircle}
                style={{ fontSize: '40px',display: 'block',color: 'green' ,textAlign: 'center', margin: 'auto auto 22px' }}
                />
              <button className="btn-edit" 
                  onClick = {() => {
                    closeModalHandler()
              }}> Close</button>
            </Modal> 
            : "" 
          } 
          {loading ? <Spinner /> : ''}

        <div className="dashboard_wrapper">
          <div className="container-fluid">
          <div className="row">
            {/* <div className="w-17"> */}
                <Sidebar />
            {/* </div> */}
            <div 
             className={classnames( slider ? 'w-82' : 'w-100')}>
            <div className='dashboard_right'>
                <div className="contact-wrap">
                  <h3 className="large ">
                    {/* Add Product */}
                    {productId ? "Edit Product" : "Add Product"}
                  </h3>
                  
                        <form className="form" onSubmit={onSubmit}>
                        <div className="row">
                          <div className="form-group col-md-6 col-sm-10">
                            <div className="form-group-wrap">
                              <label for="name">Name :</label>
                                <input
                                  type="text"
                                  placeholder="name"
                                  id="name"
                                  className={classnames({ "is-invalid": errors.name })}
                                  name="name"
                                  value={name}
                                  onChange={(e) => setName(e.target.value)}
                                />
                                {errors.name && (
                                  <div className="invalid-feedback">{errors.name}</div>
                                )}
                            </div>
                          </div>
                          <div className="form-group col-md-6 col-sm-10">
                            <div className="form-group-wrap">
                              <label for="category">Category:</label>
                                <select id="category" 
                                onChange={handleCategoryChange}
                                className={classnames({ "is-invalid": errors.category })}
                                >
                                  <option value="">Select category : </option>
                                    {categoryList.map((cate) => (
                                      <option value={cate._id} key={cate._id} selected={category.name == cate.name} >
                                        {cate.name}
                                      </option>
                                    ))}
                                  </select>
                                {errors.category && (
                                  <div className="invalid-feedback">
                                    {errors.category}
                                  </div>
                                )}
                            </div>
                          </div>
                          <div className="form-group col-md-6 col-sm-10">
                            <div className="form-group-wrap">
                              <label for="price">Price:</label>
                                <input
                                  type="text"
                                  id="price"
                                  placeholder="price"
                                  className={classnames({
                                    "is-invalid": errors.price,
                                  })}
                                  name="price"
                                  value={price}
                                  onChange={(e) => setPrice(e.target.value)}
                                />
                                {errors.price && (
                                  <div className="invalid-feedback">
                                    {errors.price}
                                  </div>
                                )}
                              </div>
                          </div>
                          <div className="form-group col-md-6 col-sm-10">
                            <div className="form-group-wrap">
                              <label for="option">Options :</label>
                                <select id="option" onChange={handleStateChange}>
                                    {optionState.map((loc) => (
                                      <option value={loc.name} key={loc.id} selected={option == loc.name} >
                                        {loc.name}
                                      </option>
                                    ))}
                                  </select>
                            </div> 
                          </div>
                          
                          <div className="form-group col-md-6 col-sm-10">
                            <div className="form-group-wrap">
                              <label for="image"> Image:</label>
                              <input
                                type="file"
                                id="image"
                                accept="image/*"
                                name="image"
                                onChange={handleChange("image")}
                                multiple
                              />
                            </div>
                          </div>
                         
                        </div>
                        <div className="submit-btn ">
                            <input type="submit" className="btn " value="Submit" />
                          </div>
                      </form>
                  
                </div>
    
          </div>
            </div>
          </div>
          
        </div>
        
        </div>
      </Fragment>
    );
  }






export default ErrorHandler(AddProduct,axios);
