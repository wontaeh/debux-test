import React from 'react';
import DropDown from './DropDown';


const Toggle = (props) => {
    return (
        <div className='toggle'>
            <span>{props.treeType}</span>
            <DropDown dropDownHandleClick={props.dropDownHandleClick}/>
        </div>
    );
};

export default Toggle;