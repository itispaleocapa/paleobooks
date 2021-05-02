import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

class AboutUsPerson extends React.Component {
    render() {
        return (
            <div style={{display: 'inline-block', width: '165px', margin: '12px'}} className='about-us-person-box'>
                <Avatar style={{width: '70%', height: 'auto', margin: '6px auto 3px'}} alt={this.props.developer.name} src={'https://avatars.githubusercontent.com/' + this.props.developer.github} />
                <Typography variant="subtitle1" gutterBottom>
                    {this.props.developer.name}
                </Typography>
            </div>
        );
    }
}

export default AboutUsPerson;
