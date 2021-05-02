import React from "react";
import Typography from "@material-ui/core/Typography";
import api from "../api";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import CircularProgress from "@material-ui/core/CircularProgress";
import BooksList from "../components/BooksList";

class FindClassBooksPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {classes: [], _class: '', years: [], year: '', books: [], loading: false};
    }

    componentDidMount() {
        api.request('/classes').then(res => {
            let classes = res.map((c) => c.name);
            classes = [...new Set(classes)].sort();
            this.setState({rawClasses: res, classes: classes});
            let userClass = localStorage.getItem('user_class');
            if (userClass.length > 0 && classes.includes(userClass)) {
                this.setState({_class: userClass});
                this.updateYears(userClass);
            }
        })
    }

    handleClassChange = (event) => {
        this.setState({_class: event.target.value});
        this.updateYears(event.target.value);
    }

    handleYearChange = (event) => {
        this.setState({year: event.target.value});
        this.updateBooksList(this.state._class, event.target.value);
    }

    updateYears = (_className) => {
        if (this.state.rawClasses == null) return;
        let years = this.state.rawClasses.filter((c) => {
            return c.name === _className;
        }).map((c) => {
            return c.school_year;
        })
        this.setState({years: years, year: years[0]})
        this.updateBooksList(_className, years[0]);
    }

    updateBooksList = (_className, year) => {
        this.setState({loading: true});
        let _class = this.state.rawClasses.filter((c) => {
            return c.name === _className && c.school_year === year;
        })
        let classId = _class[0].id;
        api.request('/classes/' + classId + '/books').then(res => {
            this.setState({books: res, loading: false});
        })
    }

    render() {
        if (this.state.classes.length === 0)
            return <div style={{margin: '20px auto', width: 'fit-content'}}><CircularProgress/></div>;
        return (
            <>
                <Typography variant="h5" style={{textAlign: 'center', marginTop: '10px'}}>
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
                                return <MenuItem value={item}>{item}/{parseInt(item) + 1}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                </div>
                {this.state.loading === true ?
                    <div style={{margin: '30px auto', width: 'fit-content'}}><CircularProgress/>
                    </div> : (this.state.books.length > 0 ? <BooksList books={this.state.books}/> : null)}
            </>
        );
    }
}

export default FindClassBooksPage;
