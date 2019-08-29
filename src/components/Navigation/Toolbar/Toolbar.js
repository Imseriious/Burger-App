import React from 'react';

import classes from './Toolbar.module.css';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';

const toolbar = (props) => ( //Second way of controlling height of logo with props
    <header className={classes.Toolbar}>
        <div>MENU</div>
        <div className={classes.DesktopOnly} style={{height: '100%'}}>
            <Logo height={"80%"} />
        </div>
        <div className={classes.DesktopOnly}>
            <NavigationItems />
        </div>
    </header>
);

export default toolbar