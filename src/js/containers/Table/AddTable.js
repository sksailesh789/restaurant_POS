import React, { Component, useEffect,useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import classnames from "classnames";
import axios from "axios";
import {addTableHandler} from "../../actions/tableActions"
import BeatLoader from "react-spinners/BeatLoader";
import { GET_ERRORS,REMOVE_MODAL } from "../../actions/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { removeModalHandler } from "../../actions/modalAction";
import ErrorHandler from "../ErrorHandler/ErrorHandler";
import Sidebar from "../Dashboard/Sidebar";
import store from "../../store/index"
import Modal from "../../components/Modal"
import Spinner from "../../components/Spinner"
import {API,imageAPI} from "../../config";
import {useParams} from "react-router"


const AddTable = () =>  {
    const [id , setId] = useState('')
    const [name , setName] = useState('')
    const [errors , setErrors] = useState('')
    const [loading , setLoading] = useState(false)
    const [showModal , setShowModal] = useState(false)
    const [slider,setSlider] = useState(true)

    const dispatch = useDispatch();
    const error = useSelector(state => state.errors)
    const modalState = useSelector(state => state.modal)
    const spinnerState = useSelector(state => state.spinner)
    const sliderState = useSelector(state => state.slider)

    const { tableId } = useParams();



    useEffect(() => {
      setSlider(sliderState.isSlider)
      
    }, [sliderState])
  
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

  useEffect(() => {
    setErrors(error)
    
  }, [error])

  useEffect(() => {
    setLoading(spinnerState.isSpinner)
  }, [spinnerState])
  
  useEffect(() => {
    setShowModal(modalState.isModal)
    
  }, [modalState])

  useEffect(() => {
    if(tableId) {

    axios
        .get(`${API}/table/${tableId}`)
        .then((res) => {
          console.log(res.data,'rdd')
          setName(res.data.name)
          setId(res.data._id)
        })
        .catch((err) => console.log(err));

      }
  }, [])
  
    // componentWillReceiveProps(nextProps) {
    //   if (nextProps.errors) {
    //     this.setState({ errors: nextProps.errors });
    //   }
    // }

 const  onSubmit = (e) => {
    dispatch({
      type: GET_ERRORS,
      payload: '',
    })
    e.preventDefault();

    let fd = {
      name: name,
      _id: id
    }
    
    dispatch(addTableHandler(fd))
    // setLoading(false)
    // axios
    //   .post(`${API}/table`, fd)
    //   .then((res) =>
    //     this.setState({
    //       name: "",
    //       _id: "",
    //     })
    //   )
    //   .catch((err) => { console.log(err);});
    // this.props.addTableHandler(fd)
    // this.setState({loading:false})

  }

  
  const closeModalHandler = () => {
    dispatch(removeModalHandler())
    // setShowModal(false)
    setName('')
}

   
    // console.log(this.props, "prop");

    

    return (
        <>
        {showModal ? 
            <Modal 
              show={showModal} 
              handleClose={() => {
                closeModalHandler()
              }} 
            > 
               <h5>Table added successfully</h5> 
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
            <div className={classnames( slider ? 'w-82' : 'w-100')}>
            <div className='dashboard_right'>
            <div className="contact-wrap">
                <h3 className="">
                  {/* {this.props.match.params.tableId
                    ? "Edit Table"
                    : "Add Table"} */}
                    Add Table
                </h3>
                <form className="form" onSubmit={onSubmit}>
                  <div className="form-group-wrap ">
                    <label for="name">Name :</label>
                    <input
                      type="text"
                      id="name"
                      placeholder="Name"
                      className={classnames({ "is-invalid": errors.name })}
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    {errors.name && (
                                  <div className="invalid-feedback">{errors.name}</div>
                                )}
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
</>
    );
  }


export default ErrorHandler(AddTable,axios)


