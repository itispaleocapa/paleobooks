import React from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import api from "../api";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import {NavLink} from "react-router-dom";
import CountUp from 'react-countup';
import BookInformationDialog from '../dialogs/BookInformationDialog';
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from '@material-ui/lab/Alert';

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {books: 0, demands: 0, supplies: 0, loading: true, open: true, book: {}, error: true}
    }

    componentDidMount() {
        this.updateCounters();
    }

    updateCounters = () => {
        if(this.props.match?.params?.id) {
            this.checkSupply(this.props.match.params.id)
        }
        api.request('/app/info').then((res) => {
            this.setState({books: res.supplies});
            this.setState({demands: res.user_demands});
            this.setState({supplies: res.user_supplies});
        })
    }

    handleLogout = () => {
        api.logout();
        this.props.checkLogin();
    }

    handleClose = () => {
        this.setState({open: false});
        this.props.history.push('/');
    }

    checkSupply = (id) => {
        api.request('/supplies/' + id).then((res) => {
            this.setState({result: true, book: {
                    ...res.book,
                    info: res.info,
                    userPrice: res.price,
                    email: res.user.email
                }}, function() {
                this.setState({loading: false, error: false})
            });
        }).catch((res) => {
            if (res.error === 'Supply not found') {
                this.setState({snackBarOpen: true, snackBarSeverity: 'error', snackBarMessage: "Impossibile trovare l'offerta", loading: false})
                this.props.history.push('/')
            }
        })
    }

    render() {
        return (
            <>
                {this.props.match?.params?.id? this.state.loading? null : this.state.error? null : <BookInformationDialog book={{...this.state.book, info: JSON.parse(this.state.book.info)}} owner={false} open={this.state.open} handleClose={this.handleClose}/> : null}
                <Paper elevation={3} style={{
                    margin: '10px auto 5px',
                    padding: '15px',
                    maxWidth: '1200px',
                    width: 'fit-content',
                    textAlign: 'center'
                }}>
                    <img src="https://i.imgur.com/jMTzBKa.png" alt="logo"
                         style={{width: '200px', maxWidth: '100%', margin: '5px auto', display: 'block'}}/>
                </Paper>
                <Paper elevation={2} style={{
                    width: 'fit-content',
                    margin: '0 auto',
                    marginTop: '15px',
                    maxWidth: '1200px',
                    textAlign:'center',
                    color:'green',
                    backgroundColor: 'white',
                    padding:'7px',
                    fontSize:'22px',
                }}>
                    <span style={{fontSize:'30px'}}>NUOVA EDIZIONE!</span><br/>
                    <span>L'elenco delle classi dell'anno scolastico 2021-22 e le nuove adozioni dei libri di testo sono state aggiunte!</span>
                </Paper>
                <Grid container style={{maxWidth: '1200px', width: 'initial', margin: '0 auto'}}>
                    <Grid item xs={12} sm={4} style={{marginTop: '15px'}} className='custom-grid-item'>
                        <Paper elevation={2} style={{padding: '10px', textAlign: 'center'}}>
                            <Typography variant="h2">
                                <CountUp end={this.state.books}/>
                            </Typography>
                            <Typography variant="subtitle1">libri in vendita</Typography>
                            <Divider style={{margin: '10px 0'}}/>
                            <NavLink to='/class-books' style={{textDecoration: 'none'}}>
                                <Button variant="outlined" color="primary">Cerca i libri della tua classe!</Button>
                            </NavLink>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4} style={{marginTop: '15px'}} className='custom-grid-item'>
                        <Paper elevation={2} style={{padding: '10px', textAlign: 'center'}}>
                            <Typography variant="h2">
                                <CountUp end={this.state.demands}/>
                            </Typography>
                            <Typography variant="subtitle1">domande create da te</Typography>
                            <Divider style={{margin: '10px 0'}}/>
                            <NavLink to='/demands' style={{textDecoration: 'none'}}>
                                <Button variant="outlined" color="primary">Visualizza le domande</Button>
                            </NavLink>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4} style={{marginTop: '15px'}} className='custom-grid-item'>
                        <Paper elevation={2} style={{padding: '10px', textAlign: 'center'}}>
                            <Typography variant="h2">
                                <CountUp end={this.state.supplies}/>
                            </Typography>
                            <Typography variant="subtitle1">offerte create da te</Typography>
                            <Divider style={{margin: '10px 0'}}/>
                            <NavLink to='/supplies' style={{textDecoration: 'none'}}>
                                <Button variant="outlined" color="primary">Visualizza le offerte</Button>
                            </NavLink>
                        </Paper>
                    </Grid>
                </Grid>

                <Snackbar open={this.state.snackBarOpen} autoHideDuration={6000} onClose={() => this.setState({snackBarOpen: false})}>
                    <Alert onClose={() => this.setState({snackBarOpen: false})} severity={this.state.snackBarSeverity}>
                        {this.state.snackBarMessage}
                    </Alert>
                </Snackbar>

            </>
        );
    }
}

const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default HomePage;
