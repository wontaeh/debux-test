import React from 'react';
import StateAndProps from './StateAndProps';

const InfoWindow = (props) => {
  let stateAndPropsList = null;

  if (props.allStateAndPropsData.length) {
    stateAndPropsList = props.allStateAndPropsData.map((propObj, index) => {
      return <StateAndProps stateAndProps={propObj} key={index}/>
    });
  }
  
  return (
    <div className='infoWindow'> 
      Detailed Info:
      {stateAndPropsList}
    </div>
  )
};

export default InfoWindow;