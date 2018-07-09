/*  ************************************************************************
 * Created by Wontae Han, Alejandro Romero, Shafayat Alam and Jeff Schrock.
 * Copyright © 2018 De-Bux. All rights reserved.
 **************************************************************************/
import React from 'react';
import Logo from '../img/DebuxLogo48.png'

const NavBar = (props) => {
  return (
    <div className = 'navBar'>
      <h1>De-Bux</h1>
      <img className = 'logo' src={Logo} />
    </div>
  );
};

export default NavBar;