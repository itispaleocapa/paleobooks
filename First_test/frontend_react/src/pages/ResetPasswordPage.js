import React from 'react';
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import api from "../api";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import LinearProgress from "@material-ui/core/LinearProgress";
import {Redirect, withRouter} from 'react-router-dom'
import queryString from 'query-string'

class ResetPasswordPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {password: '', password_comfirm: '', changed: 0}
    }

    componentDidMount() {
        const get = queryString.parse(this.props.location.search)
        this.setState({get: get});
    }

    handleInputChange = (field, e) => {
        this.setState({[field]: e.target.value});
    }

    handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            this.handleSave();
        }
    }

    handleSave = () => {
        if (this.state.password.length > 0 && this.state.password.length < 6) {
            this.setState({
                dialogTitle: 'Errore',
                dialogContent: 'Lunghezza minima password: 6 caratteri',
                dialogOpen: true
            });
            return
        }
        if (this.state.password !== this.state.password_confirm) {
            this.setState({dialogTitle: 'Errore', dialogContent: 'Le password non corrispondono', dialogOpen: true});
            return
        }
        this.setState({loading: true});
        api.request('/auth/password-reset/' + (this.state.get.token ? this.state.get.token : ''), 'POST', JSON.stringify({new_password: this.state.password})).then(() => {
            this.setState({loading: false, changed: 1});
            this.setState({
                dialogTitle: 'Informazione',
                dialogContent: 'Password modificata correttamente!',
                dialogOpen: true
            });
        }).catch((res) => {
            if (res) {
                if (res.error === 'Reset token is required.') {
                    res.error = 'URL non valido.';
                } else if (res.error === 'This request is not valid.') {
                    res.error = 'Richiesta non valida';
                } else if (res.error === 'Authentication managed by PaleoID.') {
                    res.error = 'L\'autenticazione di questo account è gestita da PaleoID.';
                }
                this.setState({dialogTitle: 'Errore', dialogContent: res.error, dialogOpen: true});
            } else {
                this.setState({
                    dialogTitle: 'Errore',
                    dialogContent: 'Impossibile comunicare con il server',
                    dialogOpen: true
                });
            }
        });
    }

    dialogHandleClose = () => {
        this.setState({dialogOpen: false});
        if (this.state.changed === 1) {
            this.setState({changed: 2});
        }
    }

    render() {
        if (this.state.changed === 2) {
            return <Redirect to=""/>;
        }
        return (
            <>
                <AppBar position="static" style={{alignItems: 'center'}}>
                    <Toolbar>
                        <Typography variant="h6">
                            PALEObooks
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Container style={{alignItems: 'center', marginTop: '10px'}}>
                    <img src="https://i.imgur.com/jMTzBKa.png" alt="logo"
                         style={{width: '30%', maxWidth: '175px', margin: '15px auto', display: 'block'}}/>
                    <Paper style={{maxWidth: '500px', padding: '15px', margin: '0 auto'}}>
                        <form noValidate autoComplete="off">
                            <Typography variant="h4" style={{textAlign: 'center'}}>
                                Modifica password
                            </Typography>
                            <TextField id="outlined-basic" label="Password" variant="outlined" fullWidth type='password'
                                       style={{marginTop: '10px'}}
                                       onChange={(e) => this.handleInputChange('password', e)}
                                       onKeyPress={this.handleKeyPress} autoFocus/>
                            <TextField id="outlined-basic" label="Conferma password" variant="outlined" fullWidth
                                       type="password"
                                       style={{marginTop: '10px'}}
                                       onChange={(e) => this.handleInputChange('password_confirm', e)}
                                       onKeyPress={this.handleKeyPress}/>
                            {this.state.isLoading ?
                                <LinearProgress style={{margin: '8px'}}/> :
                                <div style={{marginTop: '20px'}}/>
                            }
                            <div style={{width: 'fit-content', margin: '0px auto 10px'}}>
                                <Button variant="contained"
                                        onClick={this.handleSave}>Modifica password</Button>
                            </div>
                        </form>
                    </Paper>
                    <Dialog
                        open={this.state.dialogOpen}
                        onClose={this.dialogHandleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{this.state.dialogTitle}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                {this.state.dialogContent}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.dialogHandleClose} color="primary" autoFocus>
                                Chiudi
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Container>
            </>
        )
    }
}

export default withRouter(ResetPasswordPage);
