import React from 'react';

const InfoWindow = (props) => {

  let propsData = props.propsData;
  let display = [];
  if(propsData) {
    for(let i = 0; i <propsData.length; i++){
      for(let key in propsData[i]){
        if(key === 'name') {
          display.push(<li>Component: {propsData[i][key]} </li>);
        }
        if(key === 'attributes'){
          for(let key2 in propsData[i][key]) {
            display.push(<li>{key2}:{JSON.stringify(propsData[i][key][key2], null, 2)}</li>);
          }
        }
      }
      display.push(<br />);
    }
  }
  

  return (
    <div className="infoWindow">
      <span>Detailed Info: </span>
      <ul className="infoUL">
        {display}
      </ul>
    </div>
  );
};

export default InfoWindow;