import React from 'react';

const DropDown = (props) => {
    return (
      <div className="dropdown">
        <span><i className="arrowDown"></i></span>
        <div className="dropdown-content">
            <p>Tree</p>
            <p>Raw</p>
        </div>
    </div>
    );
};

export default DropDown;