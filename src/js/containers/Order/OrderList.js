import React, { useState, Fragment ,useEffect} from "react";
import { connect, useDispatch,useSelector } from "react-redux";
import axios from "axios";
import Spinner from "../../components/Spinner"
import {API,imageAPI} from "../../config";
import { Link,useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../Dashboard/Sidebar"
import Modal from "../../components/Modal"
import ErrorHandler from "../ErrorHandler/ErrorHandler";
import { removeModalHandler } from "../../actions/modalAction";
import { GET_ERRORS,SET_MODAL,SET_SPINNER,REMOVE_SPINNER } from "../../actions/types";
import Pagination from "rc-pagination"
import OrderDetail from "./OrderDetail"
import classnames from "classnames";


const OrderList = () => {
    const [orderList, setOrderList] = useState([])
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
    const [modalItems , setModalItems] = useState([])
    const [modalTotal , setModalTotal] = useState('')
    const [modalTableNo , setModalTableNo] = useState('')
    const [modalEnglishDate , setModalEnglishDate] = useState('')
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
        .get(`${API}/order`)
        .then((res) => {
          setLoading(false)
          setOrderList (res.data.data)
          setListsNo(res.data.totaldata)
        })
        .catch((err) => {
          setLoading(false)
                if(err.response.status == "500") {
                return navigate('/error')
                }
        });
    }, [])

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
  const closeModalHandler = () => {
       
    dispatch(removeModalHandler())
}
  const PaginationChange = (page, pageSize) => {
    setLoading(true)
    setCurrent(page);
    setSize(pageSize)
    axios
        .get(`${API}/order?&page=${page}`)
        .then((res) => {
          setLoading(false)
          setOrderList (res.data.data)
          setListsNo(res.data.totaldata)
        }) .catch((err) => {
          setLoading(false)
                if(err.response.status == "500") {
                return navigate('/error')
                }
        }
        );
    
}
const showOrderedHandler = (id)  => {
  setLoading(true)
   axios
      .get(`${API}/order/${id}`)
      .then((res) =>
     { 
      setModalItems(res.data.orderItems)
      setModalTotal(res.data.totalprice)
      setModalTableNo(res.data.table)
      setModalEnglishDate(res.data.createdAt)
      if(res.status && res.status == 200 || res.status == 201) {
          setLoading(false)
        dispatch({
          type: SET_MODAL,
        })

      }else {
        setLoading(false)
          console.log(err,'-----------------------')
          // dispatch({
          //   type: REMOVE_SPINNER,
          // })
        }
      }
      )
      .catch((err) => {
        setLoading(false)
        console.log(err,'-----------------------')
        // dispatch({
        //   type: REMOVE_SPINNER,
        // })
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data,
        })
       
      });
};

//   const handleSearch = () => {
//     axios
//     .get(`${API}/table?&name=${name}`)
//     .then((res) =>
//     {
//       setTableList (res.data.data)
//       })
//     .catch((err) => console.log(err));
//   }

  

// const onDelete = (id) => {
//     axios
//     .post(`${API}/table/${id}`)
//     .then((res) =>
//     { 
//     setShowModal(false)
//         axios
//         .get(`${API}/table`)
//         .then((res) =>
//             setTableList(res.data)
//         )
//         .catch((err) => console.log(err))}
//     )
//     .catch(
//       (err) => console.log(err, "err")
      
//     ); }

  
    // let orderlists = orderList.map((order) => (
    //     <div className="table_orderlistwrap">
    //                               {order.orderItems.map(e => (
    //                                   <div key={e._id} className= "order-item-list">
    //                                       <p>name : {e.name}</p>
    //                                       <p>price: {e.price}</p>
    //                                       <p>quantity: {e.qty}</p>
    //                                   </div>
                                      
    //                               ))}
    //     </div>
    
    // ));
    return (
      <Fragment>
        {showModal ? 
        <Modal 
          show={showModal} 
          large
          handleClose={() => {
            closeModalHandler()
          }} 
        > 
           <OrderDetail    lists={modalItems} total={modalTotal} tableno ={modalTableNo}  engdate= {modalEnglishDate} />
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
              <div className="dashboard-header">
                  <h4>Order List</h4>
              </div>
              
                {/* <div className="table_wrap">

                  {orderlists}
                </div> */}
                <table style={{width:'100%'}}>
                                <thead>
                                    <tr>
                                        <th>SN</th>
                                        <th>Date</th>
                                        <th>Table No</th>
                                        <th>TotalPrice</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    
                                    {orderList && orderList.map((list,index) => (
                                        <tr key={index} 
                                        onClick={() => showOrderedHandler(list._id)}
                                        >
                                            <td>{index + 1 }</td>
                                            <td>{list.createdAt.slice(0,10)}</td>
                                            <td>{list.table && list.table.name}</td>
                                            <td > {list.totalprice}</td>

                                        </tr>
                                    ))} 
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
       
  
      </Fragment>
    );
  }




export default ErrorHandler(OrderList,axios) ;
