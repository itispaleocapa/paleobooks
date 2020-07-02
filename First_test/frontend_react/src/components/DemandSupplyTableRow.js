import TableCell from "@material-ui/core/TableCell";
import Button from "@material-ui/core/Button";
import TableRow from "@material-ui/core/TableRow";
import React from "react";
import CreateDemandDialog from "../dialogs/CreateDemandDialog";
import CreateSupplyDialog from "../dialogs/CreateSupplyDialog";

class DemandSupplyTableRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {demandDialogOpen: false, supplyDialogOpen: false};
    }

    handleOpen = () => {
        this.setState({[this.props.type === 'demands' ? 'demandDialogOpen' : 'supplyDialogOpen']: true});
    }

    handeClose = () => {
        this.setState({[this.props.type === 'demands' ? 'demandDialogOpen' : 'supplyDialogOpen']: false});
        this.props.refreshList();
    }

    render() {
        return (
            <TableRow key={this.props.item.book.id}>
                <TableCell align="center"><img src={this.props.item.book.photo} height='100px'/></TableCell>
                <TableCell align="left">{this.props.item.book.title}</TableCell>
                <TableCell align="left">{this.props.item.book.isbn}</TableCell>
                <TableCell align="left">€{this.props.item.book.price}</TableCell>
                {this.props.type === 'supplies' && <TableCell align="left">€{this.props.item.price}</TableCell>}
                <TableCell align="center">
                    <Button variant="outlined" color="primary" style={{margin: '4px'}} onClick={this.handleOpen}>
                        Dettagli
                    </Button>
                </TableCell>
                <CreateDemandDialog book={this.props.item.book} open={this.state.demandDialogOpen}
                                    handleClose={this.handeClose} type='demand'/>
                <CreateSupplyDialog book={this.props.item.book} open={this.state.supplyDialogOpen}
                                    handleClose={this.handeClose} type='supply'/>
            </TableRow>
        );
    }
}

export default DemandSupplyTableRow;