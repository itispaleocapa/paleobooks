import React from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import api from "../api";

class HomePage extends React.Component {
    constructor(props) {
        super(props);
    }

    handleLogout = () => {
        api.logout();
        this.props.checkLogin();
    }

    render() {
        return (
            <>
                <Typography variant="h4" style={{textAlign: 'center', marginTop: '15px'}}>
                    Ciao, sono la home page!
                </Typography>
                <Button variant="contained" color="secondary" style={{margin: '10px auto', display: 'block'}}
                        onClick={this.handleLogout}>Logout</Button>
            </>
        );
    }
}

export default HomePage;