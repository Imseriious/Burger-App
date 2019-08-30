import React from 'react';

import classes from './Toolbar.module.css';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import DrawerToggle from '../SideDrawer/DrawerToggle/DrawerToggle';

const toolbar = (props) => ( //Second way of controlling height of logo with props
    <header className={classes.Toolbar}>
        <DrawerToggle clicked={props.drawerToggleClicked}/>
        <div className={classes.DesktopOnly} style={{height: '100%'}}>
            <Logo height={"80%"} />
        </div>
        <div className={classes.DesktopOnly}>
            <NavigationItems />
        </div>
    </header>
);

export default toolbar