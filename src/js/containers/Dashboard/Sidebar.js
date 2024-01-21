import React,{useState,useEffect} from 'react'
import MultiMenus from './multiMenus';
import { useNavigate,Link } from "react-router-dom";
import classnames from "classnames";
import { useDispatch,useSelector } from "react-redux"


const Sidebar = (props) => {
    const navigate = useNavigate();
    const [slider,setSlider] = useState(true)

  const dispatch = useDispatch();
  const sliderState = useSelector(state => state.slider)

  useEffect(() => {
    setSlider(sliderState.isSlider)
    
  }, [sliderState])


    let lists = [
        
        {
            label: 'Product',
            value: 'Product',
            submenu: [
                {
                    label: 'Add Product',
                    path: '/addProduct'
                },
                {
                    label: 'Product List',
                    path: '/adminProductList'
                }
            ]
        },
        {
            label: 'Category',
            value: 'Category',
            submenu: [
                {
                    label: 'Add Category',
                    path: '/addCategory',
                    value:'Add Category'
                },
            ]
        },
        {
            label: 'Table',
            value: 'Table',
            submenu: [
                {
                    label: 'Add Table',
                    path: '/addTable',
                    value:'Add Table'
                },
                {
                    label: 'Table List',
                    path: '/admin/table',
                    value:'Table List'
                },
            ]
        },
        {
            label: 'Order',
            value:'Order',
            submenu: [
                {
                    label: 'Order List',
                    path: '/OrderList',
                    value:'Order List'
                    
                },
            ]
        },
        {
            label: 'Billing',
            value:'Billing',
            submenu: [
                {
                    label: 'Billing List',
                    path: '/billingLists',
                    value:'Billing List'
                    
                },
            ]
        },
        {
            label: 'User',
            value: 'User',
            submenu: [
                {
                    label: 'User List',
                    path: '/UserList',
                    value:'User List'
                },
                {
                    label: 'Register',
                    path: '/Register',
                    value:'Register User'
                },
            ]
        }
    ]

  return (
    <div 
    className={classnames({ "d-none": !slider },"w-17")}
     >
    <div className='dashboard_left'>
            <div className='dashboard_left_wrap'>
                <div className='closed_sidebar'>
                    <i className="fas fa-times"></i>
                </div>
                <div className='dl_left_header'>

                </div>
                <div className='dl_List'>
                    
                    <div className='li_wrap'>
                        <Link to="/"> Dashboard </Link>
                    </div>
                        
                <MultiMenus menus={lists} props={props}/>
                </div>
            </div>
        </div>
        </div>
  )
}

export default Sidebar