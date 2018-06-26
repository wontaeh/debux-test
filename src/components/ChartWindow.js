import React from 'react';
import Toggle from './Toggle'
import D3Tree from './D3Tree';

const ChartWindow = (props) => {
    return (
        <div className="chartWindow">
            <Toggle treeType={props.treeType} treeData={props.treeData}/>
            <D3Tree treeData = {props.treeData} />
        </div>
    );
};

export default ChartWindow;