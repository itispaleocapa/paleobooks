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
import {withRouter} from 'react-router-dom'
import queryString from 'query-string'
import Link from "@material-ui/core/Link";

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {name: '', email: '', password: '', isLoading: false, password_registration: '', password_comfirm_registration: ''}
        this.state.paleoIdUrl = process.env.REACT_APP_PALEOID_URL + '/oauth/authorize?client_id=' + process.env.REACT_APP_PALEOID_CLIENT_ID + '&response_type=code&state=paleobooks&redirect_uri=' + encodeURIComponent(process.env.REACT_APP_PALEOID_REDIRECT_URI);
    }

    componentDidMount() {
        const values = queryString.parse(this.props.location.search)
        if (values.state === "paleobooks") {
            this.setState({isLoading: true});
            api.loginPaleoID(values.code).then(() => {
                this.props.checkLogin();
            }).catch(() => {
                this.setState({
                    dialogTitle: 'Errore',
                    dialogContent: 'Autenticazione con PaleoID fallita',
                    dialogOpen: true
                });
                this.setState({isLoading: false})
            })
        }
    }

    handleInputChange = (field, e) => {
        this.setState({[field]: e.target.value});
    }

    handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            this.handleLogin();
        }
    }

    handleKeyPressReset = (event) => {
        if (event.key === 'Enter') {
            this.handleResetPassword();
        }
    }

    handleKeyPressRegistration = (event) => {
        if (event.key === 'Enter') {
            this.handleRegistration();
        }
    }

    handleLogin = () => {
        this.setState({isLoading: true})
        api.login(this.state.email, this.state.password).then((res) => {
            this.props.checkLogin();
        }).catch(() => {
            this.setState({dialogTitle: 'Errore', dialogContent: 'Credenziali non valide', dialogOpen: true});
            this.setState({isLoading: false})
        })
    }

    handleRegistrationBtn = () => {
        this.setState({registrationDialogOpen: true});
    }

    handleResetPassword = () => {
        api.request('/auth/password-reset', 'POST', JSON.stringify({email: this.state.email_reset})).then((res) => {
            this.resetPasswordDialogHandleClose();
            this.setState({
                dialogTitle: 'Email inviata',
                dialogContent: 'Clicca sul link che hai ricevuto per modificare la password.',
                dialogOpen: true
            });
        }).catch((res) => {
            if (res.email && res.email[0] == 'The email field is required.') {
                res.error = 'Indirozzo email non valido.';
            }
            else if (res.error == 'Email does not exist.') {
                res.error = 'Indirizzo email inesistente.';
            } else if (res.error == 'Authentication managed by PaleoID.') {
                res.error = 'L\'autenticazione di questo account è gestita da PaleoID.';
            }
            this.setState({dialogTitle: 'Errore', dialogContent: res.error, dialogOpen: true});
        });
    }

    handleRegistration = () => {
        if (this.state.password_registration.length > 0 && this.state.password_registration.length < 6) {
            this.setState({dialogTitle: 'Errore', dialogContent: 'Lunghezza minima password: 6 caratteri', dialogOpen: true});
            return
        }
        if (this.state.password_registration !== this.state.password_confirm_registration) {
            this.setState({dialogTitle: 'Errore', dialogContent: 'Le password non corrispondono', dialogOpen: true});
            return
        }
        this.setState({email: this.state.email_registration, password: this.state.password_registration});
        api.request('/auth/register', 'POST', JSON.stringify({
            name: this.state.name_registration,
            email: this.state.email_registration,
            password: this.state.password_registration,
            confirm_password: this.state.password_registration
        })).then((res) => {
            this.registrationDialogHandleClose();
            this.handleLogin();
        }).catch((res) => {
            if (res.name && res.name[0] == 'The name field is required.') {
                res.error = 'Il campo nome è obbligatorio.';
            }
            else if (res.email && (res.email[0] == 'The email field is required.' || res.email[0] == 'The email must be a valid email address.')) {
                res.error = 'Indirizzo email non valido.';
            }
            else if (res.password && res.password[0] == 'The password field is required.') {
                res.error = 'La password è obbligatoria';
            }
            else if (res.error == 'Email does not exist.') {
                res.error = 'Indirizzo email inesistente.';
            } else if (res.error == 'Authentication managed by PaleoID.') {
                res.error = 'L\'autenticazione di questo account è gestita da PaleoID.';
            }
            this.setState({dialogTitle: 'Errore', dialogContent: res.error, dialogOpen: true});
        })
    }

    handleResetPasswordClick = (e) => {
        this.setState({resetPasswordDialogOpen: true});
        e.preventDefault();
    }

    dialogHandleClose = () => {
        this.setState({dialogOpen: false});
    }

    resetPasswordDialogHandleClose = () => {
        this.setState({resetPasswordDialogOpen: false});
    }

    registrationDialogHandleClose = () => {
        this.setState({registrationDialogOpen: false});
    }

    render() {
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
                    <img src="https://i.imgur.com/jMTzBKa.png"
                         style={{width: '30%', maxWidth: '175px', margin: '15px auto', display: 'block'}}/>
                    <Paper style={{maxWidth: '500px', padding: '15px', margin: '0 auto'}}>
                        <form noValidate autoComplete="off">
                            <Typography variant="h4" style={{textAlign: 'center'}}>
                                Login
                            </Typography>
                            <TextField id="outlined-basic" label="Email" variant="outlined" fullWidth
                                       style={{marginTop: '10px'}}
                                       onChange={(e) => this.handleInputChange('email', e)}
                                       onKeyPress={this.handleKeyPress} autoFocus/>
                            <TextField id="outlined-basic" label="Password" variant="outlined" fullWidth type="password"
                                       style={{marginTop: '10px'}}
                                       onChange={(e) => this.handleInputChange('password', e)}
                                       onKeyPress={this.handleKeyPress}/>
                            <div style={{marginTop: '4px', textAlign: 'center'}}>
                                <Link href='#' onClick={(e) => this.handleResetPasswordClick(e)}>Password
                                    dimenticata?</Link>
                            </div>
                            {this.state.isLoading ?
                                <LinearProgress style={{margin: '8px'}}/> :
                                <div style={{marginTop: '20px'}}/>
                            }
                            <div style={{width: 'fit-content', margin: '0px auto 10px'}}>
                                <Button variant="contained" style={{marginRight: '4px'}}
                                        onClick={this.handleLogin}>Accedi</Button>
                                <Button variant="contained" style={{marginLeft: '4px'}}
                                        onClick={this.handleRegistrationBtn}>Registrati</Button>
                            </div>
                            <div style={{width: 'fit-content', margin: '20px auto 0px'}}>
                                <Button variant="contained" color="primary" href={this.state.paleoIdUrl}>
                                    Accedi con PaleoID
                                </Button>
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
                    <Dialog
                        open={this.state.resetPasswordDialogOpen}
                        onClose={this.resetPasswordDialogHandleClose}
                        maxWidth='xs'
                        fullWidth
                    >
                        <DialogTitle>Reset password</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Inserisci il tuo indirizzo email, riceverai un link per modificare la password.
                            </DialogContentText>
                            <TextField id="outlined-basic" label="Email" variant="outlined" fullWidth
                                       style={{marginTop: '10px'}}
                                       onChange={(e) => this.handleInputChange('email_reset', e)}
                                       onKeyPress={this.handleKeyPressReset}
                                       type='text'
                                       autofocus
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.resetPasswordDialogHandleClose} color="primary">
                                Chiudi
                            </Button>
                            <Button onClick={this.handleResetPassword} color="primary">
                                Conferma
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog
                        open={this.state.registrationDialogOpen}
                        onClose={this.registrationDialogHandleClose}
                        maxWidth='xs'
                        fullWidth
                    >
                        <DialogTitle>Registrati</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Inserisci i tuoi dati per registrarti a PALEObooks.
                            </DialogContentText>
                            <TextField id="outlined-basic" label="Nome" variant="outlined" fullWidth
                                       style={{marginTop: '10px'}}
                                       onChange={(e) => this.handleInputChange('name_registration', e)}
                                       onKeyPress={this.handleKeyPressRegistration}
                                       type='text'
                                       autofocus
                            />
                            <TextField id="outlined-basic" label="Email" variant="outlined" fullWidth
                                       style={{marginTop: '10px'}}
                                       onChange={(e) => this.handleInputChange('email_registration', e)}
                                       onKeyPress={this.handleKeyPressRegistration}
                                       type='text'
                            />
                            <TextField id="outlined-basic" label="Password" variant="outlined" fullWidth
                                       style={{marginTop: '10px'}}
                                       onChange={(e) => this.handleInputChange('password_registration', e)}
                                       onKeyPress={this.handleKeyPressRegistration}
                                       type='password'
                            />
                            <TextField id="outlined-basic" label="Conferma password" variant="outlined" fullWidth
                                       style={{marginTop: '10px'}}
                                       onChange={(e) => this.handleInputChange('password_confirm_registration', e)}
                                       onKeyPress={this.handleKeyPressRegistration}
                                       type='password'
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.registrationDialogHandleClose} color="primary">
                                Chiudi
                            </Button>
                            <Button onClick={this.handleRegistration} color="primary">
                                Registrati
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Container>
            </>
        )
    }
}

export default withRouter(LoginPage);