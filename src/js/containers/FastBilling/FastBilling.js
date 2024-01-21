import React , {useState,useEffect} from 'react'
import axios from "axios"
import {API} from "../../config.js"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit,faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ErrorHandler from '../ErrorHandler/ErrorHandler';
const numWords = require('num-words')
import Spinner from "../../components/Spinner"
import { useNavigate} from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';


const FastBilling = () => {
    const [category, setCategory] = useState([])
    const [subCategory, setSubCategory] = useState([])
    const [product, setProduct] = useState([])
    const [selectedProduct, setSelectedProduct] = useState([])
    const [amount , setAmount] = useState(0)
    const [discountType , setDiscountType] = useState('Rs')
    const [discountValue , setDiscountValue] = useState('')
    const [grandTotal , setGrandTotal] = useState('')
    const [cash,setCash] =useState(0)
    const [change, setChange] =useState('')
    const [loading,setLoading] = useState(false)

  const isAuth = useSelector(state => state.auth)
  const navigate = useNavigate();
     
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

    useEffect(() => {
        totalAmountHandler()
    } ,[discountType,discountValue])


    const discountOption = [
        {label: 'Rs' , value: 'Rs'},
        {label: '%' , value: '%'},
    ]

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
                    setLoading(false)
                    setProduct(data.data)
                    console.log(data.data,'ddproduct')
                   })
               .catch((err) => {
                    setLoading(false)
                    console.log(err,'rrr')
                     
                 });
                console.log('subcatxaina')
            }

    }
    const deleteHandler = () => {
        setSelectedProduct([])
      }

    const selectProductHandler = (pro) => {
        const sp = selectedProduct.find((sp) => {
            return sp.product == pro._id
        })
        if(sp === undefined) {
          setSelectedProduct([...selectedProduct,{
            product: pro._id,
            name:pro.name,
            price: pro.price,
            qty: 1,
            isPacking : true
          }])
        }
    }
    const deleteSelectedProduct = (id) => {
        console.log(id,'idd')
       setSelectedProduct(selectedProduct.filter(each => each.product !== id)) 
    }

    const totalAmountHandler = () => {
        const newAmount = amount;
        if(discountType === 'Rs') {
            setGrandTotal( newAmount - discountValue)
        }else if(discountType === '%') {
            const dvalue = (discountValue / 100 ) * amount
            setGrandTotal( newAmount - dvalue)
        }
    }

    const discountHandler = (option , value) => {
        console.log('11')
        if(option === 'type') {
            setDiscountType(value)
            totalAmountHandler()
           
        }else if(option === 'value') {
            setDiscountValue(value)
            totalAmountHandler()

        }
    }

    const changeHandler = (value) => {
        setChange(cash - grandTotal)
    }
    const cashHandler = (value) => {
        setCash(value)
        setChange(value - grandTotal)
    }


    const changeQuantityHandler = (id , sign) => {
        if(sign === 'plus') {
          setSelectedProduct( selectedProduct.map(x => (x.product === id ? { ...x, qty: x.qty+ 1 } : x)))
        }else if(sign === 'minus'){
          setSelectedProduct( selectedProduct.map(x => {
            if(x.qty == '1'){
               return x
            }else {
            return (x.product === id ? { ...x, qty: x.qty - 1 } : x)
            }
            
          }))
        }
       console.log('first',selectedProduct)
      }

      const getAmountHandler = () => {
        console.log('next')
        const amount = selectedProduct.reduce(
            (previousValue, currentValue) => { 
                return previousValue + currentValue.qty * currentValue.price
            },
            0
          );
          setAmount(amount)
          setDiscountValue('')
            setGrandTotal('')
            setCash('')
            setChange('')
      }
    

    const printHandler = () => {
        if(selectedProduct.length < 1 || amount == 0) {
            console.log('no',amount)
            return 
        }
        let priceinword = numWords(amount)
        let date = new Date();
        let year = date.toString().slice(13,15)
        let billid = `Icoder${year}-`
        let billingdata = {
            // table: tableName,
            orderList:selectedProduct,
            totalprice: amount,
            priceinword,
            billid,
            fastBilling:true
        }
        setLoading(true)
        axios.post(`${API}/order`, {
            orderItems:selectedProduct,
            // table: table,
            totalprice: amount
          }).then((data) => {
            axios.post(`${API}/billing` , billingdata)
            .then(res => 
            {   
                setLoading(false)
                console.log(res,'yyy')
                billingdata.date = res.data.new_bill_save.createdAt
                billingdata.billid = res.data.new_bill_save.billNo
                electron.printApi.sendPrint(billingdata)
                refreshHandler()
            }).catch(err => {
                setLoading(false)
                console.log(err,'ee')
            })
               
          }).catch(err => {
            setLoading(false)
            console.log(err,'i99')
          })
        // electron.workerPrint.printWork("<h1> hello </h1>")

    }
    const refreshHandler = () => {
        setSelectedProduct([])
        setAmount(0)
        setDiscountType('Rs')
        setDiscountValue('')
        setGrandTotal('')
        setCash('')
        setChange('')
    }
   
  return (
    <>
    {loading ? <Spinner /> : ''}

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

        <div className='selected_product fb_sp'>
            <div className="sp_wrap">

            
            <div className='sp_left'>
                <button className='bg-chocolate' onClick={refreshHandler}>Refresh</button>
                <button className='bg-dark' onClick={deleteHandler}>Delete</button>
                <button className='bg-green fastbillingprint' onClick={printHandler}>save&print<br/>Ctrl+F</button>
                <button className='bg-red' onClick={getAmountHandler}>Get Data</button>

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
                                            onClick={() => changeQuantityHandler(pro.product , 'plus')}>+</div>
                                              {pro.qty}
                                          <div
                                            style={{background: 'rgb(83 49 35)',color: '#fff',fontSize: '15px',padding: '0 5px',marginLeft: '5px',borderRadius:'2px'}}
                                            onClick={() => changeQuantityHandler(pro.product , 'minus')} >-</div>
                                        </td>
                                        <td>{pro.price * pro.qty}</td>
                                        <td > 
                                            <FontAwesomeIcon icon={faTrash} style={{ color: "#54545c",fontSize:'14px' }}
                                                onClick={ () => deleteSelectedProduct(pro.product) }/>
                                        </td>
                                     </tr>
                                    )
                        })}
                    </tbody>
                    </table> 
                        
            </div>
                  </div> 
                  <div className="Fast_billing_table">
                    <div className="tbr_wrap">
                    <div className="tbr_grandTotal tbr_wrapList">
                            <h5 className=''for="amount">Amount :</h5>
                            <input type="number" id="amount" name="amount" value={ amount} disabled/>
                        </div>
                        <div className="tbr_discount tbr_wrapList">
                            <h5 className=''>Discount :</h5>
                            <select value={discountType} onChange={(e) => discountHandler('type',e.target.value) } >
                                {discountOption.map(opt => (
                                    <option value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            <input type="number" id="discountValue" name="discountValue"  value={discountValue} onChange={(e) => discountHandler('value',e.target.value)}/>
                        </div>
                        <div className="tbr_grandTotal tbr_wrapList">
                            <h5 className='' for="gtotal">Grand Total :</h5>
                            <input type="number" id="gtotal" name="grandTotal" value={grandTotal} onChange={(e) => setGrandTotal(e.target.value)}/>
                        </div>
                        <div className="tbr_Cash tbr_wrapList">
                            <h5 className=''>Cash/Card :</h5>
                            <input type="number" id="quantity" name="quantity" value={cash} onChange={(e) => cashHandler(e.target.value) } />
                        </div>
                        <div className="tbr_change tbr_wrapList">
                            <h5 className=''>Change :</h5>
                            <input type="number" id="quantity" name="quantity" value={change} onChange={(e) => changeHandler(e.target.value)}/>
                        </div>
                    </div>
                </div> 
        </div>
            
    </div>
    </>
  )
}

export default ErrorHandler(FastBilling,axios) 