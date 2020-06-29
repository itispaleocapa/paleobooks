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
import { withRouter } from 'react-router-dom'
import queryString from 'query-string'

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {name: '', email: '', password: '', isLoading: false}
        this.state.paleoIdUrl = process.env.REACT_APP_PALEOID_URL + '/oauth/authorize?client_id=' + process.env.REACT_APP_PALEOID_CLIENT_ID + '&response_type=code&state=paleobooks&redirect_uri=' + encodeURIComponent(process.env.REACT_APP_PALEOID_REDIRECT_URI);
    }

    componentDidMount() {
        const values = queryString.parse(this.props.location.search)
        if (values.state === "paleobooks") {
            this.setState({isLoading: true});
            api.loginPaleoID(values.code).then(() => {
                this.props.checkLogin();
            }).catch(() => {
                this.setState({dialogTitle: 'Errore', dialogContent: 'Autenticazione con PaleoID fallita', dialogOpen: true});
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
        /* TODO: implementare registrazione (si potrebbe fare un form in un dialog che compare premendo questo pulsante) */
        this.setState({
            dialogTitle: 'Attenzione',
            dialogContent: 'Questa funzione non è ancora disponibile',
            dialogOpen: true
        });
    }

    dialogHandleClose = () => {
        this.setState({dialogOpen: false});
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
                    <img src="https://i.imgur.com/jMTzBKa.png" style={{width: '30%', maxWidth: '175px', margin: '15px auto', display: 'block'}}/>
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
                </Container>
            </>
        )
    }
}

export default withRouter(LoginPage);