
import { 
    GET_ALL_CATEGORIES_SUCCESS , 
    GET_ALL_CATEGORIES_FAILURE,
    GET_ALL_CATEGORIES_REQUEST,
    ADD_NEW_CATEGORY_REQUEST,
    ADD_NEW_CATEGORY_SUCCESS,
    ADD_NEW_CATEGORY_FAIL
  } from "../actions/types";
  
  const initialState = {
    categories: [],
    loading:false,
    error: null
  };
  
  const buildNewCategories = (parentId,categories, category) => {
    let myCategories= [];
    for(let cat of categories) {
      if( cat._id == parentId) {
        const newCategory = {
          _id : category._id,
          name: category.name,
          slug:category.slug,
          parentId: category.parentId,
          category: []
        }
        myCategories.push({
          ...cat,
          children:  cat.children.length > 0 ? [...cat.children, newCategory] : [newCategory]
        })
      }else {
        myCategories.push({
          ...cat,
          children: cat.children && cat.children.length > 0 ? buildNewCategories(parentId,cat.children, category) : []
        })
      }
      
    }
    return myCategories;
  }
  export default function (state = initialState, action) {
    switch (action.type) {
      case GET_ALL_CATEGORIES_SUCCESS:
        return {
          ...state,
          categories: action.payload.categories,
        };
        case ADD_NEW_CATEGORY_REQUEST:
          return {
            ...state,
            loading:true
          };
        case ADD_NEW_CATEGORY_SUCCESS : 
        const category = action.payload.category;
        console.log(category,'opoppppppppp');
        const updatedCategories = buildNewCategories(category.parentId,state.categories, category)
        console.log(updatedCategories);
          return {
            ...state,
            categories: updatedCategories,
            loading:false,
  
          }
          case ADD_NEW_CATEGORY_FAIL : 
          return {
            ...state,
            loading:false,
  
          }
      default:
        return state;
    }
  }
  