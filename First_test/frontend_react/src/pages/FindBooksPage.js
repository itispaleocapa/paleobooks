import React from "react";
import Typography from "@material-ui/core/Typography";
import api from "../api";
import FormControl from "@material-ui/core/FormControl";
import CircularProgress from "@material-ui/core/CircularProgress";
import BooksList from "../components/BooksList";
import TextField from "@material-ui/core/TextField";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";

class FindBooksPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {books: [], tooShort: false, timer: null, loading: null};
    }

    componentDidMount() {

    }

    handleQueryChange = (e) => {
        this.setState({loading: true});
        let query = e.target.value;
        if (query.trim().length < 4 || (query.trim().substr(0, 4) === '9788' && query.trim().length !== 13)) {
            clearTimeout(this.state.timer);
            this.setState({
                timer: setTimeout(() => {
                    this.setState({books: [], tooShort: true, loading: false});
                }, 800)
            });
        }
        else {
            clearTimeout(this.state.timer);
            this.setState({
                timer: setTimeout(() => {
                    this.updateBooksList(query.trim());
                }, 300)
            });
            this.setState({tooShort: false});
        }
    }

    updateBooksList = (query) => {
        api.request('/books?search=' + encodeURIComponent(query)).then(res => {
            this.setState({books: res, loading: false});
        })
    }

    render() {
        return (
            <>
                <Typography variant="h5" style={{textAlign: 'center', marginTop: '10px'}}>
                    Inserisci il titolo o il codice ISBN
                </Typography>
                <div style={{width: 'fit-content', margin: '5px auto'}}>
                    <FormControl style={{width: '100%'}}>
                        <TextField id="standard-basic" label="Ricerca libri" onChange={this.handleQueryChange}/>
                    </FormControl>
                </div>
                {(this.state.tooShort && this.state.loading === false) ? <Alert severity="warning" style={{maxWidth: '500px', margin: '15px auto'}}>
                    <AlertTitle>Attenzione</AlertTitle>
                    Devi inserire almeno <strong>4 caratteri</strong> oppure il codice <strong>ISBN</strong> completo!
                </Alert> : ((this.state.books.length === 0 && this.state.loading === false) ?
                    <Alert severity="error" style={{maxWidth: '300px', margin: '15px auto'}}>
                        <AlertTitle>Attenzione</AlertTitle>
                        Nessun libro trovato.
                    </Alert> : (this.state.loading === false &&
                        <Alert severity="info" style={{maxWidth: '300px', margin: '15px auto'}}>
                            {this.state.books.length === 1 ? 'È stato trovato' : 'Sono stati trovati'}
                            &nbsp;<strong>{this.state.books.length}</strong> libr{this.state.books.length === 1 ? 'o' : 'i'}.
                        </Alert>))}
                {this.state.loading === true ?
                    <div style={{margin: '30px auto', width: 'fit-content'}}><CircularProgress/></div> :
                    (this.state.books.length > 0 ? <BooksList books={this.state.books}/> : null)}
            </>
        );
    }
}

export default FindBooksPage;
