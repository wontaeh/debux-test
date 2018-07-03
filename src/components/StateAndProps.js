import React from 'react';

const stateAndProps = (props) => {
  console.log('StateAndProps: ', props.stateAndProps)
  return (
    <pre className='stateAndProps'>{JSON.stringify(props.stateAndProps, undefined, 2)}</pre>
  )
}

export default stateAndProps;