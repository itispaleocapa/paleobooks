import React from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import api from "../api";
import TestPage from "../TestPage";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import CircularProgress from "@material-ui/core/CircularProgress";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Paper from "@material-ui/core/Paper";

class FindClassBooksPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {classes: [], _class: '', years: [], year: '', books: []};
    }

    componentDidMount() {
        api.request('/classes').then(res => {
            let classes = res.map((c) => c.name);
            classes = [...new Set(classes)];
            console.log(res);
            this.setState({rawClasses: res, classes: classes});
        })
    }

    handleClassChange = (event) => {
        this.setState({_class: event.target.value});
        let years = this.state.rawClasses.filter((c) => {
            return c.name == event.target.value
        }).map((c) => {
            return c.school_year;
        })
        this.setState({years: years, year: years[0]})
        this.updateBooksList(event.target.value, years[0]);
    }

    handleYearChange = (event) => {
        this.setState({year: event.target.value});
        this.updateBooksList(this.state._class, event.target.value);
    }

    updateBooksList = (_className, year) => {
        let _class = this.state.rawClasses.filter((c) => {
            return c.name == _className && c.school_year == year;
        })
        let classId = _class[0].id;
        api.request('/classes/' + classId + '/books').then(res => {
            this.setState({books: res});
        })
    }

    render() {
        if (this.state.classes.length == 0) return <div style={{margin: '20px auto', width: 'fit-content'}}><CircularProgress /></div>;
        return (
            <>
                <Typography variant="h5" style={{textAlign: 'center', marginTop: '15px'}}>
                    Cerca i libri della tua classe!
                </Typography>
                <div style={{width: 'fit-content', margin: '5px auto'}}>
                    <FormControl style={{width: '80px', marginRight: '5px'}}>
                        <InputLabel id="demo-simple-select-label">Classe</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            onChange={this.handleClassChange}
                            value={this.state._class}
                        >
                            {this.state.classes.map((item) => {
                                return <MenuItem value={item}>{item}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                    <FormControl style={{width: '160px', marginLeft: '5px'}}>
                        <InputLabel id="demo-simple-select-label">Anno scolastico</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            onChange={this.handleYearChange}
                            value={this.state.year}
                        >
                            {this.state.years.map((item) => {
                                return <MenuItem value={item}>{item}/{parseInt(item)+1}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                </div>
                {this.state.books.length > 0 ? <TableContainer component={Paper} style={{marginTop: '20px'}}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Immagine</TableCell>
                                <TableCell align="left">Titolo</TableCell>
                                <TableCell align="left">ISBN</TableCell>
                                <TableCell align="left">Prezzo</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.books.map((book) => (
                                <TableRow key={book.id}>
                                    <TableCell align="center"><img src={book.photo} height='100px'/></TableCell>
                                    <TableCell align="left">{book.title}</TableCell>
                                    <TableCell align="left">{book.isbn}</TableCell>
                                    <TableCell align="left">€{book.price}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer> : null}
            </>
        );
    }
}

export default FindClassBooksPage;