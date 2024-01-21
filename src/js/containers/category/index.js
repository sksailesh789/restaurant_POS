import React from 'react';
import { useEffect,useState } from 'react';
import AdminNavbar from "../Dashboard/Sidebar";
import {Modal,Button} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import  { 
  getAllCategory,
  addCategory,
  updateCategories,
  deleteCategories as deleteCategoriesAction

} from '../../actions/categoryAction'
import { 
        IoIosCheckboxOutline,
        IoIosCheckbox ,
        IoIosArrowForward,
        IoIosArrowDown 
        } from "react-icons/io";
import CheckboxTree from "react-checkbox-tree";

import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import classnames from "classnames";



const Category = (props) => {

  const [show, setShow] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [parentCategoryId, setParentCategoryId] = useState("");
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([])
  const [checkedArray, setCheckedArray] = useState([]);
  const [expandedArray, setExpandedArray] = useState([]);
  const [updateCategoryModal, setUpdateCategoryModal] = useState(false);
  const [deleteCategoryModal, setDeleteCategoryModal] = useState(false);
  const [image,setImage] = useState("")
  const [slider,setSlider] = useState(true)

  const dispatch = useDispatch();
  const category = useSelector(state => state.categoryData)
  const sliderState = useSelector(state => state.slider)

  useEffect(() => {
    setSlider(sliderState.isSlider)
    
  }, [sliderState])

    useEffect(() => {
        dispatch(getAllCategory())
        console.log(category, 'cato');
    },[])

    const renderCategories = (categories) => {
        let mycategory = [];
        for(let category of categories) {
            mycategory.push(
              {
                  label : category.name,
                  value: category._id,
                  children : category.children && category.children.length > 0 && renderCategories(category.children)
              }
            );


        }
        return mycategory;
    }
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSubmit = () => {
      const form = new FormData();
      form.append("name" , categoryName);
      form.append("parentId" , parentCategoryId)
      form.append("image" , image)
      console.log(image,'immmggg')
      console.log(form,'form')
      // const form ={
      //   name: categoryName,
      //   parentId : parentCategoryId
      // }
      dispatch(addCategory(form)).then(result => {
        if(result) {
          dispatch(getAllCategory())
        }}).catch(err => {
          console.log(err,'emes')
        })
      setShow(false)
    }

    const createCategoryList = (categories, options= []) => {
      for(let category of categories) {
        options.push({value: category._id , name: category.name, parentId: category.parentId})
        if(category.children && category.children.length > 0) {
          createCategoryList(category.children, options)
        }
      }
      
      return options;
    }
    const updateCheckedAndExpandedCategories = () => {
      const categories = createCategoryList(category.categories);
      const checkedArray = [];
      const expandedArray = [];

        checked.length > 0 && checked.forEach((categoryId , index) => {
        const category=  categories.find((category,_index) => categoryId == category.value)
        checkedArray && checkedArray.push(category)
        })
        expanded.length > 0 && expanded.forEach((categoryId , index) => {
          const category=  categories.find((category,_index) => categoryId == category.value)
          expandedArray && expandedArray.push(category)
        }) 
        setCheckedArray(checkedArray);
        setExpandedArray(expandedArray);
        console.log(expandedArray,checkedArray);
    }

    const updateCategory = () => {
      setUpdateCategoryModal(true)
      updateCheckedAndExpandedCategories()
    }
    const handleCategoryInput = (key, value, index, type) => {
        if(type == 'checked') {
         const updatedCheckedArray =  checkedArray.map((item, _index) =>  index == _index ? ({...item, [key] : value}) : item)
         setCheckedArray(updatedCheckedArray)
        }else if (type == 'expanded') {
          const updatedExpandedArray =  expandedArray.map((item, _index) =>  index == _index ? ({...item, [key] : value}) : item)
          setExpandedArray(updatedExpandedArray)
        }
    }
    const updateCategoriesForm = () => {
      const form = new FormData();

          expandedArray.forEach((item,index) => {
              form.append("_id" , item.value);
              form.append("name" , item.name);
              form.append("parentId" , item.parentId ? item.parentId: "")
          })
          checkedArray.forEach((item,index) => {
            form.append("_id" , item.value);
            form.append("name" , item.name);
            form.append("parentId" , item.parentId ? item.parentId: "")
        })
        console.log(form,'form')
        dispatch(updateCategories(form))
        .then(result => {
          if(result) {
            dispatch(getAllCategory())
          }
        })
      
      setUpdateCategoryModal(false)

    }
    const renderUpdateCategoriesModal = () => {
      return (
        <Modal 
          show={updateCategoryModal} 
          onHide={()=> setUpdateCategoryModal(false)}
          size='lg'
          className='update_modal'>
        <Modal.Header closeButton>
          <Modal.Title >Update Categories</Modal.Title>
        </Modal.Header>
        <Modal.Body className='p-5'>
          <div className="row ">
            <h6>Expanded</h6>
          </div>
          {expandedArray.length > 0 && expandedArray.map((item,index) => 
              <div className="row mb-10" key={index}>
                <div className="col-md-6">
                  <input 
                    value= {item.name}
                    placeholder=" Category name"
                    onChange={(e)=> handleCategoryInput('name',e.target.value, index, 'expanded')}
                  />
                </div>
                <div className="col-md-6">
                    <select className='form-control'
                      value={item.parentId}
                      onChange={(e)=> handleCategoryInput('parentId',e.target.value, index, 'expanded')}
                    >
                        <option>select category</option>
                          {createCategoryList(category.categories).map(option => 
                            <option key={option.value} value={option.value}>{option.name}</option>
                            )}
                    </select>
                </div>
            </div>
          )}
          <div className="row">
            <h6>Checked</h6>
          </div>
          {checkedArray.length > 0 && checkedArray.map((item,index) => 
              <div className="row mb-10" key={index}>
                <div className="col-md-6">
                  <input 
                    value= {item.name}
                    placeholder="Category name"
                    onChange={(e)=> handleCategoryInput('name',e.target.value, index, 'checked')}
                  />
                </div>
                <div className="col-md-6">
                    <select className='form-control'
                      value={item.parentId}
                      onChange={(e)=> handleCategoryInput('parentId',e.target.value, index, 'checked')}
                    >
                        <option>select category</option>
                          {createCategoryList(category.categories).map(option => 
                            <option key={option.value} value={option.value}>{option.name}</option>
                            )}
                    </select>
                </div>
            </div>
          )}
            
        </Modal.Body>
        <Modal.Footer>
          
          <button className='btn-edit' onClick={updateCategoriesForm}>
            Save Changes
          </button>
        </Modal.Footer>
      </Modal>
      )
    }
    const deleteCategory = () => {
      updateCheckedAndExpandedCategories()
      setDeleteCategoryModal(true)
    }

    const deleteCategories = () => {
      const checkedIdsArray = checkedArray.map((item,index) => ({_id : item.value}));
      const expandedIdsArray = expandedArray.map((item,index) => ({_id : item.value}));
      const idsArray = expandedIdsArray.concat(checkedIdsArray)
      if(checkedIdsArray.length > 0 ) {
        dispatch(deleteCategoriesAction(checkedIdsArray))
        .then(result => {
          console.log(result,'iriri')
          if(result) {
            dispatch(getAllCategory())
            setDeleteCategoryModal(false)
          }
        })
      }
      

    }
    const renderDeleteCategoryModal = () => {
      return (
        <Modal  show={deleteCategoryModal} onHide={() => setDeleteCategoryModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Delete Categories</Modal.Title>
            </Modal.Header>
            <Modal.Body id="deletemodal">
              <div className="expanded-list">
                <h5>Expanded Category</h5>
                {expandedArray.map((item,index) => <span  key={index}>{item.name },</span>)}
              </div>
              <div className="checked-list">
                <h5>Checked Category</h5>
                {checkedArray.map((item,index) => <span key={index}>{item.name },</span>)}
              </div>

            </Modal.Body>
            <Modal.Footer>
              Are you sure Want to Delete?
              <button class="btn-delete" onClick={deleteCategories}>
                yes
              </button>
              <button class="btn-edit" onClick={() => setDeleteCategoryModal(false)}>
                no
              </button>
        </Modal.Footer>
      </Modal>
      )
    }

    const renderAddCategoryModal = () => {
      const handleChange = (name) => (event) => {
        setImage( event.target.files[0] );
      };
      return (
        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className='modal-header-title'>Add New Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="input_wrap">
            <label for="categoryname">Name :</label>
              <input 
                id="categoryname"
                value= {categoryName}
                placeholder=" Category name"
                onChange={(e)=> setCategoryName(e.target.value)}
              />
          </div>
          <div className="input_wrap">
            <label for="image">Pick Image :</label>
            <input
              type="file"
              accept="image/*"
              name="image"
              id="image"
              onChange={handleChange("image")}
                        />
          </div>
          <div className="input_wrap">
            <label for="category">Select Parent category :</label>
            <select 
                className='form-control'
                id="category"
                value={parentCategoryId}
                onChange={(e) => setParentCategoryId(e.target.value)}
              >
                <option>select category</option>
                {createCategoryList(category.categories).map(option => 
                  <option key={option.value} value={option.value}>{option.name}</option>
                  )}
            </select>
          </div>
            
        </Modal.Body>
        <Modal.Footer>
          
          <button value="btn-edit" onClick={handleSubmit}>
            Save Changes
          </button>
        </Modal.Footer>
      </Modal>
      )
    }

  return (
    <div className="dashboard_wrapper">
          <div className="container-fluid">
          <div className="row">
            {/* <div className="w-17"> */}
                <AdminNavbar />
            {/* </div> */}
            <div
                 className={classnames( slider ? 'w-82' : 'w-100')}>
            <div className='dashboard_right'>
      <div className="contact-wrap ">
        <h3 className="large " >
          Add category
        </h3>
        <button class="btn-add" onClick={handleShow}>Add</button>
      </div>
      <div className="row">
          <CheckboxTree
              nodes={renderCategories(category.categories)}
              checked={checked}
              expanded={expanded}
              onCheck={checked => setChecked( checked )}
              onExpand={expanded => setExpanded( expanded )}
              icons= {{
                check:  <IoIosCheckbox/>,
                uncheck: <IoIosCheckboxOutline />,
                halfCheck: <IoIosCheckboxOutline/>,
                expandClose: <IoIosArrowForward/>,
                expandOpen: <IoIosArrowDown/>
              }}
            />
          {/* <ul> */}
            
            {/* {renderCategories(category.categories)} */}
            {/* {JSON.stringify(createCategoryList(category.categories))} */}
          {/* </ul> */}

      </div>
      <div className="button_wrap">
      <button class="btn-edit" onClick={updateCategory}>Edit</button>
        <button class="btn-delete" onClick={deleteCategory}>Delete</button>
        
      </div>
      
    </div>
  </div>
              {renderAddCategoryModal()}
      {/* update category modal */}
      {renderUpdateCategoriesModal()}
      {renderDeleteCategoryModal()}
</div>
</div>
</div>
)
;
};

export default Category;
