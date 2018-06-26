import React from 'react';

const Components = (props) => {
  let displayState = JSON.stringify(props.state);
  let displayProps = JSON.stringify(props.props);
  return (
    <div>
      <ul>
        <li>Components Name: {props.name}</li>
        <li>State: {displayState}</li>
        <li>Props: {displayProps}</li>
      </ul>
    </div>
  );
};

export default Components;