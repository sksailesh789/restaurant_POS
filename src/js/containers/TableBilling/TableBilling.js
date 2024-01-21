import React ,{useEffect,useState} from 'react'
import axios from 'axios';
import {API,imageAPI} from "../../config";
import ErrorHandler from '../ErrorHandler/ErrorHandler'
const numWords = require('num-words')
import Spinner from "../../components/Spinner"




const Tablebilling = () => {

    const [tableList,setTableList] = useState([])
    const [tableSelect , setTableSelect] = useState([])
    const [tableDetail , setTableDetail] = useState([])
    const [tableName , setTableName] = useState('')
    const [tableId , setTableId] = useState('')
    const [quantity , setQuantity] = useState('')
    const [item , setItem] = useState('')
    const [billno , setBillno] = useState('')
    const [amount , setAmount] = useState(0)
    const [discountType , setDiscountType] = useState('Rs')
    const [discountValue , setDiscountValue] = useState('')
    const [grandTotal , setGrandTotal] = useState('')
    const [cash,setCash] =useState(0)
    const [change, setChange] =useState('')
    const [loading,setLoading] = useState(false)

    const discountOption = [
        {label: 'Rs' , value: 'Rs'},
        {label: '%' , value: '%'},
    ]


    useEffect(() => {
        setLoading(true)
        totalAmountHandler()
      axios.get(`${API}/table/bookedTable`).then(res => 
        {
            setLoading(false)
            setTableList(res.data)
        }
        ).catch(err => {
            setLoading(false)
            console.log(err)})

        // setLoading(true)
        // axios
        // .get(`${API}/billno`)
        // .then((res) =>
        //     {
        //     setLoading(false)
        //     setBillno(res.data.seq + 1)
        //     }
        //     )
        // .catch((err) => {
        //     setLoading(false)
        //   console.log(err,'iii')
        //   if(err.response.status == "500") {
        //    return navigate('/error')
        //   }
        // });

    }, [])

    useEffect(() => {
        totalAmountHandler()
    } ,[discountType,discountValue])

    const handleCheck = (event) => {
        let updatedList = [...tableSelect];
        if(event.target.checked) {
            updatedList = [event.target.value]
        }else {
            updatedList = []
        }
            setTableSelect(updatedList)
    }
    const getQuantityItemHandler = (data) => {
        const item = data.length;
        const qty = data.reduce(
            (previousValue, currentValue) => { 
                console.log(previousValue,currentValue.qty ,'pc')
                return previousValue + currentValue.qty
            },
            0
          );
          const amount = data.reduce(
            (previousValue, currentValue) => { 
                return previousValue + currentValue.qty * currentValue.price
            },
            0
          );
          setQuantity(qty)
          setItem(item)
          setAmount(amount)
          setGrandTotal(amount) 
    }
    
    const getTableDataHandler = () => {
            setLoading(true)
            if(tableSelect.length < 1) {
                setLoading(false)
                return
            }
            axios.get(`${API}/table/${tableSelect[0]}`)
            .then(res => 
            {   
                setTableId(res.data._id)
                setTableName(res.data.name)
                setTableDetail(res.data.order)
                getQuantityItemHandler(res.data.order)
                setCash(0)
                setChange('')
                setDiscountValue('')
                setDiscountType('Rs')
                setLoading(false)
            }
            ).catch(err => {
                setLoading(false) 
            })
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
        if(option === 'type') {
            setDiscountType(value)
            totalAmountHandler()
           
        }else if(option === 'value') {
            setDiscountValue(value)
            totalAmountHandler()

        }
    }

    const billingTableHandler = () => {
        if(tableDetail.length < 1) {
            return
        }
        setLoading(true)
        let priceinword = numWords(grandTotal)
        let date = new Date();
        let year = date.toString().slice(13,15)
        let billid = `Icoder${year}-`
        let billingdata = {
            table: tableName,
            orderList:tableDetail,
            totalprice: grandTotal,
            priceinword,
            billid
        }
        axios.post(`${API}/billing` , billingdata)
        .then(res => 
        {
            console.log(res,'yyy')
            billingdata.date = res.data.new_bill_save.createdAt
            billingdata.billid = res.data.new_bill_save.billNo
            electron.printApi.sendPrint(billingdata)
           axios.post(`${API}/table/checkout` , {
            _id:tableId
           }).then(res => {
                setLoading(false)
           }).catch(err => {
                console.log(err)
                setLoading(false)
        })

        }
        ).catch(err => {
            setLoading(false)
            console.log(err)})
    }

    const changeHandler = (value) => {
        setChange(cash - grandTotal)
    }
    const cashHandler = (value) => {
        setCash(value)
        setChange(value - grandTotal)
    }

  return (
    <>
          {loading ? <Spinner /> : ''}
    <div className='t_billing'>
        <div className="t_billing_wrap">
            <div className="tb_header">
                {/* <p>Bill no. 13</p> */}
                <p>Payment Mode : Cash</p>
                <div className="tbh_right">
                    <p>Quantity: {quantity}</p>
                    <p>Item : {item} </p>
                </div>
            </div>
            <div className="tb_body">
                <div className="tb_body_left">
                    <div className="tbb_leftwrap">
                        <div className="tbl_button">
                            {/* <button className='bg-chocolate'>New Bill <br /> -F1 </button> */}
                            <button className='bg-dark billingtable' onClick={billingTableHandler}> Save + Print <br /> Ctrl+P </button>
                            {/* <button className='bg-green'> Delete <br /> -F3 </button> */}
                            <button className='bg-red tabledata' onClick={getTableDataHandler}> Get Data<br/>Ctrl+G </button>
                            {/* <button className='bg-black'> Print <br/>-F5</button> */}
                        </div>
                        <div className="tbl_list">
                            <h5>List Of Booked Table</h5>
                            <div className="tbl_listwrap">
                                <div className="tbl_head">
                                    Table No:
                                </div>
                                <div className="tbl_bodylist">
                                    {tableList.map(list => 
                                    (
                                            <div className="tbl_bodylist_item" key={list._id}>
                                                <input type="checkbox" id={list.name} name={list.name} value={list._id} checked={tableSelect.includes(list._id) } onChange={handleCheck} />
                                                <label for={list.name}> {list.name}</label>
                                            </div>
                                    )
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="tb_body_right">
                    <div className="tbr_wrap">
                    <div className="tbr_grandTotal tbr_wrapList">
                            <h5 className=''for="amount">Amount :</h5>
                            <input type="number" id="amount" name="amount" value={ amount} disabled/>
                        </div>
                        <div className="tbr_discount tbr_wrapList">
                            <h5 className=''>Discount :</h5>
                            <select value={discountType} onChange={(e) => discountHandler('type',e.target.value) }>
                                {discountOption.map(opt => (
                                    <option value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            <input type="number" id="discountValue" name="discountValue" value={discountValue} onChange={(e) => discountHandler('value',e.target.value)}/>
                        </div>
                        <div className="tbr_grandTotal tbr_wrapList">
                            <h5 className='' for="gtotal">Grand Total :</h5>
                            <input type="number" id="gtotal" name="grandTotal" value={grandTotal} onChange={(e) => setGrandTotal(e.target.value)} />
                        </div>
                        <div className="tbr_Cash tbr_wrapList">
                            <h5 className=''>Cash/Card :</h5>
                            <input type="number" id="quantity" name="quantity" value={cash} onChange={(e) => cashHandler(e.target.value) }/>
                        </div>
                        <div className="tbr_change tbr_wrapList">
                            <h5 className=''>Change :</h5>
                            <input type="number" id="quantity" name="quantity" value={change} onChange={(e) => changeHandler(e.target.value)}/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="tb_footer">
                <table>
                    <thead>
                        <tr>
                            <td>Table no</td>
                            <td>Item Name</td>
                            <td>Rate</td>
                            <td>Qty</td>
                            <td>Amount</td>
                            {/* <td>Discount % </td>
                            <td>Discount</td>
                            <td>Sc %</td>
                            <td>Sc Amount</td> */}
                            <td>Total</td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            tableDetail.map(item => (
                                <tr key={item._id}>
                                    <td>{tableName}</td>
                                    <td>{item.name}</td>
                                    <td>{item.price}</td>
                                    <td>{item.qty}</td>
                                    <td>{item.price * item.qty}</td>
                                    {/* <td>{item.product}</td>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td> */}
                                    <td>{item.price * item.qty}</td>
                                </tr>
                            ))
                        }
                            
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    </>
  )
}

export default ErrorHandler(Tablebilling ,axios) 