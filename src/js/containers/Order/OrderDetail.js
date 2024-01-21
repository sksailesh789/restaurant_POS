import React from 'react'
const numWords = require('num-words')


const orderDetail = ({tableno,lists,total,engdate}) => {
  return (
    <>
    <h5>Order Detail</h5>
    <form className="form" >                
            <div className="sc_top">
                <div className="sct_left">
                    <div className="form-group ">
                        <div className="form-group-wrap">
                            <label for="fiscalyear">Fiscal Year :</label>
                            <input
                                type="text"
                                id="fiscalyear"
                                name="fiscalyear"
                                // value={fiscalyear.date}
                                disabled
                                />
                        </div>
                    </div>
                        
                </div>
                <div className="sct_right">
                    <div className="form-group ">
                        <div className="form-group-wrap">
                            <label for="engdate">English Date :</label>
                            <input type ="text" value={engdate.slice(0,10)} disabled/>
                        </div>
                    </div> 
                </div>
                    
        </div>
        <div className="sc_mid">
            <div className="scm_left">
                <div className="form-group ">
                    <div className="form-group-wrap">
                        <label for="tableno">Table no :</label>
                        <input
                            type="text"
                            placeholder="table no"
                            id="tableno"
                             name="tableno"
                            value={ tableno ? tableno.name : ' '}
                            disabled
                            />
                    </div>
                </div>
                {/* <div className="form-group ">
                    <div className="form-group-wrap">
                        <label for="address">Address :</label>
                        <input
                            type="text"
                            placeholder="address"
                            id="address"
                            name="address"
                            value={address}
                            disabled
                            />
                    </div>
                </div> */}

            </div>
            <div className="scm_right">
                {/* <div className="form-group ">
                        <div className="form-group-wrap">
                            <label for="paymentmode">Payment Mode :</label>
                            <input 
                                type="text"
                                value={paymentMethod}
                                disabled
                            />
                            
                        </div>
                </div> */}
                {/* <div className="form-group ">
                    <div className="form-group-wrap">
                        <label for="partypan">Party PAN :</label>
                        <input
                            type="text"
                            id="partypan"
                            name="partypan"
                            value={partypan}
                            disabled
                            />
                    </div>
                </div> */}
                

            </div>
        </div>
        <div className="sc_bottom">
            <div className="scb_table">
                <div className = 'table_wrap' >
            <table style={{width:'100%'}}>
                <thead>
                    <tr>
                        <th>SN</th>
                        <th>Name</th>
                        <th>quantity</th>
                        <th>price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {lists.map((list,index) => (
                        <tr key={index}>
                            <td>{index + 1 }</td>
                            <td>{list.name}</td>
                            <td>{list.qty}</td>
                            <td>{list.price}</td>
                            <td>{list.qty * list.price}</td>

                        </tr>
                    ))} 
                </tbody>
            </table>
           
            </div>
            </div>               
        </div>
        <div className="sc_footer">
            <div className="scf_left">
                    In Words: {numWords(total)} rupees only
            </div>
            <div className="scf_right">
                {/* <div className="form-group ">
                    <div className="form-group-wrap">
                        <label for="subtotal">SubTotal :</label>
                        <input
                            type="text"
                            id="subtotal"
                            name="subTotal"
                            value={subTotal}
                            disabled
                        />
                    </div>
                </div> */}
               
                <div className="form-group ">
                    <div className="form-group-wrap">
                        <label for="total">Total :</label>
                        <input
                            type="text"
                            id="total"
                            name="total"
                            value={total}
                            disabled
                        />
                        
                    </div>
                </div>
            </div>
        </div>
            </form>
            </>
  )
}

export default orderDetail