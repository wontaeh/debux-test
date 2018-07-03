import React from 'react';
import Toggle from './Toggle'
import D3Tree from './D3Tree';

const ChartWindow = (props) => {
    const displayTree = [];
    if(props.treeData) {
        displayTree.push(<D3Tree key={'compTree'} treeData = {props.treeData} onMouseOver={props.onMouseOver}/>);
    } else if(props.storeData && props.storeData.length) {
        displayTree.push(<D3Tree key={'storeTree'} storeTreeData = {props.storeData} onMouseOverStore={props.onMouseOverStore} onMouseOutStore={props.onMouseOutStore}/>);
    }
    return (
        <div className="chartWindow">
            <Toggle treeType={props.treeType} treeData={props.treeData} dropDownHandleClick={props.dropDownHandleClick}  />
            {/* <D3Tree treeData = {props.treeData} /> */}
            {displayTree}
        </div>
    );
};

export default ChartWindow;