import React, { useState, Fragment ,useEffect} from "react";
import { connect, useDispatch,useSelector } from "react-redux";
import axios from "axios";
import {API,imageAPI} from "../../config";
import { Link,useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../Dashboard/Sidebar"
import Modal from "../../components/Modal"
import ErrorHandler from "../ErrorHandler/ErrorHandler";
import Pagination from "rc-pagination"
import Spinner from "../../components/Spinner"
import classnames from "classnames";



const TableList = () => {
    const [tableList, setTableList] = useState([])
    const [errors, setErrors] = useState("")
    const [name, setName] = useState("")
    const [deleteID , setDeleteID] = useState("")
    const [showModal , setShowModal] = useState(false)
    const [isDeleted , setIsdeleted] = useState(false)
    const [listsNo,setListsNo] = useState(0)
    const [perPage, setPerPage] = useState(5);
    const [size, setSize] = useState(perPage);
    const [current, setCurrent] = useState(1);
    const [loading,setLoading] = useState(false)
    const [slider,setSlider] = useState(true)

    const dispatch = useDispatch();
    const error = useSelector(state => state.error)
    const modalState = useSelector(state => state.modal)
    const sliderState = useSelector(state => state.slider)

    const navigate = useNavigate()

    useEffect(() => {
      setErrors(error)
      
    }, [error])
    useEffect(() => {
      setShowModal(modalState.isModal)
      
    }, [modalState])

    useEffect(() => {
      setSlider(sliderState.isSlider)
      
    }, [sliderState])

    useEffect(() => {
      setLoading(true)
        axios
        .get(`${API}/table`)
        .then((res) =>
          {
          setLoading(false)
          setTableList (res.data.data)
          setListsNo(res.data.totaldata)
        }
          )
        .catch((err) => {
          setLoading(false)
                if(err.response.status == "500") {
                return navigate('/error')
                }
        });
    }, [])
    


  const handleSearch = () => {
    axios
    .get(`${API}/table?&name=${name}`)
    .then((res) =>
    {
      setTableList (res.data.data)
      })
    .catch((err) => console.log(err));
  }

  const PerPageChange = (value) => {
    setSize(value);
    const newPerPage = Math.ceil(datatableUsers.length / value);
    if (current > newPerPage) {
        setCurrent(newPerPage);
    }
}
  
  const PrevNextArrow = (current, type, originalElement) => {
    if (type === 'prev') {
        return <button><i className="fa fa-angle-double-left"></i></button>;
    }
    if (type === 'next') {
        return <button><i className="fa fa-angle-double-right"></i></button>;
    }
    return originalElement;
}

const PaginationChange = (page, pageSize) => {
  setLoading(true)
  setCurrent(page);
  setSize(pageSize)
  axios
      .get(`${API}/table?&page=${page}`)
      .then((res) => {
        setLoading(false)
        setTableList (res.data.data)
        setListsNo(res.data.totaldata)
      }) .catch((err) => {
        setLoading(false)
              if(err.response.status == "500") {
              return navigate('/error')
              }
      }
      );
  
}
  

const onDelete = (id) => {
  setLoading(true)
    axios
    .post(`${API}/table/${id}`)
    .then((res) =>
    { 
      
    setShowModal(false)
        axios
        .get(`${API}/table`)
        .then((res) =>
           { 
            setLoading(false)
            setTableList(res.data.data)
            setListsNo(res.data.totaldata)
          })
        .catch((err) => {
          setLoading(false)
          if(err.response.status == "500") {
            return navigate('/error')
            }
        })}
    )
    .catch(
      (err) => {
        setLoading(false)
        if(err.response.status == "500") {
          return navigate('/error')
          }
      }
      
    ); }

  
    let tablelist = tableList.map((table) => (
        <tr key= {table._id}>
            <td>
              <h6>{table.name}</h6>
            </td>
            <td>
              <Link to={`/table/edit/${table._id}`}>
                <FontAwesomeIcon
                  icon={faEdit}
                  style={{ color: "#54545c", marginRight: "10px",fontSize:'14px' }}
                />
              </Link>
            </td>
            <td>
              <FontAwesomeIcon
                icon={faTrash}
                style={{ color: "#54545c" ,fontSize:'14px'}}
                onClick={() => {
                    setDeleteID (table._id)
                    setShowModal(true)
                }
              }
              />
            </td>
          </tr>
    
    ));
    return (
      <Fragment>
        {showModal ? 
        <Modal 
          show={showModal} 
          handleClose={ () => {setShowModal(false)} } 
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
          {loading ? <Spinner /> : ''}

        <div className="dashboard_wrapper">
          <div className="container-fluid">
          <div className="row">
            {/* <div className="w-17"> */}
                <Sidebar />
            {/* </div> */}
            <div className={classnames( slider ? 'w-82' : 'w-100')}>
            <div className='dashboard_right'>
              <div className="dashboard-header">
                  <h4>Table List</h4>
              </div>
              <div className="admin_search_container">
                <div className="asc_wrap_container">
                <div className="asc_wrap">
                      <label for="name">Search by Name : </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                  </div>
                </div>
                  
                  <button className="btn-search" onClick={handleSearch}>Search</button>
              </div>
              <div className="table_wrap">
              <table className= "table" >
                <thead className= "table-head">
                  <tr className= "table-head-each">
                    <th>Name</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody >
                  {tablelist}
                </tbody>
              </table>
              <div className="table-filter-info">
                                
                  <Pagination
                      className="pagination-data"
                      showTotal={(total, range) => `Showing ${range[0]}-${range[1]} of ${total}`}
                      onChange={PaginationChange}
                      total={listsNo}
                      current={current}
                      pageSize={size}
                      showSizeChanger={false}
                      itemRender={PrevNextArrow}
                      onShowSizeChange={PerPageChange}
                    />
                </div>
                </div>
            </div>
          </div>
          </div>
          </div>
          </div>
       
  
      </Fragment>
    );
  }




export default ErrorHandler(TableList,axios) ;
