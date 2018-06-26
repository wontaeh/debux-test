import React from 'react';
import DropDown from './DropDown';
import D3Tree from './D3Tree';


const Toggle = (props) => {
    return (
        <div className='toggle'>
            <span>{props.treeType}</span>
            <DropDown/>
            <D3Tree treeData = {props.treeData} />
        </div>
    );
};

export default Toggle;