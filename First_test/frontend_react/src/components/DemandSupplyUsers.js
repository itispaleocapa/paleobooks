import * as React from "react";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import DemandSupplyItem from "./DemandSupplyItem";


class DemandSupplyUsers extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <Typography gutterBottom>
                    {this.props.users.length == 1 ? <>C'è <b>1</b> utente che {this.props.type == 'supply' ? 'sta' : 'vuole'}</> : <>Ci
                        sono <b>{this.props.users.length}</b> utenti che {this.props.type == 'supply' ? 'stanno' : 'vogliono'}</>}
                    &nbsp;{this.props.type == 'supply' ? 'vendendo' : 'acquistare'} questo libro,
                    contattal{this.props.users.length == 1 ? 'o' : 'i'} se sei interessato.
                </Typography>
                <List style={{margin: '-16px 0'}}>
                    {this.props.users.map(i => {
                        return <DemandSupplyItem id={i.id} type={this.props.type}/>
                    })}
                </List>
            </>
        )
    }
}

export default DemandSupplyUsers;