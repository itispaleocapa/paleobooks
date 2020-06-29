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


class DemandDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loading: true, supplies: []};
    }

    loadSupplies = () => {
        api.request('/books/' + this.props.book.id + '/supplies').then((res) => {
            this.setState({loading: false, supplies: res});
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
                        onEnter={this.loadSupplies}>
                    <DialogTitle className="dialog-title-text-ellipsis" onClose={this.handleClose}>
                        {this.props.book.title}
                    </DialogTitle>
                    <DialogContent dividers>
                        {this.state.loading ?
                            <div style={{margin: '20px auto', width: 'fit-content'}}><CircularProgress/></div> : (
                                this.state.supplies.length > 0 ?
                                    <>
                                        <Typography gutterBottom>
                                            {this.state.supplies.length == 1 ? <>C'è <b>1</b> utente che sta</> : <>Ci
                                                sono <b>{this.state.supplies.length}</b> utenti che stanno</>}
                                            &nbsp;vendendo questo libro,
                                            contattal{this.state.supplies.length == 1 ? 'o' : 'i'} se sei interessato.
                                        </Typography>
                                        <List style={{margin: '-16px 0'}}>
                                            {this.state.supplies.map(i => {
                                                return <DemandSupplyItem id={i.id} type='supply'/>
                                            })}
                                        </List>
                                        <Divider style={{margin: '8px 0 12px'}}/>
                                        <Typography gutterBottom>
                                            Oppure crea un annuncio per essere contattato da altri venditori.
                                        </Typography>
                                        <Typography gutterBottom>
                                            Verrà condiviso il tuo nome e l'indirizzo
                                            email <i>{localStorage.getItem('user_email')}</i>.<br/>
                                            Se non è corretto, modificalo dal tuo <NavLink to="/profile"
                                                                                           style={{color: '#0000ee'}}>profilo</NavLink>.
                                        </Typography>
                                    </> :
                                    <>
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
                                    </>)
                        }
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.props.handleClose} color="primary">
                            Annulla
                        </Button>
                        <Button autoFocus onClick={this.createDemand} color="primary">
                            Crea annuncio
                        </Button>
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

export default DemandDialog;