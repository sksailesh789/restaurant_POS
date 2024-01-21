import React,{useState,useEffect} from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Sidebar from "../Dashboard/Sidebar"
import {API} from "../../config";
import axios from "axios"
import Spinner from "../../components/Spinner"
import ErrorHandler from "../ErrorHandler/ErrorHandler";
import { removeModalHandler } from "../../actions/modalAction";
import { useDispatch,useSelector } from "react-redux"
import { GET_ERRORS,SET_MODAL,SET_SPINNER,REMOVE_SPINNER } from "../../actions/types";
 import Pagination from "rc-pagination"
 import Modal from "../../components/Modal"
import BillingDetail from "./BillingDetail"
import classnames from "classnames";


const BillingList = () => {

    // const [fiscalYearList , setFiscalYearList] = useState([])
    // const [fiscalYear , setFiscalyear] = useState('')
    const [billno , setBillno] = useState("")
    const [dateFrom, setDateFrom] = useState("")
    const [dateTo, setDateTo] = useState("")
    // const [partyname, setPartyname] = useState("")
    const [lists,setLists] = useState([])
    const [listsNo,setListsNo] = useState([])
    const [loading,setLoading] = useState(false)
    const [showModal , setShowModal] = useState(false)
    const [errors , setErrors] = useState("")
    const [perPage, setPerPage] = useState(20);
    const [size, setSize] = useState(perPage);
    const [current, setCurrent] = useState(1);
    const [paginationType , setPaginationType] = useState('normal')
    const [modalItems , setModalItems] = useState('')
    const [modalTotal , setModalTotal] = useState('')
    const [modalTableNo , setModalTableNo] = useState('')
    const [modalEnglishDate , setModalEnglishDate] = useState('')
    const [modalBillNo , setModalBillNo] = useState('')
  const [slider,setSlider] = useState(true)



    
    const dispatch = useDispatch();
    const error = useSelector(state => state.errors)
    const modalState = useSelector(state => state.modal)
    const spinnerState = useSelector(state => state.spinner)
    const sliderState = useSelector(state => state.slider)

  useEffect(() => {
    setSlider(sliderState.isSlider)
    
  }, [sliderState])

    const PerPageChange = (value) => {
        setSize(value);
        const newPerPage = Math.ceil(datatableUsers.length / value);
        if (current > newPerPage) {
            setCurrent(newPerPage);
        }
    }

   

    const PaginationChange = (page, pageSize) => {
        console.log(page,pageSize,'ppsss')
        setLoading(true)
        setCurrent(page);
        setSize(pageSize)
        if(paginationType === 'normal') {
            axios
                .get(`${API}/billing?&page=${page}&dateFrom=${dateFrom}&dateTo=${dateTo}`)
                .then((res) =>
                    {
                        setLoading(false)
                        console.log(res.data.data,'p99')
                    setLists( res.data.data)
                    setListsNo(res.data.totaldata)
                    }
                    )
                .catch((err) => {
                    setLoading(false)
                    if(err.response.status == "500") {
                    return navigate('/error')
                    }
                });
        }else if(paginationType === 'thisweek') {
            axios
            .get(`${API}/billing/salesThisWeek?&page=${page}`)
            .then((res) =>
                {
                    setLoading(false)
                    setLists( res.data.data)
                    setListsNo(res.data.totaldata)
                }
                )
            .catch((err) => {
                setLoading(false)
              if(err.response.status == "500") {
               return navigate('/error')
              }
            });
        }else if(paginationType === 'lastmonth') {
            axios
            .get(`${API}/billing/salesLastMonth?&page=${page}`)
            .then((res) =>
                {
                    setLoading(false)
                    setLists( res.data.data)
                    setListsNo(res.data.totaldata)
                }
                )
            .catch((err) => {
                setLoading(false)
              if(err.response.status == "500") {
               return navigate('/error')
              }
            });
        }else if(paginationType === 'thismonth') {
            axios
            .get(`${API}/billing/salesThisMonth?&page=${page}`)
            .then((res) =>
                {
                    setLoading(false)
                    setLists( res.data.data)
                    setListsNo(res.data.totaldata)
                }
                )
            .catch((err) => {
                setLoading(false)
              if(err.response.status == "500") {
               return navigate('/error')
              }
            });
        }else if(paginationType === 'today') {
            axios
            .get(`${API}/billing/salesToday?&page=${page}`)
            .then((res) =>
                {
                    setLoading(false)
                    setLists( res.data.data)
                    setListsNo(res.data.totaldata)
                }
                )
            .catch((err) => {
                setLoading(false)
              if(err.response.status == "500") {
               return navigate('/error')
              }
            });
        }else if(paginationType === 'lastsixmonth') {
            axios
            .get(`${API}/billing/salesLastSixMonth?&page=${page}`)
            .then((res) =>
                {
                    setLoading(false)
                    setLists( res.data.data)
                    setListsNo(res.data.totaldata)
                }
                )
            .catch((err) => {
                setLoading(false)
              if(err.response.status == "500") {
               return navigate('/error')
              }
            });
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




    useEffect(() => {
        setLoading(true)
        axios
        .get(`${API}/billing`)
        .then((res) =>
            {
                setLoading(false)
                console.log(res,'p9')
            setLists( res.data.data)
            setListsNo(res.data.totaldata)
            }
            )
        .catch((err) => {
            setLoading(false)
          if(err.response.status == "500") {
           return navigate('/error')
          }
        });
        // axios
        // .get(`${API}/fiscalYear`)
        // .then((res) =>
        //     {
        //     setFiscalYearList( res.data)
        //     }
        //     )
        // .catch((err) => {
        //   console.log(err,'iii')
          
        // });
       
  }, [])

  useEffect(() => {
    setShowModal(modalState.isModal)
    
  }, [modalState])

        const getData = (e) => {
            e.preventDefault()
            setLoading(true)
            setPaginationType('normal')
            setCurrent(1)

            axios
            .get(`${API}/billing?&page=${current}&dateFrom=${dateFrom}&dateTo=${dateTo}&billNo=${billno}`)
            .then((res) =>
                {
                    setLoading(false)
                setLists( res.data.data)
            setListsNo(res.data.totaldata)
                }
                )
            .catch((err) => {
                setLoading(false)
              if(err.response.status == "500") {
               return navigate('/error')
              }
            });

        }

        const getThisWeek = (e) => {
            
            e.preventDefault()
            setLoading(true)
            setPaginationType('thisweek')
            setCurrent(1)

            axios
            .get(`${API}/billing/salesThisWeek`)
            .then((res) =>
                {
                    setLoading(false)
                    setLists( res.data.data)
                    setListsNo(res.data.totaldata)
                }
                )
            .catch((err) => {
                setLoading(false)
              if(err.response.status == "500") {
               return navigate('/error')
              }
            });
        }
        const getThisMonth = (e) => {
            e.preventDefault()
            setLoading(true)
            setPaginationType('thismonth')
            setCurrent(1)

            axios
            .get(`${API}/billing/salesThisMonth`)
            .then((res) =>
                {
                    setLoading(false)
                setLists( res.data.data)
                setListsNo(res.data.totaldata)
                }
                )
            .catch((err) => {
                setLoading(false)
              if(err.response.status == "500") {
               return navigate('/error')
              }
            });
        }
        const getLastMonth = (e) => {
            e.preventDefault()
            setLoading(true)
            setPaginationType('lastmonth')
            setCurrent(1)
            axios
            .get(`${API}/billing/salesLastMonth`)
            .then((res) =>
                {
                    setLoading(false)
                    setLists( res.data.data)
                    setListsNo(res.data.totaldata)
                }
                )
            .catch((err) => {
                setLoading(false)
              if(err.response.status == "500") {
               return navigate('/error')
              }
            });
        }
        const getLastSixMonth = (e) => {
            e.preventDefault()
            setPaginationType('lastsixmonth')
            axios
            .get(`${API}/billing/salesLastSixMonth`)
            .then((res) =>
                {
                    console.log(res.data,'p99')
                setLists( res.data.data)
                setListsNo(res.data.totaldata)
                }
                )
            .catch((err) => {
              if(err.response.status == "500") {
               return navigate('/error')
              }
            });
        }
        const getTodaySales = (e) => {
            e.preventDefault();
            setPaginationType('today')
            setCurrent(1)
            
            axios
            .get(`${API}/billing/salesToday`)
            .then((res) =>
                {
                    setLists( res.data.data)
                    setListsNo(res.data.totaldata)
                }
                )
            .catch((err) => {
              if(err.response.status == "500") {
               return navigate('/error')
              }
            });
        }
    const DateOption = [
        {label: 'Nepali' , value: 'Nepali'},
        {label: 'English' , value: 'English'},
    ]
    const closeModalHandler = () => {
       
        dispatch(removeModalHandler())
    }
    const refreshHandler = (e) => {
        e.preventDefault()
        setDateFrom("")
        setDateTo("")
        // setCurrent(1)
    }

    const showSalesHandler = (id)  => {
        // dispatch({
        //   type: SET_SPINNER,
        // })
        setLoading(true)
        console.log('model')
         axios
            .get(`${API}/billing/${id}`)
            .then((res) =>
           { 
            console.log(res.data,'reee')
            setModalItems(res.data.orderList)
            setModalTotal(res.data.totalprice)
            setModalTableNo(res.data.table ? res.data.table : 'fastbilling')
            setModalBillNo(res.data.billNo)
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
              console.log(err,'-----------------------')
                setLoading(false)
              dispatch({
                type: REMOVE_SPINNER,
              })
              dispatch({
                type: GET_ERRORS,
                payload: err.response.data,
              })
             
            });
      };
        
    
  return (
    <>      {showModal ? 
        <Modal 
          show={showModal} 
          large
          handleClose={() => {
            closeModalHandler()
          }} 
        > 
           <BillingDetail    lists={modalItems} total={modalTotal} tableno ={modalTableNo}  engdate= {modalEnglishDate} billno={modalBillNo}/>
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
                        <div className='list_container_wrap'>
                            <div className="lc_top">
                                <form className="form" >
                                    <div className="lctop_wrap">
                                    <div className="lct_left">
                                        <div className="form-group ">
                                            {/* <div className="form-group-wrap">
                                                <label for="fiscalyear">Fiscal Year :</label>
                                                <select value={fiscalYear} onChange={(e) => setFiscalyear(e.target.value) }>
                                                <option value=''>please select</option>
                                                    {fiscalYearList.map(opt => (
                                                        <option value={opt._id}>{opt.date}</option>
                                                    ))}
                                                </select>
                                            </div> */}
                                            
                                            

                                        </div>
                                    </div>
                                    <div className="lct_middle">
                                        <div className="lctm_top">
                                            <div className="form-group ">
                                                <div className="form-group-wrap">
                                                    <label for="datefrom">Date From:</label>
                                                    <DatePicker id="datefrom" selected={dateFrom} 
                                                    onChange={(date) => {
                                                        setDateFrom(date)
                                                    }
                                                        } />
                                                </div>
                                            </div> 
                                            <div className="form-group ">
                                                <div className="form-group-wrap">
                                                    <label for="dateto">To:</label>
                                                    <DatePicker id="dateto" selected={dateTo} 
                                                        onChange={(date) => {
                                                            setDateTo(date)}} />
                                                </div>
                                            </div> 
                                            <button onClick={(e) => getData(e)}>Get data</button>
                                        </div>
                                        <div className="lctm_bottom">
                                                <p onClick={(e) => getTodaySales(e)}>Today</p>
                                                <p onClick={(e) => getThisWeek(e)}>This week</p>
                                                <p onClick={(e) => getThisMonth(e)}>This month</p>
                                                <p onClick={(e) => getLastMonth(e)}>last month</p>
                                                <p onClick={(e) => getLastSixMonth(e)}>last 6 month</p>
                                        </div>
                                        
                                    </div>
                                    <div className="lct_right">
                                        <div className="form-group ">
                                            {/* <div className="form-group-wrap">
                                                <label for="name">Name :</label>
                                                <input
                                                    type="text"
                                                    placeholder="name"
                                                    id="name"
                                                    name="name"
                                                    value={partyname}
                                                    onChange={(e) => setPartyname(e.target.value)}
                                                    />
                                            </div> */}
                                            <div className="form-group-wrap">
                                                <label for="billno">Bill no :</label>
                                                <input
                                                    type="text"
                                                    placeholder="bill no"
                                                    id="billno"
                                                    name="billno"
                                                    value={billno}
                                                    onChange={(e) => setBillno(e.target.value)}
                                                />
                                            </div>
                                            <button onClick={(e) => refreshHandler(e)}>Refresh</button>

                                        </div>
                                    </div>
                                    </div>
                                </form> 
                            </div>
                            <div className='lc_bottom'>
                            <table style={{width:'100%'}}>
                                <thead>
                                    <tr>
                                        <th>SN</th>
                                        <th>Fiscal Year</th>
                                        <th>Bill No</th>
                                        <th>Table No</th>
                                        <th>Date</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    
                                    {lists && lists.map((list,index) => (
                                        <tr key={index} 
                                        onClick={() => showSalesHandler(list._id)}
                                        >
                                            <td>{index + 1 }</td>
                                            <td>-</td>
                                            <td>{list.billNo}</td>
                                            <td>{list.table}</td>
                                            <td>{list.createdAt.slice(0, 10)}</td>
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
            </div>
    </div>
    </>

  )
}

export default ErrorHandler(BillingList,axios);
