import React from "react";
import Typography from "@material-ui/core/Typography";
import api from "../api";
import CircularProgress from "@material-ui/core/CircularProgress";
import BooksList from "../components/BooksList";
import DemandsSuppliesList from "../components/DemandsSuppliesList";
import Alert from "@material-ui/lab/Alert";
import Link from "@material-ui/core/Link";
import {NavLink} from "react-router-dom";

class DemandsSuppliesPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loading: true, items: []};
    }

    componentDidMount = () => {
        this.getItems(true);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.type != prevProps.type) {
            this.getItems(true);
        }
    }

    getItems = (loading = false) => {
        this.setState({loading: loading});
        api.request('/' + this.props.type + '/user').then((res) => {
            this.setState({items: res, loading: false});
        })
    }

    render() {
        return (
            <div>
                <Typography variant="h5" style={{textAlign: 'center', marginTop: '10px'}}>
                    {this.props.type === 'demands' ? 'Domande' : 'Offerte'}
                </Typography>
                {this.state.loading === true ?
                    <div style={{margin: '30px auto', width: 'fit-content'}}><CircularProgress/></div> :
                    (this.state.items.length > 0 ?
                            <DemandsSuppliesList items={this.state.items} type={this.props.type}
                                                 refreshList={this.getItems}/> :
                            <Alert severity="info" style={{maxWidth: '600px', margin: '15px auto'}}>
                                Attualmente non hai
                                nessuna {this.props.type === 'demands' ? 'domanda' : 'offerta'}.<br/>
                                Consulta la lista dei <NavLink to='/class-books' style={{color: '#3f51b5'}}>libri della tua
                                classe</NavLink> oppure <NavLink to='/books' style={{color: '#3f51b5'}}>cerca un libro per titolo
                                o ISBN</NavLink>.
                            </Alert>
                    )
                }
            </div>
        )
    }
}

export default DemandsSuppliesPage;