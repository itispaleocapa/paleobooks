import React from "react";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import CircularProgress from "@material-ui/core/CircularProgress";
import api from "../api";
import BookInformationDialog from '../dialogs/BookInformationDialog'

class DemandSupplyItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loading: true, name: '', email: '', emailmd5: '', price: 0.00, handleOpen: false};
    }

    componentDidMount() {
        if (this.props.type === 'supply') {
            api.request('/supplies/' + this.props.id).then((res) => {
                var md5 = require('md5');
                this.setState({
                    loading: false,
                    name: res.user.name,
                    email: res.user.email,
                    emailmd5: md5(res.user.email.toLowerCase()),
                    price: res.price,
                    book: {
                        ...res.book,
                        userPrice: res.price,
                        name: res.user.name,
                        email: res.user.email,
                        info: JSON.parse(res.info)
                    }
                })
            })
        } else if (this.props.type === 'demand') {
            api.request('/demands/' + this.props.id).then((res) => {
                var md5 = require('md5');
                this.setState({
                    loading: false,
                    name: res.user.name,
                    email: res.user.email,
                    emailmd5: md5(res.user.email.toLowerCase()),
                    price: res.price
                })
            })
        }
    }

    render() {
        if (this.state.loading) {
            return <div style={{margin: '0 auto', height: '56px', width: 'fit-content'}}><CircularProgress/></div>
        }
        return (
            <>
                <ListItem button onClick={() => this.setState({handleOpen: true})}
                        style={{padding: '4px', height: '56px'}}>
                    <ListItemAvatar>
                        <Avatar alt={this.state.name}
                                src={"https://gravatar.com/avatar/" + this.state.emailmd5 + "?d=retro"}
                        />
                    </ListItemAvatar>
                    <ListItemText
                        primary={<ItemText name={this.state.name} price={this.state.price} email={this.state.email}/>}/>
                </ListItem>

                <BookInformationDialog open={this.state.handleOpen} book={this.state.book} handleClose={() => this.setState({handleOpen: false})}/>
            </>
        );
    }
}

const ItemText = (props) => {
    return (
        <div>
            <p style={{float: 'left', marginTop: '8px'}}>{props.name}</p>
            {props.price != null ? <>
                    <p style={{float: 'right', marginTop: '16px'}}>€ {parseFloat(props.price).toFixed(2)}</p>
                    <p style={{
                        float: 'left',
                        clear: 'both',
                        fontSize: '0.8em',
                        color: '#555',
                        marginTop: '-28px'
                    }}>{props.email}</p>
                </> :
                <p style={{
                    float: 'left',
                    clear: 'both',
                    fontSize: '0.8em',
                    color: '#555',
                    marginTop: '-22px'
                }}>{props.email}</p>
            }
        </div>
    );
}

export default DemandSupplyItem;
