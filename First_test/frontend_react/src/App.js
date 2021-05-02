import React from 'react';
import './App.css';
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import api from "./api";
import CircularProgress from "@material-ui/core/CircularProgress";
import PrivateRoute from "./components/PrivateRoute";
import PageContainer from "./components/PageContainer";
import ResetPasswordPage from "./pages/ResetPasswordPage";

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
            <BrowserRouter basename={'pbr'}>
                <Switch>
                    <Route exact path="/login">
                        {this.state.isLoggedIn
                            ? <Redirect to=""/>
                            : <LoginPage checkLogin={this.chechLogin} />}
                    </Route>
                    <Route path={["/reset-password", "/resetpassword.html"]}>
                        {this.state.isLoggedIn
                            ? <Redirect to=""/>
                            : <ResetPasswordPage checkLogin={this.chechLogin} />}
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
