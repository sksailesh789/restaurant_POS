import React, { Component, Fragment,useState,useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {API,imageAPI} from "../../config";
import { Link,useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit,faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../Dashboard/Sidebar";
import Modal from "../../components/Modal"
import ErrorHandler from "../ErrorHandler/ErrorHandler";
import ProductDetail from "./ProductDetail"
import Spinner from "../../components/Spinner"
import classnames from "classnames";


const AdminProductList = () => {
    const [productList , setProductList] = useState([])
    const [name , setName] = useState("")
    const [category , setCategory] = useState("")
    const [errors , setErrors] = useState("")
    const [deleteID , setDeleteID] = useState("")
    const [showModal , setShowModal] = useState(false)
    const [isDeleted , setIsdeleted] = useState(false)
    const [modalName , setModalName] = useState('')
    const [modalCategory , setModalCategory] = useState('')
    const [modalPrice , setModalPrice] = useState('')
    const [modalOptions , setModalOptions] = useState('')
    const [showModalDetail,setShowModalDetail] = useState(false)
    const [wantDelete, setWantDelete] = useState(false)
    const [loading,setLoading] = useState(false)
    const [slider,setSlider] = useState(true)

  const navigate = useNavigate();

  const sliderState = useSelector(state => state.slider)

  useEffect(() => {
    setSlider(sliderState.isSlider)
    
  }, [sliderState])

  useEffect(() => {
    setLoading(true)
        axios
        .get(`${API}/product`)
        .then((res) =>
            {console.log(res,'res')
            setProductList( res.data.data)
            setLoading(false)
            }
            )
        .catch((err) => {
          console.log(err,'iii')
          setLoading(false)
          if(err.response.status == "500") {
           return navigate('/error')
          }
        });
  }, [])
   

   const handleSearch = () => {
    setLoading(true)
    axios
    .get(`${API}/product?&name=${name}&category=${category}`)
    .then((res) =>
    {console.log(res,'res')
    setLoading(false)
        setProductList( res.data.data)
      }
    )
    .catch((err) => {
      setLoading(false)
      console.log(err.response.status,'iii')
      if(err.response.status == "500") {
       return navigate('/error')
      }
    });
  }

//   shouldComponentUpdate(prevProps, prevState, snapshot) {
//     if (this.state.bannerList !== prevState.bannerList) {
//     //   return this.props.BannerGet;
//       return true;
//     }
//   }

const onDelete = (id) => {
  setLoading(true)
    axios
    .post(`${API}/product/${id}`)
    .then((res) =>
      { 
        setWantDelete(false)
        setIsdeleted(true)
        axios
        .get(`${API}/product`)
        .then((res) => {
          setLoading(false)
          setProductList(res.data.data) 
        }
        
        )
        .catch((err) =>{ 
          setLoading(false)
          console.log(err,'eerr')})}
        )
    .catch(
      (err) => {
        setLoading(false)
        console.log(err, "err")}
      // dispatch({
      //   type: GET_ERRORS,
      //   payload: err.response.data,
      // })
    ); }

    const showProductHandler = (id)  => {
      
      setLoading(true)
       axios
          .get(`${API}/product/${id}`)
          .then((res) =>
         { 
          console.log(res.data,'reee')
          setModalName(res.data.name)
          setModalCategory(res.data.category)
          setModalPrice(res.data.price)
          setModalOptions(res.data.option)
          if(res.status && res.status == 200 || res.status == 201) {
            setShowModalDetail(true)
            setShowModal(true)
              setLoading(false)
            // dispatch({
            //   type: SET_MODAL,
            // })
    
          }else {
              setLoading(false)
              console.log('-----------------------')
              // dispatch({
              //   type: REMOVE_SPINNER,
              // })
            }
          }
          )
          .catch((err) => {
            console.log(err,'-----------------------')
              setLoading(false)
            // dispatch({
            //   type: REMOVE_SPINNER,
            // })
            // dispatch({
            //   type: GET_ERRORS,
            //   payload: err.response.data,
            // })
           
          });
    };

  
    let productlist = productList.map((product) => (
        <tr key= {product._id} 
        onClick={() => showProductHandler(product._id)}
        >
            <td>
              <img
                  className="img-fluid"
                  src={`${imageAPI}/${product.image[0]}`}
                  style={{ width: "40px" }}
                />
            </td>
            <td             
            >
              <h6>{product.name}</h6>
            </td>
            <td>
              <h6>{product.category.name}</h6>
            </td>
            <td>
              <Link to={`/product/edit/${product._id}`}>
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
                onClick={(e) => {
                  e.stopPropagation()
                      setDeleteID (product._id)
                      setWantDelete(true)
                      setShowModalDetail(false)
                      setShowModal(true)
                  }
                }
                // this.onDelete(product._id)
              
              />
            </td>
          </tr>
    ));
    return (
      <Fragment>
      {showModal ? 
        <Modal 
          show={showModal} 
          handleClose={ () => {
            setShowModal(false)
            setWantDelete(false)
            setShowModalDetail(false)
          }
          } 
          medium ={showModalDetail}

        > 
        {showModalDetail && 
           (
            <>
           <ProductDetail    productname={modalName} price={modalPrice} category ={modalCategory}  options= {modalOptions} />
            <button className="btn-edit"  onClick = {() => { 
            setShowModal(false)
            }}> Close</button>
            </>
           )
          
        }
        {wantDelete && 
            ( 
              <Fragment>
                  <h5>Do you want to delete ?</h5> 
                  <FontAwesomeIcon icon={faTrash} style={{fontSize: '30px',display: 'block' ,color: 'red',textAlign: 'center',margin:' auto auto 22px'}}/> 
                  <div className="btn_wrap  " style={{display:"flex",justifyContent:'space-around'}}>
                    <button className="btn-delete" onClick = { () => onDelete(deleteID)}> Delete</button>
                    <button className="btn-edit" onClick = {() => {
                      setShowModal(false)
                      setWantDelete(false)
                    }}> Cancel</button>
                  </div>
              </Fragment>
        )}
        {isDeleted && 
         (
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
            <div 
             className={classnames( slider ? 'w-82' : 'w-100')}>
            <div className='dashboard_right'>
              <h3 className=" dashboard-header">
                     All Products
                  </h3>
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
                  {/* <div className="asc_wrap">
                      <label for="category">Search by Category : </label>
                      <input
                        type="text"
                        // placeholder="name"
                        id="category"
                        name="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      />
                  </div> */}
                </div>
                  
                  <button className="btn-search" onClick={handleSearch}>Search</button>
              </div>
              <div className="table_wrap">
                <table className= "table" >
                  <thead className= "table-head">
                    <tr className= "table-head-each">
                      <th >Image</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Edit</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody >
                    {productlist}
                  </tbody>
                </table>
                </div>
            </div>
          </div>
       </div>
       </div>
       </div>
       </Fragment>
    );
  }


export default ErrorHandler(AdminProductList,axios)


// export default connect(null, {  })(AdminProductList);
