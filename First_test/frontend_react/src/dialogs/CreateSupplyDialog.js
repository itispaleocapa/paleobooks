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
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import OutlinedInput from "@material-ui/core/OutlinedInput";


class CreateSupplyDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loading: true, demands: [], userSupply: null, price: 0};
    }

    loadDemands = () => {
        api.request('/books/' + this.props.book.id + '/demands').then((res) => {
            this.setState({
                demands: res.filter((s) => {
                    return s.user_id != localStorage.getItem('user_id');
                })
            });
            api.request('/books/' + this.props.book.id + '/supplies').then((res) => {
                let userSupplies = res.filter((s) => {
                    return s.user_id == localStorage.getItem('user_id');
                })
                if (userSupplies.length > 0) {
                    this.setState({userSupply: userSupplies[0]});
                }
                else {
                    this.setState({userSupply: null});
                }
                this.setState({loading: false});
            })
        })
    }

    createSupply = () => {
        if (parseFloat(this.state.price) < 0) {
            this.setState({
                snackBarOpen: true,
                snackBarSeverity: 'warning',
                snackBarMessage: 'Il prezzo non può essere inferiore a 0'
            });
            return;
        }
        if (parseFloat(this.state.price) > this.props.book.price) {
            this.setState({
                snackBarOpen: true,
                snackBarSeverity: 'warning',
                snackBarMessage: 'Il prezzo non può essere superiore a €' + this.props.book.price
            });
            return;
        }
        api.request('/supplies', 'POST', JSON.stringify({
            book_id: this.props.book.id,
            price: parseFloat(this.state.price)
        })).then(() => {
            this.setState({
                snackBarOpen: true,
                snackBarSeverity: 'success',
                snackBarMessage: 'Annuncio creato correttamente!'
            });
            this.props.handleClose();
        }).catch((res) => {
            if (res.error == "You already have a supply for this book.") {
                res.error = "Hai già un annuncio di vendita per questo libro."
            }
            this.setState({snackBarOpen: true, snackBarSeverity: 'error', snackBarMessage: res.error});
            this.props.handleClose();
        });
    }

    deleteSupply = () => {
        if (this.state.userSupply === null) {
            return;
        }
        api.request('/supplies/' + this.state.userSupply.id, 'DELETE').then(() => {
            this.setState({
                snackBarOpen: true,
                snackBarSeverity: 'success',
                snackBarMessage: 'Annuncio eliminato correttamente!',
                userSupply: null
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

    handlePriceChange = (event) => {
        this.setState({price: event.target.value});
    }

    render() {
        return (
            <>
                <Dialog onClose={this.handleClose} aria-labelledby="customized-dialog-title" open={this.props.open}
                        onEnter={this.loadDemands}>
                    <DialogTitle className="dialog-title-text-ellipsis" onClose={this.handleClose}>
                        {this.props.book.title}
                    </DialogTitle>
                    <DialogContent dividers>
                        {this.state.loading ?
                            <div style={{margin: '20px auto', width: 'fit-content'}}><CircularProgress/></div> : (
                                <>
                                    {this.state.demands.length > 0 ?
                                        <>
                                            <DemandSupplyUsers users={this.state.demands} type='demand'/>
                                            <Divider style={{margin: '8px 0 12px'}}/>
                                            {this.state.userSupply === null ? <><Typography gutterBottom>
                                                Oppure crea un annuncio per essere contattato da altri possibili
                                                acquirenti.
                                            </Typography>
                                                <Typography gutterBottom>
                                                    Verrà condiviso il tuo nome e l'indirizzo
                                                    email <i>{localStorage.getItem('user_email')}</i>.<br/>
                                                    Se non è corretto, modificalo dal tuo <NavLink to="/profile"
                                                                                                   style={{color: '#0000ee'}}>profilo</NavLink>.
                                                </Typography>
                                            </> : null}
                                        </> : (this.state.userSupply === null ? <><Typography gutterBottom>
                                            Vuoi vendere questo libro?<br/>
                                            Crea un annuncio per essere contattato dai possibili acquirenti!
                                        </Typography>
                                            <Typography gutterBottom>
                                                Verrà condiviso il tuo nome e l'indirizzo
                                                email <i>{localStorage.getItem('user_email')}</i>.<br/>
                                                Se non è corretto, modificalo dal tuo <NavLink to="/profile"
                                                                                               style={{color: '#0000ee'}}>profilo</NavLink>.
                                            </Typography>
                                        </> : null)}
                                    {this.state.userSupply !== null ? <Typography gutterBottom>
                                        Hai già un annuncio di vendita per questo libro al prezzo
                                        di <b>€{this.state.userSupply.price}</b>. Se l'hai già venduto e non ti serve
                                        più, clicca sul pulsante qui sotto per eliminarlo.
                                    </Typography> : null}
                                </>)
                        }
                        {this.state.userSupply === null ?
                            <FormControl fullWidth variant="outlined" style={{marginTop: '8px'}}>
                                <InputLabel htmlFor="outlined-adornment-amount">Prezzo di vendita</InputLabel>
                                <OutlinedInput id="outlined-adornment-amount"
                                               onChange={(e) => this.handlePriceChange(e)}
                                               type="number"
                                               defaultValue={0}
                                               startAdornment={<InputAdornment position="start">€</InputAdornment>}
                                               labelWidth={125}/>
                            </FormControl> : null}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.props.handleClose} color="primary">
                            Annulla
                        </Button>
                        {this.state.userSupply === null ? <Button autoFocus onClick={this.createSupply} color="primary">
                            Crea annuncio
                        </Button> : <Button autoFocus onClick={this.deleteSupply} color="secondary">
                            Elimina annuncio
                        </Button>
                        }
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

export default CreateSupplyDialog;