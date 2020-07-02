import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Typography from "@material-ui/core/Typography";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import api from "../api";
import Link from "@material-ui/core/Link";
import {NavLink} from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import DemandSupplyItem from "../components/DemandSupplyItem";
import Divider from "@material-ui/core/Divider";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from '@material-ui/lab/Alert';
import DemandSupplyUsers from "../components/DemandSupplyUsers";


class CreateDemandDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loading: true, supplies: [], userDemand: null};
    }

    loadSupplies = () => {
        api.request('/books/' + this.props.book.id + '/supplies').then((res) => {
            this.setState({
                supplies: res.filter((s) => {
                    return s.user_id != localStorage.getItem('user_id');
                })
            })
            api.request('/books/' + this.props.book.id + '/demands').then((res) => {
                let userDemands = res.filter((s) => {
                    return s.user_id == localStorage.getItem('user_id');
                })
                if (userDemands.length > 0) {
                    this.setState({userDemand: userDemands[0]});
                } else {
                    this.setState({userDemand: null});
                }
                this.setState({loading: false});
            })
        })
    }

    createDemand = () => {
        api.request('/demands', 'POST', JSON.stringify({book_id: this.props.book.id})).then(() => {
            this.setState({
                snackBarOpen: true,
                snackBarSeverity: 'success',
                snackBarMessage: 'Annuncio creato correttamente!'
            });
            this.props.handleClose();
        }).catch((res) => {
            if (res.error == "You already have a demand for this book.") {
                res.error = "Hai già un annuncio per questo libro."
            }
            this.setState({snackBarOpen: true, snackBarSeverity: 'error', snackBarMessage: res.error});
            this.props.handleClose();
        });
    }

    deleteDemand = () => {
        if (this.state.userDemand === null) {
            return;
        }
        api.request('/demands/' + this.state.userDemand.id, 'DELETE').then(() => {
            this.setState({
                snackBarOpen: true,
                snackBarSeverity: 'success',
                snackBarMessage: 'Annuncio eliminato correttamente!',
                userDemand: null
            });
            this.props.handleClose();
        }).catch((res) => {
            this.setState({snackBarOpen: true, snackBarSeverity: 'error', snackBarMessage: res.error});
            this.props.handleClose();
        });
    }

    handleClose = () => {
        this.props.handleClose();
    }

    handleSnackbarClose = () => {
        this.setState({snackBarOpen: false});
    }

    render() {
        return (
            <>
                <Dialog onClose={this.handleClose} aria-labelledby="customized-dialog-title" open={this.props.open}
                        onEnter={this.loadSupplies} fullScreen={window.innerWidth < 550}>
                    <DialogTitle className="dialog-title-text-ellipsis" onClose={this.handleClose}>
                        {this.props.book.title}
                    </DialogTitle>
                    <DialogContent dividers>
                        {this.state.loading ?
                            <div style={{margin: '20px auto', width: 'fit-content'}}><CircularProgress/></div> : (
                                <>
                                    {this.state.supplies.length > 0 ?
                                        <>
                                            <DemandSupplyUsers users={this.state.supplies} type='supply'/>
                                            <Divider style={{margin: '8px 0 12px'}}/>
                                            {this.state.userDemand === null ? <><Typography gutterBottom>
                                                Oppure crea un annuncio per essere contattato da altri venditori.
                                            </Typography>
                                                <Typography gutterBottom>
                                                    Verrà condiviso il tuo nome e l'indirizzo
                                                    email <i>{localStorage.getItem('user_email')}</i>.<br/>
                                                    Se non è corretto, modificalo dal tuo <NavLink to="/profile"
                                                                                                   style={{color: '#0000ee'}}>profilo</NavLink>.
                                                </Typography>
                                            </> : null}
                                        </> :
                                        (this.state.userDemand === null ? <>
                                                <Typography gutterBottom>
                                                    Sei interessato ad acquistare questo libro?<br/>
                                                    Crea un annuncio per essere contattato dai possibili venditori!
                                                </Typography>
                                                <Typography gutterBottom>
                                                    Verrà condiviso il tuo nome e l'indirizzo
                                                    email <i>{localStorage.getItem('user_email')}</i>.<br/>
                                                    Se non è corretto, modificalo dal tuo <NavLink to="/profile"
                                                                                                   style={{color: '#0000ee'}}>profilo</NavLink>.
                                                </Typography>
                                            </> :
                                            null)}
                                    {this.state.userDemand !== null ?
                                        (this.props.type !== 'demand' ?
                                            <Typography gutterBottom>
                                                Hai già un annuncio per questo libro. Se l'hai già acquistato e non ti
                                                serve
                                                più, clicca sul pulsante qui sotto per eliminarlo.
                                            </Typography> :
                                            <>
                                                {this.state.supplies.length == 0 &&
                                                <Typography gutterBottom>
                                                    Attualmente non c'è nessun utente che sta vendendo questo libro.
                                                </Typography>}
                                                <Typography gutterBottom>
                                                    Se l'hai già acquistato clicca sul pulsante qui sotto per eliminare
                                                    l'annuncio.
                                                </Typography>
                                            </>)
                                        : null}
                                </>)
                        }
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.props.handleClose} color="primary">
                            Chiudi
                        </Button>
                        {this.state.userDemand === null && this.props.type !== 'demand' ?
                            <Button autoFocus onClick={this.createDemand} color="primary">
                                Crea annuncio
                            </Button> : <Button autoFocus onClick={this.deleteDemand} color="secondary">
                                Elimina annuncio
                            </Button>}
                    </DialogActions>

                </Dialog>
                <Snackbar open={this.state.snackBarOpen} autoHideDuration={6000} onClose={this.handleSnackbarClose}>
                    <Alert onClose={this.handleSnackbarClose} severity={this.state.snackBarSeverity}>
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

export default CreateDemandDialog;