import React,{useState,useEffect,Fragment} from 'react'
import axios from 'axios'
import Sidebar from '../Dashboard/Sidebar'
import BeatLoader from "react-spinners/BeatLoader";
import { API } from "../../config";
import {Link , useNavigate} from 'react-router-dom'
import {useDispatch,useSelector} from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit,faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import Modal from "../../components/Modal"
import ErrorHandler from "../ErrorHandler/ErrorHandler";
import { removeModalHandler } from "../../actions/modalAction";
import { GET_ERRORS } from "../../actions/types";
import store from "../../store/index"
import classnames from "classnames";


const UserList = () => {
    const [userList,setUserList] = useState([])
    const [name,setName] = useState([])
    const [errors, setErrors] = useState("")
    const [deleteID , setDeleteID] = useState("")
    const [showModal , setShowModal] = useState(false)
    const [isDeleted , setIsdeleted] = useState(false)
    const [loading , setLoading] = useState(false)
    const [slider,setSlider] = useState(true)

    const dispatch = useDispatch();
    const error = useSelector(state => state.error)
    const modalState = useSelector(state => state.modal)
    const navigate = useNavigate()

    const sliderState = useSelector(state => state.slider)

  useEffect(() => {
    setSlider(sliderState.isSlider)
    
  }, [sliderState])

    useEffect(() => {
      setErrors(error)
      
    }, [error])
    useEffect(() => {
      setShowModal(modalState.isModal)
      
    }, [modalState])

    useEffect(() => {
      setLoading(true)
        axios
        .get(`${API}/users/userlist`)
        .then((res) =>
        {   
          setLoading(false)
            setUserList(res.data)}
        )
        .catch((err) => { 
          setLoading(false)
          console.log(err.response.status,'iii')
          if(err.response.status == "500") {
           return navigate('/error')
          }
          console.log(error,'errrr')
        });

    }, [])
    const handleSearch= () => {
      setLoading(true)
      axios
      .get(`${API}/users/userlist?&name=${name}`)
      .then((res) =>
      {
      setLoading(false)
      setUserList(res.data)
        }
      )
      .catch((err) => {
        console.log(err,'iii')
      setLoading(false)
        if(err.response.status == "500") {
         return navigate('/error')
        }
      })
    }
    
const onDelete = (id) => {
  axios
  .post(`${API}/users/delete/${id}`)
  .then((res) =>
  { 
  setShowModal(false)
      axios
      .get(`${API}/users/userlist`)
      .then((res) =>
        setUserList(res.data)
      )
      .catch((err) => console.log(err))}
  )
  .catch(
    (err) => console.log(err, "err")
    
  ); }

  const closeModalHandler = () => {
    dispatch(removeModalHandler())
    // setShowModal(false)
    
}

    let userlist = userList.map((user) => (
        <tr key= {user._id}>
           
            <td>
              <h6>{user.name}</h6>
            </td>
            <td>
              <h5>{user.isAdmin}</h5>
            </td>
            <td>
              <h5>{user.isWaiter}</h5>
            </td>
            <td>
              <Link to={`/user/edit/${user._id}`}>
                <FontAwesomeIcon
                  icon={faEdit}
                  style={{ color: "#54545c", marginRight: "10px" ,fontSize:'14px'}}
                />
              </Link>
            </td>
            <td>
              <FontAwesomeIcon
                icon={faTrash}
                style={{ color: "#54545c",fontSize:'14px' }}
                onClick={() => {
                  console.log(user._id,'uid')
                  setDeleteID (user._id)
                  setShowModal(true)
              }}
              />
            </td>
          </tr>
    ));
  return (
    <>
    {showModal ? 
        <Modal 
          show={showModal} 
          handleClose={ closeModalHandler } 
        > 
        {!isDeleted ? 
            ( 
              <Fragment>
                  <h5>Do you want to delete ?</h5> 
                  <FontAwesomeIcon icon={faTrash} style={{fontSize: '30px',display: 'block' ,color: 'red',textAlign: 'center',margin:' auto auto 22px'}}/> 
                  <div className="btn_wrap  " style={{display:"flex",justifyContent:'space-around'}}>
                    <button className="btn-delete" onClick = { () => onDelete(deleteID)}> Delete</button>
                    <button className="btn-edit" onClick = {() => setShowModal(false)}> Cancel</button>
                  </div>
              </Fragment>
        ) :(
            <Fragment>
                <h5>Deleted Sucessfully</h5> 
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  style={{fontSize: '30px',display: 'block' ,color: 'red',textAlign: 'center',margin:' auto auto 22px'}}
              />
              <button className="btn-edit" onClick = {() =>{ 
                setShowModal(false)
                setIsdeleted (false)}}
                > Close</button>
            </Fragment>
        )}
           
        </Modal> 
        : "" 
      } 
    <div className="dashboard_wrapper">
          <div className="container-fluid">
          <div className="row">
            {/* <div className="w-17"> */}
                <Sidebar />
            {/* </div> */}
            <div 
                 className={classnames( slider ? 'w-82' : 'w-100')}>
            <div className='dashboard_right'>
              <h3 className=" dashboard-header">
                     All Users
                  </h3>
                  {errors ? <p>error</p> : ''}
              <div className="admin_search_container">
                <div className="asc_wrap_container">
                <div className="asc_wrap">
                      <label for="name">Search by Name : </label>
                      <input
                        type="text"
                        // placeholder="name"
                        id="name"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                  </div>
                </div>
                  
                  <button className="btn-search" onClick={handleSearch}>Search</button>
              </div>
              {loading ? <BeatLoader /> : (
                <div className="table_wrap">
                <table className= "table" >
                  <thead className= "table-head">
                    <tr className= "table-head-each">
                      <th>Name</th>
                      <th>isAdmin</th>
                      <th>isWaiter</th>
                      <th>Edit</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody >
                    {userlist}
                  </tbody>
                </table>
                  </div>
              )}
            
            </div>
          </div>
          </div>
          </div>
          </div>
          </>
  )
}

export default ErrorHandler(UserList,axios)