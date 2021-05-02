import React from "react";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import api from "../api";
import Avatar from "@material-ui/core/Avatar";
import CircularProgress from "@material-ui/core/CircularProgress";
import Link from "@material-ui/core/Link";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";

class ProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            paleoId: false,
            name: '',
            email: '',
            password: '',
            password_confirm: '',
            emailmd5: '',
            snackBarOpen: false
        };
    }

    componentDidMount() {
        this.updateProfile();
    }

    updateProfile = () => {
        api.request('/users/profile').then((res) => {
            var md5 = require('md5');
            this.setState({
                id: res.id,
                paleoid: res.paleoid,
                name: res.name,
                email: res.email,
                emailmd5: md5(res.email.toLowerCase())
            });
            this.props.updateProfile();
        })
    }

    handleInputChange = (field, e) => {
        this.setState({[field]: e.target.value});
    }

    handleSave = () => {
        if (this.state.password.length > 0 && this.state.password.length < 6) {
            this.setState({snackBarOpen: true, snackBarSeverity: 'error', snackBarMessage: 'Lunghezza minima password: 6 caratteri'});
            return
        }
        if (this.state.password !== this.state.password_confirm) {
            this.setState({snackBarOpen: true, snackBarSeverity: 'error', snackBarMessage: 'Le password non corrispondono'});
            return
        }
        let password = this.state.password.length > 0 ? this.state.password : null;
        api.request('/users', 'PUT', JSON.stringify({
            name: this.state.name,
            email: this.state.email,
            password: password
        })).then(res => {
            this.setState({
                snackBarOpen: true,
                snackBarSeverity: 'success',
                snackBarMessage: 'Profilo modificato correttamente!'
            });
            this.updateProfile();
        }).catch((res) => {
            if (res.error === 'Email already exists.') {
                res.error = 'Indirizzo email già utilizzato'
            }
            else if (res.error === 'Nothing to update.') {
                res.error = 'Profilo già salvato'
            }
            this.setState({snackBarOpen: true, snackBarSeverity: 'error', snackBarMessage: res.error});
        });
    }

    handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            this.handleSave();
        }
    }

    render() {
        return (
            <>
                <Typography variant="h5" style={{textAlign: 'center', marginTop: '10px'}}>
                    Profilo
                </Typography>
                {this.state.id === null ?
                    <div style={{margin: '30px auto', width: 'fit-content'}}><CircularProgress/></div> :
                    <Grid container style={{maxWidth: '800px', width: 'initial', margin: '0 auto'}}>
                        <Grid item xs={12} sm={7} style={{marginTop: '10px'}} className='custom-grid-item'>
                            <Paper style={{padding: '10px', textAlign: 'center'}}>
                                <TextField id="outlined-basic" label="Nome" variant="outlined" fullWidth
                                           style={{marginTop: '10px'}}
                                           onChange={(e) => this.handleInputChange('name', e)}
                                           defaultValue={this.state.name}
                                           onKeyPress={this.handleKeyPress} disabled={this.state.paleoid}/>
                                <TextField id="outlined-basic" label="Email" variant="outlined" fullWidth
                                           style={{marginTop: '10px'}}
                                           onChange={(e) => this.handleInputChange('email', e)}
                                           defaultValue={this.state.email}
                                           onKeyPress={this.handleKeyPress} disabled={this.state.paleoid}/>
                                <TextField id="outlined-basic" label="Password" variant="outlined" fullWidth
                                           style={{marginTop: '10px'}}
                                           onChange={(e) => this.handleInputChange('password', e)}
                                           onKeyPress={this.handleKeyPress}
                                           type='password' disabled={this.state.paleoid}/>
                                <TextField id="outlined-basic" label="Conferma password" variant="outlined" fullWidth
                                           style={{marginTop: '10px'}}
                                           onChange={(e) => this.handleInputChange('password_confirm', e)}
                                           onKeyPress={this.handleKeyPress}
                                           type='password' disabled={this.state.paleoid}/>
                                {this.state.paleoid === false ?
                                    <Button variant="contained" color="primary" style={{marginTop: '10px'}}
                                            onClick={this.handleSave}>
                                        Salva
                                    </Button> :
                                    <Alert severity="info" style={{marginTop: '10px', textAlign: 'left'}}>
                                        Il tuo account è gestito da <strong>PaleoID</strong>.<br/>
                                        <Link href="https://id.paleo.bg.it/dashboard" target="_blank">Clicca
                                            qui</Link> per modificare la password.<br/>
                                        Scrivi a <Link href="mailto:info@paleo.bg.it"
                                                       target="_blank">info@paleo.bg.it</Link> per modificare
                                        l'indirizzo email.
                                    </Alert>
                                }
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={5} style={{marginTop: '10px'}} className='custom-grid-item'>
                            <Paper style={{padding: '10px', textAlign: 'center'}}>
                                <Avatar alt={this.state.name}
                                        src={"https://gravatar.com/avatar/" + this.state.emailmd5 + "?d=retro&s=256"}
                                        style={{
                                            width: '80%',
                                            maxWidth: '200px',
                                            height: 'auto',
                                            margin: '0 auto 10px'
                                        }}/>
                                <Link href="https://it.gravatar.com/" target="_blank">Modifica su Gravatar</Link>
                            </Paper>
                        </Grid>
                    </Grid>
                }
                <Snackbar open={this.state.snackBarOpen} autoHideDuration={6000} onClose={this.handleSnackbarClose}>
                    <Alert onClose={this.handleSnackbarClose} severity={this.state.snackBarSeverity}>
                        {this.state.snackBarMessage}
                    </Alert>
                </Snackbar>
            </>
        );
    }
}

export default ProfilePage;
