import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import {NavLink, Redirect, Route, Switch} from "react-router-dom";
import Divider from "@material-ui/core/Divider";
import Icon from "@material-ui/core/Icon";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import api from "../api";
import ProfileInfoDrawer from "./ProfileInfoDrawer";
import HomePage from "../pages/HomePage";
import ProfilePage from "../pages/ProfilePage";
import FindClassBooksPage from "../pages/FindClassBooksPage";
import FindBooksPage from "../pages/FindBooksPage";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import AboutUsPage from "../pages/AboutUsPage";
import DemandsSuppliesPage from "../pages/DemandsSuppliesPage";

const drawerWidth = 240;
const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    drawer: {
        [theme.breakpoints.up('md')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        marginTop: '54px',
        [theme.breakpoints.down('xs')]: {
            marginTop: '40px'
        },
    },
    closeMenuButton: {
        marginRight: 'auto',
        marginLeft: 0,
    },
}));

function PageContainer(props) {
    const classes = useStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [profile, setProfile] = React.useState(props.profile);
    function handleDrawerToggle() {
        setMobileOpen(!mobileOpen)
    }

    function updateProfile() {
        api.request('/users/profile').then((res) => {
            setProfile(res);
        })
    }

    function closeDrawer() {        
        setMobileOpen(false);
    }

    const openProfileMenu = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    const handleLogout = () => {
        handleClose();
        api.logout();
        props.checkLogin();
    }

    const drawer = (
        <div>
            <div style={{padding: '12px'}}>
                <ProfileInfoDrawer profile={profile}/>

                <IconButton
                    edge="start"
                    color="inherit"
                    style={{margin: 0, padding: 0, float: 'right'}}
                    onClick={openProfileMenu}
                >
                    <Icon>expand_more</Icon>
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={() => {
                        handleClose();
                        closeDrawer();
                    }} component={NavLink} to="/profile">Profilo</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
            </div>
            <Divider variant="middle" style={{margin: '0'}}/>
            <List>
                <ListItem button key="/" component={NavLink} exact to='/' activeClassName="Mui-selected"
                          onClick={closeDrawer}>
                    <ListItemText primary="Home"/>
                </ListItem>
                <ListItem button key="/demands" component={NavLink} to="/demands" activeClassName="Mui-selected"
                          onClick={closeDrawer}>
                    <ListItemText primary="Domande"/>
                </ListItem>
                <ListItem button key="/supplies" component={NavLink} to="/supplies" activeClassName="Mui-selected"
                          onClick={closeDrawer}>
                    <ListItemText primary="Offerte"/>
                </ListItem>
                <ListItem button key="/books" component={NavLink} to="/books" activeClassName="Mui-selected"
                          onClick={closeDrawer}>
                    <ListItemText primary="Ricerca libri"/>
                </ListItem>
                <ListItem button key="/class-books" component={NavLink} to="/class-books" activeClassName="Mui-selected"
                          onClick={closeDrawer}>
                    <ListItemText primary="Ricerca libri classe"/>
                </ListItem>
                <ListItem button key="/about-us" component={NavLink} to="/about-us" activeClassName="Mui-selected"
                          onClick={closeDrawer}>
                    <ListItemText primary="About us"/>
                </ListItem>
            </List>
        </div>
    );
    return (
        <div className={classes.root}>
            <CssBaseline/>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="Open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        className={classes.menuButton}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        PALEObooks
                    </Typography>
                </Toolbar>
            </AppBar>

            <nav className={classes.drawer}>
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Hidden mdUp implementation="css">
                    <SwipeableDrawer
                        variant="temporary"
                        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                        open={mobileOpen}
                        onOpen={handleDrawerToggle}
                        onClose={handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true,
                        }}
                        disableBackdropTransition
                    >
                        {drawer}
                    </SwipeableDrawer>
                </Hidden>
                <Hidden smDown implementation="css">
                    <Drawer
                        className={classes.drawer}
                        variant="permanent"
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                    >
                        <div className={classes.toolbar}/>
                        {drawer}
                    </Drawer>
                </Hidden>
            </nav>
            <div className={classes.content}>
                <div>
                    <Switch>
                        <Route exact path="/">
                            <HomePage checkLogin={props.checkLogin}/>
                        </Route>      
                        <Route path="/profile">
                            <ProfilePage updateProfile={updateProfile}/>
                        </Route>
                        <Route path="/demands">
                            <DemandsSuppliesPage type='demands' />
                        </Route>
                        <Route path="/supply/:id" render={(props) => <HomePage type='supplies' {...props}/>} />
                        <Route path="/supplies">
                            <DemandsSuppliesPage type='supplies' />
                        </Route>
                        <Route path="/books">
                            <FindBooksPage/>
                        </Route>
                        <Route path="/class-books">
                            <FindClassBooksPage profile={profile}/>
                        </Route>
                        <Route path="/about-us">
                            <AboutUsPage/>
                        </Route>
                        <Route path="*">
                            <Redirect to=""/>
                        </Route>
                    </Switch>
                </div>
            </div>
        </div>

    );
}

export default PageContainer;
