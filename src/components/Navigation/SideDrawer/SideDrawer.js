import React from 'react';
import classes from './SideDrawer.module.css';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';

const sideDrawer = (props) => {
    return ( //We wrap the logo so we can adjust the height just for this component (Other way on Toolbar.js)
        <div className={classes.SideDrawer}>
            <div className={classes.Logo}> 
                <Logo />
            </div>
            <nav>
                <NavigationItems />
            </nav>
        </div>
    );
};

export default sideDrawer;