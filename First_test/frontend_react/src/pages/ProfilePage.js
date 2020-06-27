import React from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import api from "../api";
import TestPage from "../TestPage";

class ProfilePage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <Typography variant="h4" style={{textAlign: 'center', marginTop: '15px'}}>
                    Questa è la pagina del profilo
                </Typography>
            </>
        );
    }
}

export default ProfilePage;