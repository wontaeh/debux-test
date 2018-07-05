import React from 'react';
import Toggle from './Toggle'
import D3Tree from './D3Tree';
import StateAndProps from './StateAndProps';


const ChartWindow = (props) => {
    let displayTree = [];
    let stateAndPropsList = [];
    //console.log("PROPS:", props.stateAndProps);
    if(props.displayType === 'Tree') {
        if(props.treeData) {
            displayTree.push(<D3Tree key={'compTree'} treeData = {props.treeData} onMouseOver={props.onMouseOver}/>);
        }
        if(props.storeData && props.storeData.length) {
            displayTree.push(<D3Tree key={'storeTree'} storeTreeData = {props.storeData} onMouseOverStore={props.onMouseOverStore} onMouseOutStore={props.onMouseOutStore}/>);
        }
    } else {
        if(props.stateAndProps) {
            stateAndPropsList = props.stateAndProps.map((propObj, index)=>{
                return <StateAndProps stateAndProps={propObj} key={index} />
            });
        }
        if(props.stateAndPropsStore){
            stateAndPropsList = props.stateAndPropsStore.map((propObj, index)=>{
                return <StateAndProps stateAndProps={propObj} key={index} />
            });
        }
    }

    return (
        <div className="chartWindow">
            <Toggle treeType={props.treeType} treeData={props.treeData} dropDownHandleClick={props.dropDownHandleClick}  />
            {displayTree}
            {stateAndPropsList}
        </div>
    );
};

export default ChartWindow;