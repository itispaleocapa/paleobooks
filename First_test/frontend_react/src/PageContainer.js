import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import {BrowserRouter, NavLink, Redirect, Route, Switch} from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import Icon from "@material-ui/core/Icon";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import api from "./api";
import ProfileInfoDrawer from "./ProfileInfoDrawer";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import FindClassBooksPage from "./pages/FindClassBooksPage";

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
    const dummyCategories = ['Hokusai', 'Hiroshige', 'Utamaro', 'Kuniyoshi', 'Yoshitoshi']
    const classes = useStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);

    function handleDrawerToggle() {
        setMobileOpen(!mobileOpen)
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
                <ProfileInfoDrawer/>

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
                    <MenuItem onClick={handleClose} component={NavLink} to="/profile" >Profilo</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
            </div>
            <Divider variant="middle" style={{margin: '0'}}/>
            <List>
                <ListItem button key="/" component={NavLink} exact to="/" activeClassName="Mui-selected">
                    <ListItemText primary="Home"/>
                </ListItem>
                <ListItem button key="/class-books" component={NavLink} to="/class-books" activeClassName="Mui-selected">
                    <ListItemText primary="Ricerca libri classe"/>
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
                        PaleoBooks
                    </Typography>
                </Toolbar>
            </AppBar>

            <nav className={classes.drawer}>
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Hidden mdUp implementation="css">
                    <Drawer
                        variant="temporary"
                        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true,
                        }}
                    >
                        {drawer}
                    </Drawer>
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
                            <ProfilePage/>
                        </Route>
                        <Route path="/class-books">
                            <FindClassBooksPage/>
                        </Route>

                    </Switch>

                </div>
            </div>
        </div>

    );
}

export default PageContainer;