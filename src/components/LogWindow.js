import React from 'react';

const LogWindow = (props) => {
    let logDisplay = props.memory.map((el)=>{
        return <pre >{el.count}  {JSON.stringify(el.store, undefined, 2)} </pre>
    });
    return (
        <div className="logWindow">
          Logs:  
          {logDisplay}
        </div>
    );
};

export default LogWindow;