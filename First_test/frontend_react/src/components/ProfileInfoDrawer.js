import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import React from "react";
import api from "../api";


class ProfileInfoDrawer extends React.Component {
    constructor() {
        super();
        this.state = {emailmd5: ''};
    }

    componentDidMount() {
        this.updateAvatar();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps !== this.props) {
            this.updateAvatar();
        }
    }

    updateAvatar = () => {
        var md5 = require('md5');
        this.setState({emailmd5: md5(this.props.profile.email.toLowerCase())})
    }

    render() {
        return (<>
                <Avatar alt={this.state.name} src={"https://gravatar.com/avatar/" + this.state.emailmd5 + "?d=retro"}
                        style={{width: '56px', height: '56px'}}/>
                <Typography variant="subtitle1" gutterBottom style={{marginTop: '0.4rem', marginBottom: '-0.3rem'}}>
                    {this.props.profile.name}
                </Typography>
                <Typography variant="caption" gutterBottom>
                    {this.props.profile.email}
                </Typography>
            </>
        );
    }
}

export default ProfileInfoDrawer;