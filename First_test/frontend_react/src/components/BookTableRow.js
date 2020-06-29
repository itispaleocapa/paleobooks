import TableCell from "@material-ui/core/TableCell";
import Button from "@material-ui/core/Button";
import TableRow from "@material-ui/core/TableRow";
import React from "react";
import DemandDialog from "../dialogs/DemandDialog";

class BookTableRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {demandDialogOpen: false};
    }

    handleDemandOpen = () => {
        this.setState({demandDialogOpen: true});
    }

    handleDemandClose = () => {
        this.setState({demandDialogOpen: false});
    }

    render() {
        return (
            <TableRow key={this.props.book.id}>
                <TableCell align="center"><img src={this.props.book.photo} height='100px'/></TableCell>
                <TableCell align="left">{this.props.book.title}</TableCell>
                <TableCell align="left">{this.props.book.isbn}</TableCell>
                <TableCell align="left">€{this.props.book.price}</TableCell>
                <TableCell align="center">
                    <Button variant="outlined" color="primary" style={{margin: '4px'}} onClick={this.handleDemandOpen}>
                        Cerca
                    </Button>
                    <Button variant="outlined" color="primary" style={{margin: '4px'}}>
                        Offri
                    </Button>
                </TableCell>
                <DemandDialog book={this.props.book} open={this.state.demandDialogOpen} handleClose={this.handleDemandClose} />
            </TableRow>
        );
    }
}

export default BookTableRow;