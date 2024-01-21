import React , {useState,useEffect} from 'react'
import axios from "axios"
import classnames from "classnames";
import {API} from "../../config"
import Slider from "react-slick";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit,faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Modal from "../../components/Modal"
import ErrorHandler from "../ErrorHandler/ErrorHandler";
import Spinner from "../../components/Spinner"



const TableBooking = () => {
    const [tableList , setTableList] = useState([])
    const [table , setTable] = useState('')
    const [tableName , setTableName] = useState('')
    const [showtable , setShowtable] = useState(true)
    const [category, setCategory] = useState([])
    const [subCategory, setSubCategory] = useState([])
    const [product, setProduct] = useState([])
    const [selectedProduct, setSelectedProduct] = useState([])
    const [totalPrice, setTotalPrice] = useState()
    const [showModal , setShowModal] = useState(false)
    const [loading,setLoading] = useState(false)




    useEffect(() => {
      setLoading(true)
      axios.get(`${API}/table/tablelist`).then((res) => {
          setLoading(false)
          setTableList(res.data)
      }
        ).catch(err => {
          setLoading(false)
        })
    }, [])

    useEffect(() => {
      setLoading(true)
      axios
      .get(`${API}/category`)
      .then((data) => {
          setLoading(false)
          setCategory(data.data)
          console.log(data.data,'ddcategory')
         })
     .catch((err) => {
        setLoading(false)
          console.log(err,'rrr')
           
       });
  } ,[])

  useEffect(() => {
    console.log('first',selectedProduct)
  
  
  }, [selectedProduct])

  var settings = {
    dots: false,
    infinite: true,
    vertical:true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 3,
    responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            dots: true
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            initialSlide: 2
          }
        },
        {
          breakpoint: 330,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
  };

  const findcatproHandler = (categ) => {
    console.log(categ,'categ')
    if(!categ.parentId) {
        setProduct([])
        setSubCategory([])
    }
    if(categ.children && categ.children.length > 0) {
        setSubCategory(categ.children)
        console.log('subcatxa')
    }else {
        if(!categ.parentId) {
            setSubCategory([])
        }
      setLoading(true)
        axios
        .get(`${API}/product/category/${categ._id}`)
        .then((data) => {
            setProduct(data.data)
          setLoading(false)
            console.log(data.data,'ddproduct')
           })
       .catch((err) => {
        setLoading(false)
            console.log(err,'rrr')
             
         });
        console.log('subcatxaina')
    }

}

const selectProductHandler = (pro) => {
    const sp = selectedProduct.find((sp) => {
        return sp._id == pro._id
    })
    if(sp === undefined) {
      setSelectedProduct([...selectedProduct,{
        _id: pro._id,
        name:pro.name,
        price: pro.price,
        qty: 1
      }])
    }
  
    
   
}

const changeQuantityHandler = (id , sign) => {
  if(sign === 'plus') {
    setSelectedProduct( selectedProduct.map(x => (x._id === id ? { ...x, qty: x.qty+ 1 } : x)))
  }else if(sign === 'minus'){
    setSelectedProduct( selectedProduct.map(x => {
      if(x.qty == '1'){
         return x
      }else {
      return (x._id === id ? { ...x, qty: x.qty - 1 } : x)
      }
      
    }))
  }
 console.log('first',selectedProduct)
}

