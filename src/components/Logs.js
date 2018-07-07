/*  ************************************************************************
 * Created by Wontae Han, Alejandro Romero, Shafayat Alam and Jeff Schrock.
 * Copyright © 2018 De-Bux. All rights reserved.
 **************************************************************************/
import React from 'react';
const Logs = (props) => {

const actions = [{Name: 'Action 1'},{Name: 'Action 2'},{Name: 'Action 3'},{Name: 'Action 4'}];
const dispatchedActions = actions.map((action) =>
  <li className='logs'>{action.Name}</li>
  );
  return (
    <ul>{dispatchedActions}</ul>
  )
}

export default Logs;