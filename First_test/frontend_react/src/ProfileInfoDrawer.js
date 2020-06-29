import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import React from "react";
import api from "./api";


class ProfileInfoDrawer extends React.Component {
    constructor() {
        super();
        this.state = {name: '', email: '', emailmd5: ''};
    }

    componentDidMount() {
        api.request('/users/profile').then(res => {
            var md5 = require('md5');
            this.setState({name: res.name, email: res.email, emailmd5: md5(res.email.toLowerCase())})
        })
    }

    render() {
        return (<>
                <Avatar alt="Remy Sharp" src={"https://gravatar.com/avatar/" + this.state.emailmd5 + "&d=identicon"}
                        style={{width: '56px', height: '56px'}}/>
                <Typography variant="subtitle1" gutterBottom style={{marginTop: '0.4rem', marginBottom: '-0.3rem'}}>
                    {this.state.name}
                </Typography>
                <Typography variant="caption" gutterBottom>
                    {this.state.email}
                </Typography>
            </>
        );
    }
}

export default ProfileInfoDrawer;