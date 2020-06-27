import React from 'react';
import logo from './logo.svg';
import './App.css';
import Container from "@material-ui/core/Container";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import api from "./api";
import CircularProgress from "@material-ui/core/CircularProgress";
import PrivateRoute from "./PrivateRoute";
import HomePage from "./pages/HomePage";

class App extends React.Component {
    constructor() {
        super();
        this.state = {isLoggedIn: null, wasInitialized: false}
    }

    componentDidMount = () => {
        this.chechLogin();
    }

    chechLogin = () => {
        api.isLoggedIn().then(() => {
            this.setState({isLoggedIn: true, wasInitialized: true});
            console.log(true);
        }).catch(() => {
            this.setState({isLoggedIn: false, wasInitialized: true});
            console.log(false);
        });
    }

    render = () => {
        if (this.state.isLoggedIn === null) return <div style={{margin: '20px auto', width: 'fit-content'}}><CircularProgress /></div>;
        return (
            <BrowserRouter>
                <AppBar position="static" style={{alignItems: 'center'}}>
                    <Toolbar>
                        <Typography variant="h6">
                            PaleoBooks
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Switch>
                    <PrivateRoute auth={this.state.isLoggedIn} wasInitialized={this.state.wasInitialized} exact component={() => <HomePage checkLogin={this.chechLogin} />} path="/"/>
                    <Route exact path="/login">
                        {this.state.isLoggedIn
                            ? <Redirect to=""/>
                            : <LoginPage checkLogin={this.chechLogin}/>}
                    </Route>
                    <Route path="*">
                        <Redirect to=""/>
                    </Route>
                </Switch>
            </BrowserRouter>
        );
    }
}

export default App;
