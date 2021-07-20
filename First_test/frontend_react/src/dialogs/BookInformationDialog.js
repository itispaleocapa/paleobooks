import React from 'react';
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import AppBar from '@material-ui/core/AppBar';
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from '@material-ui/lab/Alert';

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
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Tooltip from '@material-ui/core/Tooltip';
import InfoIcon from '@material-ui/icons/Info';
import {withStyles} from '@material-ui/core/styles/';

import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import close from '../close.png';

import api from "../api";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Fade position="center" ref={ref} {...props} />;
});

const penStateValue = ['Appunti', 'Esercizi', 'Sia Appunti che Esercizi', 'Altro'];

const MarginLeftSwitch = withStyles({
    root: {
        marginLeft: 'auto'
    }
})(Switch);

const NoBackgroundSwitch = withStyles({
    root: {
        marginLeft: 'auto'
    },
    switchBase: {
        backgroundColor: 'transparent !important',
        marginLeft: 'auto'
    },
    input: {
        cursor: 'default !important'
    }
})(Switch);

class BookInformationDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loading: true, userSupply: false, cover: false, pen: false, penState: '', price: 0, description: '', img: [], imgUp: [], images: this.props.book?.info?.img? this.props.book.info.img : [], currentImage: this.props.book.photo};
        this.inputRef = React.createRef();
    }  

    getItems = (loading = true) => {
        this.setState({loading: loading});
        api.request('/supplies').then((res) => {

            if (res.length >= 1) {
                let Prices = []
                res.forEach(val => {
                        if (val.book.id === this.props.book.id) {
                            if (val.user.id !== parseInt(localStorage.getItem('user_id'))) {
                                Prices = [...Prices, parseFloat(val.price)]
                            }
                        }
                    }
                )

                let average = (Prices.length === 1? Prices[0] : 0)

                if (Prices.length > 1) {
                    average = Prices.reduce((a, b) => a + b)/Prices.length
                    let averageDeciaml = String(average).split(parseInt(average) + ".")[1]
                    average = (parseInt(averageDeciaml.length > 1? averageDeciaml : averageDeciaml + '0') < 50)? parseInt(average) + '.00' : parseInt(average) + '.50'
                }

                this.setState({
                    minPrice: Math.min.apply(Math, Prices) !== Infinity? Math.min.apply(Math, Prices) : null,
                    maxPrice: Math.max.apply(Math, Prices) !== -Infinity? Math.max.apply(Math, Prices) : null,
                    price: average,
                    supplyCount: Prices.length
                });
            }
        })
    }

    loadDemands = () => {
        this.getItems()

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
                        const userInfo = JSON.parse(this.state.userSupply.info);
                        this.setState({
                            currentImage: this.props.book.photo,
                            loading: false,
                            img: userInfo.img? userInfo.img : [],
                            cover: userInfo.cover,
                            pen: userInfo.pen,
                            price: this.state.userSupply.price,
                            penState: userInfo.penState,
                            description: userInfo.description,
                        });

                    } else {
                        this.setState({
                            loading: false,
                            currentImage: this.props.book.photo,
                            img: []
                        })
                    }

                } else {
                    this.setState({
                        loading: false,
                        cover: false,
                        pen: false
                    });
                }

                let newArray = [];
                let newImgArray = this.state.images;
                for (let val of this.state.img) {          
                    newArray = [...newArray, {'encode' : false}]
                    if (!newImgArray.includes(val)) {
                        newImgArray = [...newImgArray, val]
                    }
                }

                this.setState({imgUp: newArray, images: newImgArray})
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
            img: this.state.imgUp,
            info: JSON.stringify({
                id: this.props.book.id,
                img: this.state.img.splice(null),
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
        supply.img = this.state.imgUp;
        supply.info = {
            img: this.state.img.splice(null),
            pen: this.state.pen,
            cover: this.state.cover,
            penState: this.state.penState,
            description: this.state.description
        };

        api.request('/supplies/' + this.state.userSupply.id, 'PUT', JSON.stringify(supply)).then(() => {

            this.setState({
                snackBarOpen: true,
                snackBarSeverity: 'success',
                snackBarMessage: 'Annuncio modificato correttamente!',
                images: []
            });

            this.props.update(supply);
            this.props.handleClose();
            this.loadDemands();

        }).catch((res) => {
            this.setState({snackBarOpen: true, snackBarSeverity: 'error', snackBarMessage: res});
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

    handlePriceChange = (event) => this.setState({price: event.target.value});

    handleChange = name => (event) => {
        this.setState({[name]: event.target.checked});
        
        if (name === 'pen' && !event.target.checked) this.setState({penState: ''});
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

    getBase64 = file => {
        return new Promise(resolve => {

            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {

                this.state.imgUp.push({
                    encode: reader.result,
                    type: file.type.split('/')[1]
                });

                resolve(reader.result);          
            };
        });
    }

    handleImg = (event) => {      
        let prevState = this.state;

        for (let i = 0; i < event.target.files.length; i++) {

            if (!['image/jpeg', 'image/png', 'image/jpg'].includes(event.target.files[i].type)) {
                this.setState({
                    snackBarOpen: true,
                    snackBarSeverity: 'warning',
                    snackBarMessage: 'Tipologia file non supportata'
                });
                return;
            }

            if (event.target.files[i].size/977 <= 10415 && prevState.img.length + event.target.files.length - i <= 3) {
                this.getBase64(event.target.files[i]);
                let val = prevState.img[prevState.img.length-1];
                val = (val)? parseInt(val.split('-')[2].split('.')[0])+1 : 1
                prevState = {
                    ...prevState,
                    img: [
                        ...prevState.img,
                        parseInt(localStorage.getItem('user_id')) + '-' + this.props.book.id + '-' + val + '.jpeg'
                    ],
                    images: [
                        ...prevState.images,
                        URL.createObjectURL(event.target.files[i]),
                    ]  
                }

            } else {
                event.target.files = null
                prevState = {
                    ...prevState,
                    snackBarOpen: true,
                    snackBarSeverity: 'warning',
                    snackBarMessage: (event.target.files[i].size/977 <= 10415)? 'Puoi caricare massimo 3 allegati' : 'La grandezza massima è di 10MB a immagine'
                }
            }
        }
        this.setState(prevState);
    }

    removeImage = (event) => {
        let newImg = this.state.img
        let newImgUp = this.state.imgUp
        let newImages = this.state.images
        let object = this.state.currentImage.includes('blob')? this.state.currentImage : this.state.currentImage.split('/')[4]
        let key = newImages.indexOf(object)
        newImgUp.splice(key, 1)
        newImages.splice(key, 1)
        newImg.splice(key, 1)

        this.setState({
            currentImage: this.props.book.photo,
            img: newImg,
            imgUp: newImgUp,
            images: newImages
        });
    }

    imgName = name => {

        if (!name) {
            this.state.img.pop('undefined')
            return
        }

        if (name.includes('static')) {
            return name.split('/')[3].split('.')[0] + "." + name.split('.')[2]
        }
    }

    imgShow = (event) => this.setState({currentImage: event.target.src});

    render() {
        return (
            <>
                <Dialog onEnter={() => this.loadDemands()} open={this.props.open} TransitionComponent={Transition} maxWidth={false} className="book-info-dialog"> 
                    <AppBar className="dialog-title-text-ellipsis" style={{position: 'relative'}}>
                        <Toolbar style={{maxWidth: '817px'}} className="book-info-dialog-header">
                            <IconButton edge="start" color="inherit" onClick={this.props.handleClose} aria-label="close">
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="h6" noWrap>{this.props.book.title}</Typography>
                        </Toolbar>
                    </AppBar>
                    
                    <DialogContent style={{display: 'flex', flexWrap: 'none', gap: '20px'}} className="book-info-dialog-content">
                        
                        {(this.props.owner && this.state.loading)? (
                            <div style={{margin: '20px auto', width: 'fit-content'}}><CircularProgress/></div>
                        ) : (
                            <>
                                <div style={{display: 'flex'}}>
                                    <div style={{display: 'flex', flexFlow: 'column', gap: '20px'}}>
                                        <img src={this.props.book.photo} style={Object.assign({}, {maxWidth: '50px', marginTop: '10px', borderRadius: '5px', cursor: 'pointer', transition: 'all .1s ease'}, (this.props.book.photo === this.state.currentImage)? {border: 'solid 2px #3f51b5', boxShadow: '0 0 7px 2px #3f51b5'} : {border: 'solid 2px #dedede'})} onClick={this.imgShow} alt=""/>

                                        {this.state.images.map(image => {
                                            const thisImage = (image.includes("blob"))? image : process.env.REACT_APP_IMAGES_URL + '/' + image;
                                            
                                            return <img src={thisImage} style={(thisImage === this.state.currentImage)? {
                                                maxWidth: '50px',
                                                borderRadius: '5px',
                                                cursor: 'pointer',
                                                border: 'solid 2px #3f51b5',
                                                boxShadow: '0 0 7px 2px #3f51b5',
                                                transition: 'all .1s ease'
                                            } : {
                                                maxWidth: '50px',
                                                borderRadius: '5px',
                                                cursor: 'pointer',
                                                border: 'solid 2px #dedede',
                                                transition: 'all .1s ease'
                                            }} onClick={this.imgShow} alt=""/>
                                        })}

                                        {(this.state.images.length < 3 && this.props.owner)? <svg onClick={() => this.inputRef.current.click()} style={{width: '40px', cursor: 'pointer', alignSelf: 'center'}} class="MuiSvgIcon-root jss79" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg> : null}

                                    </div>

                                    <div style={{height: '350px', minWidth: '300px', textAlign: 'center'}}>
                                        {!this.state.currentImage?.includes('amazon') && this.props.owner?
                                        <img src={close} onClick={this.removeImage} style={{position: 'absolute', left: '365px', marginTop: '5px', zIndex: '1', height: '22px', cursor: 'pointer' }} alt="remove"/>
                                        : null
                                    }

                                        <img style={{maxHeight: '350px', maxWidth: '300px', position: 'relative', top: '50%', transform: 'translateY(-50%)'}} src={this.state.currentImage} alt="img"/>
                                    </div>
                                </div>

                                <div>
                                    {this.props.owner?
                                        <>
                                            <span style={{display: 'inline', verticalAlign: 'middle', fontSize: '17px', textDecoration: 'line-through'}}>€{this.props.book.price}</span><br/>

                                            <FormControl variant="outlined" style={{marginTop: '8px'}}>
                                                <InputLabel htmlFor="outlined-adornment-amount">Prezzo di vendita</InputLabel>
                                                <OutlinedInput id="outlined-adornment-amount"
                                                            onChange={(e) => this.handlePriceChange(e)}
                                                            type="number"
                                                            startAdornment={<InputAdornment position="start">€</InputAdornment>}
                                                            labelWidth={125}
                                                            value={this.state.price}
                                                            onKeyPress={this.handleKeyPress}
                                                            style={{marginBottom: '10px'}}
                                                />

                                                <div style={{display: 'flex', alignItems: 'center'}}>
                                                    Copertina protettiva
                                                    <MarginLeftSwitch
                                                        checked={this.state.cover}
                                                        onChange={this.handleChange('cover')}
                                                        color="primary"
                                                    />
                                                </div>

                                                <div style={{display: 'flex', alignItems: 'center'}}>
                                                    Scrittura in penna / evidenziature
                                                    <MarginLeftSwitch
                                                        checked={this.state.pen}
                                                        onChange={this.handleChange('pen')}
                                                        color="primary"
                                                    />
                                                </div>
                                                <FormControl disabled={!this.state.pen}>
                                                    <FormHelperText>Cosa è scritto in penna?</FormHelperText>
                                                    <Select value={this.state.penState} onChange={(event) => this.setState({penState: event.target.value})}>
                                                        <MenuItem value={0}>{penStateValue[0]}</MenuItem>
                                                        <MenuItem value={1}>{penStateValue[1]}</MenuItem>
                                                        <MenuItem value={2}>{penStateValue[2]}</MenuItem>
                                                        <MenuItem value={3}>{penStateValue[3]}</MenuItem>
                                                    </Select>
                                                </FormControl>

                                                <TextField variant="outlined" style={{marginTop: '20px', width: '400px', maxWidth: '90vw'}} value={this.state.description} onChange={(event) => this.setState({description: event.target.value})} inputProps={{maxLength: 200, rows: 4}} label="Descrizione del libro" multiline rows={1}/><label style={(200 - this.state.description.length <= 10)? ({color:'red'}) : null}>{this.state.description.length}/200</label>

                                                <input ref={this.inputRef} accept="image/png, image/jpeg" type="file" style={{display: 'none'}} multiple onChange={this.handleImg}/>
                                            </FormControl>
                                        </>
                                    : 
                                        <div style={{width: '400px', height: '96%', maxWidth: '90vw', display: 'flex', flexDirection: 'column'}}>  
                                            <div style={{display: 'flex'}}>
                                                <div>
                                                    <span style={{display: 'inline', verticalAlign: 'middle', fontSize: '17px', textDecoration: 'line-through'}}>€{this.props.book.price}</span><br/>
                                                    <span style={{fontSize: '30px', fontWeight: 'bold', position: 'relative', top: '-5px'}}>€{this.props.book.userPrice}</span><br />
                                                </div>
                                                <div style={{marginLeft: 'auto', fontSize: '15px'}}>
                                                    ISBN: {this.props.book.isbn}<br/>
                                                </div>
                                            </div>
                                            <div style={{display: 'flex', alignItems: 'center'}}>
                                                Copertina protettiva
                                                <NoBackgroundSwitch
                                                    checked={this.props.book.info.cover}
                                                    color="primary"
                                                    disableRipple
                                                />
                                            </div>

                                            <div style={{display: 'flex', alignItems: 'center'}}>
                                                Scrittura in penna / evidenziature
                                                {(this.props.book.info.penState !== '')? (
                                                    <Tooltip title={penStateValue[this.props.book.info.penState]} arrow={true} style={{marginLeft: '5px'}} placement="top">
                                                        <IconButton size="small">
                                                            <InfoIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                ) : null}
                                                <NoBackgroundSwitch
                                                    checked={this.props.book.info.pen}
                                                    color="primary"
                                                    disableRipple
                                                />
                                            </div>
                                            {(this.props.book.info.description === '')? null : (
                                                <Typography style={{marginTop: '10px'}}>{this.props.book.info.description}</Typography>
                                            )}

                                            <div style={{display: 'flex', alignItems: 'center', margin: 'auto 0 -15px 0'}}>
                                                Contatta l'offerente
                                                <div style={{marginLeft: 'auto'}}>
                                                    <Link href={'mailto:' + this.props.book.email}>{this.props.book.email}</Link>
                                                    <IconButton style={{marginLeft: '10px'}} onClick={() => {
                                                        navigator.clipboard.writeText(this.props.book.email);
                                                        this.setState({snackBarOpen: true, snackBarSeverity: 'success', snackBarMessage: 'Email copiata negli appunti!'})
                                                    }}>
                                                        <FileCopyOutlinedIcon/>
                                                    </IconButton>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    <br/>
                                </div>
                            </>
                        )}
                    </DialogContent>
                    
                    <DialogActions>
                        {this.props.owner?
                            <>
                                {(this.state.userSupply === null)?
                                    <Button autoFocus onClick={this.createSupply} color="primary">Crea annuncio </Button>
                                : 
                                    <>
                                        <Button onClick={this.deleteSupply} color="secondary">Elimina annuncio</Button>
                                        <Button autoFocus onClick={this.updateSupply} color="primary">Salva annuncio</Button>
                                    </>
                                }
                            </> : null}
                        
                        <Button onClick={this.props.handleClose} color="primary">Chiudi</Button>
                    </DialogActions>
                </Dialog>

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

export default BookInformationDialog;