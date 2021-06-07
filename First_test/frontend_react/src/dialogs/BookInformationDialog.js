import React from 'react';
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import AppBar from '@material-ui/core/AppBar';
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import DialogActions from "@material-ui/core/DialogActions";
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import Fade from '@material-ui/core/Fade';
import CircularProgress from "@material-ui/core/CircularProgress";

import InputAdornment from "@material-ui/core/InputAdornment";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Switch from '@material-ui/core/Switch';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';

import api from "../api";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Fade position="center" ref={ref} {...props} />;
});

const penStateValue = ['Appunti', 'Esercizi', 'Sia Appunti che esercizi', 'Altro'];

class BookInformationDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loading: true, userSupply: false, cover: false, pen: false, penState: '', price: 0, description: ''}
    }

    loadDemands = () => {
        api.request('/books/' + this.props.book.id + '/demands').then((res) => {
            this.setState({
                demands: res.filter((s) => {
                    return s.user_id !== parseInt(localStorage.getItem('user_id'));
                })
            });

            api.request('/books/' + this.props.book.id + '/supplies').then((res) => {
                let userSupplies = res.filter((s) => {
                    return s.user_id === parseInt(localStorage.getItem('user_id'));
                })

                if (userSupplies.length > 0) {
                    this.setState({userSupply: userSupplies[0]});

                } else {
                    this.setState({userSupply: null});
                }

                if (this.state.userSupply !== null) {

                    if (this.state.userSupply.info !== null) {
                        this.setState({
                            loading: false,
                            cover: JSON.parse(this.state.userSupply.info).cover,
                            pen: JSON.parse(this.state.userSupply.info).pen,
                            penState: JSON.parse(this.state.userSupply.info).penState,
                            description: JSON.parse(this.state.userSupply.info).description
                        });
                        
                    } else {
                        this.setState({
                            loading: false
                        })
                    }

                } else {
                    this.setState({
                        loading: false,
                        cover: false,
                        pen: false
                    });
                }

            })
        })
    }

    createSupply = () => {
        if (parseFloat(this.state.price) < 0) {
            this.setState({
                snackBarOpen: true,
                snackBarSeverity: 'warning',
                snackBarMessage: 'Il prezzo non può essere inferiore a 0€'
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
            price: parseFloat(this.state.price),
            info: JSON.stringify({
                pen: this.state.pen,
                cover: this.state.cover,
                penState: this.state.penState,
                description: this.state.description
            })  
            
        })).then(() => {
            this.setState({
                snackBarOpen: true,
                snackBarSeverity: 'success',
                snackBarMessage: 'Annuncio creato correttamente!'
            });

            this.props.handleClose();
            this.loadDemands();
            
        }).catch((res) => {
            
            if (res.error === "You already have a supply for this book.") {
                res.error = "Hai già un annuncio di vendita per questo libro."
            }
            
            this.setState({snackBarOpen: true, snackBarSeverity: 'error', snackBarMessage: res.error});
            this.props.handleClose();
            
        });
    }

    updateSupply = () => {
        if (parseFloat(this.state.price) < 0) {
            this.setState({
                snackBarOpen: true,
                snackBarSeverity: 'warning',
                snackBarMessage: 'Il prezzo non può essere inferiore a 0€'
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

        if (this.state.userSupply === null) {
            return;
        }

        let supply = this.state.userSupply;
        supply.price = this.state.price;
        supply.info = {
            pen: this.state.pen,
            cover: this.state.cover,
            penState: this.state.penState,
            description: this.state.description
        };

        console.log(supply);

        api.request('/supplies/' + this.state.userSupply.id, 'PUT', JSON.stringify(supply)).then(() => {

            this.setState({
                snackBarOpen: true,
                snackBarSeverity: 'success',
                snackBarMessage: 'Annuncio modificato correttamente!',
            });

            this.props.handleClose();
            this.loadDemands();

        }).catch((res) => {
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

    handlePriceChange = (event) => {
        this.setState({price: event.target.value});
    }

    handleChange = name => (event) => {
        this.setState({[name]: event.target.checked});
        
        if (name === 'pen' && !event.target.checked) {
            this.setState({penState: ''})
        }
    } 

    handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            if (this.state.userSupply === null) {
                this.createSupply();
            } else {
                this.updateSupply();
            }
        }
    }

    render() {

        return (
            <>
                <Dialog onEnter={() => this.props.owner? this.loadDemands() : null} open={this.props.open} TransitionComponent={Transition}>
                    <AppBar className="dialog-title-text-ellipsis" style={{position: 'relative'}}>
                        <Toolbar>
                            <IconButton edge="start" color="inherit" onClick={this.props.handleClose} aria-label="close">
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="h6" noWrap>{this.props.book.title}</Typography>
                        </Toolbar>
                    </AppBar>
                    
                    <DialogContent style={{display: 'flex', flexWrap: 'none', gap: '20px'}}>
                        
                        {(this.props.owner && this.state.loading)? (
                            <div style={{margin: '20px auto', width: 'fit-content'}}><CircularProgress/></div>
                        ) : (

                            <>
                                <img height="350px" src={this.props.book.photo}/><br/>
                            
                                <div>
                                    <span style={{display: 'inline', verticalAlign: 'middle', fontSize: '17px', textDecoration: 'line-through'}}>€{this.props.book.price}</span><br/>

                                    {this.props.owner? (
                                        <>
                                        <FormControl variant="outlined" style={{marginTop: '8px'}}>
                                            <InputLabel htmlFor="outlined-adornment-amount">Prezzo di vendita</InputLabel>
                                            <OutlinedInput id="outlined-adornment-amount"
                                                        onChange={(e) => this.handlePriceChange(e)}
                                                        type="number"
                                                        defaultValue={(this.state.userSupply !== null)? this.state.userSupply.price : 0}
                                                        startAdornment={<InputAdornment position="start">€</InputAdornment>}
                                                        labelWidth={125}
                                                        onKeyPress={this.handleKeyPress}
                                                        style={{marginBottom: '10px'}}
                                            />

                                            Copertina protettiva:
                                            <Switch
                                                checked={this.state.cover}
                                                onChange={this.handleChange('cover')}
                                                color="primary"
                                            />

                                            Scrittura in penna:
                                            <Switch
                                                checked={this.state.pen}
                                                onChange={this.handleChange('pen')}
                                                color="primary"
                                            />

                                            <FormControl disabled={!this.state.pen}>
                                                <FormHelperText>Cosa è scritto in penna?</FormHelperText>
                                                <Select value={this.state.penState} onChange={(event) => this.setState({penState: event.target.value})}>
                                                    <MenuItem value={0}>{penStateValue[0]}</MenuItem>
                                                    <MenuItem value={1}>{penStateValue[1]}</MenuItem>
                                                    <MenuItem value={2}>{penStateValue[2]}</MenuItem>
                                                    <MenuItem value={3}>{penStateValue[3]}</MenuItem>
                                                </Select>
                                            </FormControl>

                                            <TextField variant="outlined" style={{marginTop: '20px'}} value={this.state.description} onChange={(event) => this.setState({description: event.target.value})} inputProps={{maxLength: 200}} label="Descrizione del libro" multiline rows={1}/><label style={(200 - this.state.description.length <= 10)? ({color:'red'}) : null}>{this.state.description.length}/200</label>

                                            {/* <input accept="image/*" type="file" multiple/> */}

                                        </FormControl>

                                    </>

                                    ) : 
                                        <>

                                        {console.log(this.props)}
                                        
                                        
                                            <span style={{fontSize: '30px', fontWeight: 'bold', position: 'relative', top: '-5px'}}>€{this.props.book.userPrice}</span><br />
                                            Copertina: {this.props.book? 'si':'no'}<br/>
                                            ISBN: {this.props.book.isbn}<br/>
                                            Scritto in penna: {this.props.book.info.pen? 'si':'no'}<br/>
                                            {(this.props.book.info.pen)? (
                                                <>
                                                    Tipo penna: {penStateValue[this.props.book.info.penState]}<br/>
                                                </>
                                            ):(
                                                null
                                            )}

                                            Descrizione: {this.props.book.info.description}<br/>
                                            <button onClick={() => window.open('mailto:' + this.props.book.email, "_blank")}>CONTATTA L'OFFERENTE</button>
                                        </>
                                    }
                                    <br/>
                                </div>

                            </>
                            
                        )}

                    </DialogContent>
                    
                    <DialogActions>
                        {this.props.owner? (
                            <>
                                {(this.state.userSupply === null)? (
                                    <Button autoFocus onClick={this.createSupply} color="primary">
                                        Crea annuncio
                                    </Button>
                                ) : (
                                    <>
                                        <Button onClick={this.deleteSupply} color="secondary">
                                            Elimina annuncio
                                        </Button>
                                        <Button autoFocus onClick={this.updateSupply} color="primary">
                                            Salva annuncio
                                        </Button>
                                    </>
                                )}
                            </>
                        ) : null}
                        
                        <Button onClick={this.props.handleClose} color="primary">
                            Chiudi
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

export default BookInformationDialog;