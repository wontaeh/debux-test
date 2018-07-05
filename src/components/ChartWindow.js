import React from 'react';
import Toggle from './Toggle'
import D3Tree from './D3Tree';
import StateAndProps from './StateAndProps' //

const ChartWindow = (props) => {
    const displayTree = [];
    let stateAndPropsList = null;

    if (props.displayType === "Tree"){
        stateAndPropsList = null;
        //console.log("DATA TYPE IS TREE");
        if(props.treeData) {
            displayTree.push(<D3Tree key={'compTree'} treeData = {props.treeData} onMouseOver={props.onMouseOver}/>);
        } else if(props.storeData && props.storeData.length) {
            displayTree.push(<D3Tree key={'storeTree'} storeTreeData = {props.storeData} onMouseOverStore={props.onMouseOverStore} onMouseOutStore={props.onMouseOutStore}/>);
        }
        // return (
        //     <div className="chartWindow">
        //         <Toggle treeType={props.treeType} treeData={props.treeData} dropDownHandleClick={props.dropDownHandleClick}  />
        //         {/* <D3Tree treeData = {props.treeData} /> */}
        //         {displayTree}
        //     </div>
        // );
    } else {
        console.log("NOT A TREE");
        console.log("Data", props)
       if (props.allStateAndPropsData.length) {
       stateAndPropsList = props.allStateAndPropsData.map((propObj, index) => {
       return <StateAndProps stateAndProps={propObj} key={index}/>
       //import state and props 
        });
        }
//}
    // return (
    //     <div className="chartWindowRaw">
    //         <Toggle treeType={props.treeType} treeData={props.treeData} dropDownHandleClick={props.dropDownHandleClick}  />
    //         {/* <D3Tree treeData = {props.treeData} /> */}
    //         {stateAndPropsList}
    //     </div>
    // );
  } //added now
  return (
    <div className="chartWindowRaw">
        <Toggle treeType={props.treeType} treeData={props.treeData} dropDownHandleClick={props.dropDownHandleClick}  />
        {/* <D3Tree treeData = {props.treeData} /> */}
        {displayTree}
        {stateAndPropsList}
    </div>
);
  
  
};

export default ChartWindow;