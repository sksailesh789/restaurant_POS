import React, { useState } from "react";
// import Icon from "react-native-vector-icons/FontAwesome"
import { FaAngleRight,FaAngleDown } from "react-icons/fa";
import {Link,useNavigate} from "react-router-dom"


const MultiMenus = ({menus,props }) => {
  const [activeMenus, setActiveMenus] = useState([]);
  const navigate = useNavigate();

  const handleMenuClick = (data,menuName,val) => {
   console.log(data,'first')
    if(! data.data.submenu ) {
        navigate(`${data.data.path}`)
        console.log('hee')
    }else 
    {
        handleArrowClick(data.menuName)
    }
    
  };

  const handleArrowClick = menuName => {
    let newActiveMenus = [...activeMenus];

    if (newActiveMenus.includes(menuName)) {
      var index = newActiveMenus.indexOf(menuName);
      if (index > -1) {
        newActiveMenus.splice(index, 1);
      }
    } else {
      newActiveMenus.push(menuName);
    }

    setActiveMenus(newActiveMenus);
  };

  const ListMenu = ({ dept, data, hasSubMenu, menuName, menuIndex,val }) => (
    <div>
      <div 
          className="listmenu_sidebar"
          onClick={() => {
                handleMenuClick({data,menuName,val})
                }} 
          dept={dept} 
          style={ { display: 'flex',flexDirection:"row",justifyContent:"space-between", padding: 5, paddingLeft: dept * 10}}>
      <div
            style={{padding: '5px 15px'}}
          > 
            <div>{data.label} </div>
        </div>
        {hasSubMenu && (
            <div >
                <div
                    onClick={() => {
                      handleArrowClick(menuName)}}
                      toggle={activeMenus.includes(menuName)}          
                >
                    {activeMenus.includes(menuName) ? <FaAngleDown /> : <FaAngleRight/>}
                  </div>
          </div>
        )}
      </div>
      {hasSubMenu && (
        <SubMenu
          dept={dept}
          data={data.submenu}
          toggle={activeMenus.includes(menuName)}
          menuIndex={menuIndex}
        />
      )}
    </div>
  );

  const SubMenu = ({ dept, data, toggle, menuIndex }) => {
    if (!toggle) {
      return null;
    }

    dept = dept + 1;

    return (
      <div>
        {data.map((menu, index) => {
          const menuName = `sidebar-submenu-${dept}-${menuIndex}-${index}`;
            console.log(data,'data');
          return (
            <ListMenu
              dept={dept}
              data={menu}
              hasSubMenu={menu.submenu}
              menuName={menuName}
              key={menuName}
              menuIndex={index}
              val= {menu.value}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div>
      {menus.map((menu, index) => {
        const dept = 1;
        const menuName = `sidebar-menu-${dept}-${index}`;
        console.log(menu ,'meon')
        return (
          <ListMenu
            dept={dept}
            data={menu}
            hasSubMenu={menu.submenu}
            menuName={menuName}
            key={menuName}
            menuIndex={index}
            val= {menu.value}
          />
        );
      })}
    </div>
  );
};




export default MultiMenus;