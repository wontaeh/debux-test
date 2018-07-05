import React from 'react';

const stateAndProps = (props) => {
  return (
    <div className = 'stateAndPropsDiv'>
    <pre className='stateAndProps'>{JSON.stringify(props.stateAndProps, undefined, 2)}</pre>
    </div>
  )
}

export default stateAndProps;