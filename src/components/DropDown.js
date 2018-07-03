import React from 'react';

const DropDown = (props) => {
    return (
      <div className="dropdown">
        <span><i className="arrowDown"></i></span>
        <div className="dropdown-content">
            <p onClick={()=>props.dropDownHandleClick()}>Tree</p>
            <p onClick={()=>props.dropDownHandleClick()}>Raw</p>
        </div>
    </div>
    );
};

export default DropDown;