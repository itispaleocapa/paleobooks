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
import PrivateRoute from "./components/PrivateRoute";
import HomePage from "./pages/HomePage";
import PageContainer from "./components/PageContainer";

class App extends React.Component {
    constructor() {
        super();
        this.state = {error: false, isLoggedIn: null, wasInitialized: false}
    }

    componentDidMount = () => {
        this.chechLogin();
        setTimeout(() => {
            if (this.state.isLoggedIn === null) {
                this.setState({error: true})
            }
        }, 5000);
    }

    chechLogin = () => {
        api.isLoggedIn().then((res) => {
            this.setState({isLoggedIn: true, wasInitialized: true, profile: res});
        }).catch(() => {
            this.setState({isLoggedIn: false, wasInitialized: true});
        });
    }

    render = () => {
        if (this.state.error === true) return <div style={{textAlign: 'center'}}><h1>Impossibile comunicare con il server</h1><h2>Riprova più tardi</h2><h4>PALEObooks</h4></div>
        if (this.state.isLoggedIn === null) return <div style={{margin: '20px auto', width: 'fit-content'}}><CircularProgress /></div>;
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/login">
                        {this.state.isLoggedIn
                            ? <Redirect to=""/>
                            : <LoginPage checkLogin={this.chechLogin}/>}
                    </Route>
                    <Route path={["/reset-password", "/resetpassword.html"]}>
                        {this.state.isLoggedIn
                            ? <Redirect to=""/>
                            : <p>ciao</p>}
                    </Route>
                    <PrivateRoute auth={this.state.isLoggedIn} wasInitialized={this.state.wasInitialized} exact component={() => <PageContainer checkLogin={this.chechLogin} profile={this.state.profile}/>} path="*"/>
                    <Route path="*">
                        <Redirect to=""/>
                    </Route>
                </Switch>
            </BrowserRouter>
        );
    }
}

export default App;
