import React from 'react';

const DropDown = (props) => {
    return (
      <div className="dropdown">
        <span><i className="arrowDown"></i></span>
        <div className="dropdown-content">
            <p onClick={()=>props.dropDownHandleClick("Tree")}>Tree</p>
            <p onClick={()=>props.dropDownHandleClick("Raw")}>Raw</p>
        </div>
    </div>
    );
};

export default DropDown;