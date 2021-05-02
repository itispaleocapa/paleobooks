import React from "react";
import Typography from "@material-ui/core/Typography";
import api from "../api";
import CircularProgress from "@material-ui/core/CircularProgress";
import DemandsSuppliesList from "../components/DemandsSuppliesList";
import Alert from "@material-ui/lab/Alert";
import {NavLink} from "react-router-dom";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import AlertTitle from "@material-ui/lab/AlertTitle";

class DemandsSuppliesPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loading: true, items: [], itemsFiltered: [], query: '', showAllUsers: false, tooShort: false};
    }

    componentDidMount = () => {
        this.getItems(true);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.type !== prevProps.type) {
            this.getItems(true);
        }
    }

    getItems = (loading = false, allUsers = this.state.showAllUsers) => {
        this.setState({loading: loading});
        api.request('/' + this.props.type + (allUsers ? '' : '/user')).then((res) => {
            this.setState({items: res});
            this.updateBooksList();
        })
    }

    handleSwitchChange = (value = null) => {
        let switchValue = (value !== null ? value : !this.state.showAllUsers);
        this.setState({showAllUsers: switchValue});
        this.getItems(true, switchValue);
    }

    handleQueryChange = (e) => {
        let query = e.target.value;
        if (query.length === 0) {
            clearTimeout(this.state.timer);
            this.setState({itemsFiltered: this.state.items, loading: false, query: query, tooShort: false})
            return;
        }
        this.setState({loading: true, query: query});
        if (query.length < 4 || (query.substr(0, 4) === '9788' && query.length !== 13)) {
            clearTimeout(this.state.timer);
            this.setState({
                timer: setTimeout(() => {
                    this.setState({itemsFiltered: [], tooShort: true, loading: false});
                }, 1500)
            });
        } else {
            clearTimeout(this.state.timer);
            this.setState({
                timer: setTimeout(() => {
                    this.updateBooksList(query);
                }, 1500)
            });
            this.setState({tooShort: false});
        }
    }

    updateBooksList = (query = this.state.query) => {
        if (this.state.showAllUsers === true) {
            api.request('/' + this.props.type + '?search=' + query).then((res) => {
                this.setState({itemsFiltered: res, loading: false});
            })
        } else {
            let books = this.state.items.filter((b) => {
                return b.book.title.toLowerCase().includes(query.toLowerCase()) || b.book.isbn === query;
            })
            this.setState({itemsFiltered: books, loading: false})
        }
    }

    render() {
        return (
            <div>
                <Typography variant="h5" style={{textAlign: 'center', marginTop: '10px'}}>
                    {this.props.type === 'demands' ? 'Domande' : 'Offerte'}
                </Typography>
                <div style={{textAlign: 'center'}}>
                    <FormControlLabel style={{display: 'inline-block', margin: '0px'}}
                                      label={'le tue ' + (this.props.type === 'demands' ? 'domande' : 'offerte')}
                                      control={<></>}
                                      onClick={() => this.handleSwitchChange(false)}
                    />
                    <Switch
                        checked={this.state.showAllUsers}
                        onChange={() => this.handleSwitchChange(null)}
                        name="checkedB"
                        color="primary"
                    />
                    <FormControlLabel style={{display: 'inline-block', margin: '0px'}}
                                      control={<></>}
                                      onClick={() => this.handleSwitchChange(true)}
                                      label={'tutte le ' + (this.props.type === 'demands' ? 'domande' : 'offerte')}
                    />
                    <FormControl style={{display: 'block', marginTop: '6px'}}>
                        <TextField id="standard-basic" label="Filtra per titolo o ISBN"
                                   onChange={this.handleQueryChange} variant='outlined'/>
                    </FormControl>
                </div>
                {(this.state.tooShort && this.state.loading === false && (this.state.showAllUsers !== false || this.state.items.length !== this.state.itemsFiltered.length)) ?
                    <Alert severity="warning" style={{maxWidth: '500px', margin: '15px auto'}}>
                        <AlertTitle>Attenzione</AlertTitle>
                        Devi inserire almeno <strong>4 caratteri</strong> oppure il
                        codice <strong>ISBN</strong> completo!
                    </Alert> : ((this.state.itemsFiltered.length === 0 && this.state.loading === false && (this.state.showAllUsers !== false || this.state.items.length !== this.state.itemsFiltered.length)) ?
                        <Alert severity="error" style={{maxWidth: '300px', margin: '15px auto'}}>
                            <AlertTitle>Attenzione</AlertTitle>
                            Nessun libro trovato.
                        </Alert> : (this.state.loading === false && this.state.showAllUsers !== false && this.state.items.length !== this.state.itemsFiltered.length &&
                            <Alert severity="info" style={{maxWidth: '300px', margin: '15px auto'}}>
                                {this.state.itemsFiltered.length === 1 ? 'È stato trovato' : 'Sono stati trovati'}
                                &nbsp;
                                <strong>{this.state.itemsFiltered.length}</strong> libr{this.state.itemsFiltered.length === 1 ? 'o' : 'i'}.
                            </Alert>))}
                {this.state.loading === true ?
                    <div style={{margin: '30px auto', width: 'fit-content'}}><CircularProgress/></div> :
                    ((this.state.itemsFiltered.length > 0) ?
                            <DemandsSuppliesList items={this.state.itemsFiltered} type={this.props.type}
                                                 refreshList={this.getItems} showAllUsers={this.state.showAllUsers}/> :
                            (this.state.showAllUsers === false && this.state.items.length === 0 &&
                                <Alert severity="info" style={{maxWidth: '600px', margin: '15px auto'}}>
                                    Attualmente non hai
                                    nessuna {this.props.type === 'demands' ? 'domanda' : 'offerta'}.<br/>
                                    Consulta la lista dei <NavLink to='/class-books' style={{color: '#3f51b5'}}>libri
                                    della tua classe</NavLink> oppure <NavLink to='/books' style={{color: '#3f51b5'}}>cerca
                                    un libro per titolo o ISBN</NavLink>.
                                </Alert>)
                    )
                }
            </div>
        )
    }
}

export default DemandsSuppliesPage;