const deleteSelectedProduct = (id) => {
  setSelectedProduct(selectedProduct.filter(each => each._id !== id)) 
}


    const selectTableHandler = (id,name) => {
        setTable(id)
        setShowtable(false)
        setTableName(name)
        console.log(id,'table')
    }

    const orderSaveHandler = () => {
        setLoading(true)
        const amount = selectedProduct.reduce(
          (previousValue, currentValue) => { 
              return previousValue + currentValue.qty * currentValue.price
          },
          0
        );
        if(selectedProduct.length < 1) {
          console.log('no product')
          setLoading(false)
          return
        }
        console.log(amount,'aaaa')
        let orderItem = []
        selectedProduct.map(p => {
            orderItem.push({
                name: p.name,
                qty: p.qty,
                price: p.price,
                product: p._id
            })
      })
        axios.post(`${API}/order`, {
          orderItems:orderItem,
          table: table,
          totalprice: amount
        }).then(() => {
          axios.post(`${API}/table`, {
            _id: table,
            color: "red",
            ordersList:orderItem,
        }).then(data => {
                setShowModal(true)
                axios.get(`${API}/table/tablelist`).then((res) => 
                {
                  setLoading(false)
                  setTableList(res.data)
                }).catch(err => {
                  setLoading(false)
                  console.log(err,'err')})
            setSelectedProduct([])
            console.log(data,'letsee')
        }).catch(err => {
          setLoading(false)
            console.log(err,'err')
        })
        }).catch(err => {
          setLoading(false)
          console.log(err)})

    }

    const options = {
      silent: false,
      // printBackground: true,
      color: false,
      margin: {
          marginType: 'printableArea'
      },
      landscape: false,
      pagesPerSheet: 1,
      collate: false,
      copies: 1,
      header: 'Header of the Page',
      footer: 'Footer of the Page'
  }

    const printHandler = () => {
      console.log(electron,'e')
      // ipcRenderer.send('print' , options)
      electron.printApi.sendPrint(options)
      // electron.printApi.send(options)

  }

  const deleteHandler = () => {
    setSelectedProduct([])
  }

  const closeModalHandler = () => {
    setShowModal(false)
}
  

    const productSelect = () => {
      return (
        <div className='fastbilling_wrap'>

        <div className='fb_category_wrap'>
        <Slider {...settings} >
              
                   {category.map(categ => 
                    (
                        <li key={categ._id} onClick={() =>findcatproHandler(categ)}>{categ.name}</li>
                    )
                 )}
               
               
           </Slider>
            {/* <ul>
                {category.map(categ => 
                    (
                        <li key={categ._id} onClick={() =>findcatproHandler(categ)}>{categ.name}</li>
                    )
                 )}

            </ul> */}
        </div>
        <div className='fb_subcategory'>

        {subCategory.length > 0 ? 
        <div className='fb_subcategory_wrap'>
            <ul>
                {subCategory.map(categ => 
                    (
                        <li key={categ._id} onClick={() =>findcatproHandler(categ)}>{categ.name}</li>
                    )
                 )}

            </ul>
        </div>
        : null}
        <div className='fb_subcategory_wrap'>
            <ul>
                {product.map(pro => 
                    (
                        <li key={pro._id} className="bg-red" onClick={() => selectProductHandler(pro)}>{pro.name}</li>
                    )
                 )}

            </ul>
        </div>
        </div>

        <div className='selected_product'>
          <h5>Table : {tableName}</h5>
          <div className="selected_product_wrap">
            <div className='sp_left'>
                {/* <button className='bg-chocolate' onClick={printHandler}>save and print</button> */}
                <button className='bg-dark' onClick={deleteHandler}>Delete</button>
                {/* <button className='bg-green' onClick={printHandler}>save and print</button> */}
                <button className='bg-red tableorder' onClick={orderSaveHandler}>save & order Ctrl+O</button>
                <button className='bg-red' onClick={() => setShowtable(true)}>Table select</button>

            </div>
            <div className='sp_right' id="printpage">
                  <table>
                    <thead>
                        <tr>
                            <td>Item Name</td>
                            <td>Rate</td>
                            <td>Qty</td>
                            <td>Amount</td>
                            <td></td>

                        </tr>
                    </thead>
                    <tbody>
                        {selectedProduct.length > 0 && selectedProduct.map(pro => {
                            return (<tr>
                                        <td>{pro.name}</td>
                                        <td>{pro.price}</td>
                                        
                                        <td style={{display:'flex'}}> 
                                          <div 
                                            style={{background: 'rgb(83 49 35)',color: '#fff',fontSize: '15px',padding: '0 5px',marginRight: '5px',borderRadius:'2px'}}
                                            onClick={() => changeQuantityHandler(pro._id , 'plus')}>+</div>
                                              {pro.qty}
                                          <div
                                            style={{background: 'rgb(83 49 35)',color: '#fff',fontSize: '15px',padding: '0 5px',marginLeft: '5px',borderRadius:'2px'}}
                                            onClick={() => changeQuantityHandler(pro._id , 'minus')} >-</div>
                                        </td>
                                        <td>{pro.price * pro.qty}</td>
                                        <td > 
                                            <FontAwesomeIcon icon={faTrash} style={{ color: "#54545c",fontSize:'14px' }}
                                                onClick={ () => deleteSelectedProduct(pro._id) }/>
                                        </td>
                                     </tr>
                                    )
                        })}
                    </tbody>
                    </table>      
            </div>
                   
        </div>
        </div>   
    </div>
      )
    }

  return (
    <>
    {showModal ? 
            <Modal 
              show={showModal} 
              handleClose={() => {
                closeModalHandler()
              }} 
            > 
               <h5>Ordered successfully</h5> 
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
    <div className='tablebooking'>
      {showtable ? (
          <div className="tb_wrap">
            <h5>Table Lists</h5>
          <div className="table-lists">
              <ul>
                  {
                    tableList.map((table) => (
                      <li key={table._id}>
                          <div 
                          onClick={() => selectTableHandler(table._id,table.name)}
                          className= {classnames('table_list', {
                            'bg-red' : table.color === 'red',
                            'bg-green' : table.color === 'green',
                          })}>
                              <h6>{table.name}</h6>
                          </div>
                      </li>
                    ))  
                  }
                  
              </ul>
          </div>
      </div>
      ) : (
        productSelect()
      ) }
        
    </div>
    </>
  )
}

export default ErrorHandler(TableBooking,axios)