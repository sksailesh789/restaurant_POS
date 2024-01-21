import React from 'react'


const ProductDetail = ({productname,category,price,options}) => {
  return (
    <>
    <h5>Product Detail</h5>
    <form className="form" >                
            
        <div className="sc_mid">
            <div className="scm_left">
                <div className="form-group ">
                    <div className="form-group-wrap">
                        <label for="name">Name:</label>
                        <input
                            type="text"
                            placeholder="Name"
                            id="name"
                            name="name"
                            value={productname}
                            disabled
                            />
                    </div>
                </div>
                <div className="form-group ">
                    <div className="form-group-wrap">
                        <label for="category">Category :</label>
                        <input
                            type="text"
                            placeholder="category"
                            id="category"
                            name="category"
                            value={category.name}
                            disabled
                            />
                    </div>
                </div>

            </div>
            <div className="scm_right">
                <div className="form-group ">
                        <div className="form-group-wrap">
                            <label for="price">Price :</label>
                            <input 
                                type="text"
                                id="price"
                                name="price"
                                value={price}
                                disabled
                            />
                            
                        </div>
                </div>
                <div className="form-group ">
                    <div className="form-group-wrap">
                        <label for="options">Options :</label>
                        <input
                            type="text"
                            id="options"
                            name="options"
                            value={options}
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

export default ProductDetail