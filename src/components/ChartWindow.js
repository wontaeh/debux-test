import React from 'react';
import Toggle from './Toggle'

const ChartWindow = (props) => {
    return (
        <div className="chartWindow">
            <Toggle treeType={props.treeType}/>
        </div>
    );
};

export default ChartWindow;