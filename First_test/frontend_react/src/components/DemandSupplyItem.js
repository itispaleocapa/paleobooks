import React from "react";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import CircularProgress from "@material-ui/core/CircularProgress";
import api from "../api";

class DemandSupplyItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loading: true, name: '', email: '', md5email: '', price: 0.00};
    }

    componentDidMount() {
        if (this.props.type == 'supply') {
            api.request('/supplies/' + this.props.id).then((res) => {
                var md5 = require('md5');
                this.setState({loading: false, name: res.user.name, email: res.user.email, emailmd5: md5(res.user.email.toLowerCase()), price: res.price})
            })
        }
    }

    render() {
        if (this.state.loading) {
            return <div style={{margin: '20px auto', width: 'fit-content'}}><CircularProgress/></div>
        }
        return (
            <ListItem button onClick={()=> window.open('mailto:' + this.state.email, "_blank")} style={{padding: '6px 8px'}}>
                <ListItemAvatar>
                    <Avatar alt={this.state.name} src={"https://gravatar.com/avatar/" + '123456' + "?d=retro"}
                    />
                </ListItemAvatar>
                <ListItemText primary={<ItemText name={this.state.name} price={this.state.price} email={this.state.email}/>}  />
            </ListItem>
        );
    }
}

const ItemText = (props) => {
    return (
        <div>
            <p style={{float: 'left', marginTop: '8px'}}>{props.name}</p>
            <p style={{float: 'right', marginTop: '16px'}}>€ {parseFloat(props.price).toFixed(2)}</p>
            <p style={{float: 'left', clear: 'both', fontSize: '0.8em', color: '#555', marginTop: '-28px'}}>{props.email}</p>
        </div>
    );
}

export default DemandSupplyItem;