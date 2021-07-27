import TableCell from "@material-ui/core/TableCell";
import Button from "@material-ui/core/Button";
import TableRow from "@material-ui/core/TableRow";
import React from "react";
import CreateDemandDialog from "../dialogs/CreateDemandDialog";
import CreateSupplyDialog from "../dialogs/CreateSupplyDialog";

class BookTableRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {demandDialogOpen: false, supplyDialogOpen: false, book: this.props.book};
    }

    handleDemandOpen = () => {
        this.setState({demandDialogOpen: true});
    }

    handleDemandClose = () => {
        this.setState({demandDialogOpen: false});
    }

    handleSupplyOpen = () => {
        this.setState({supplyDialogOpen: true});
    }

    handleSupplyClose = () => {
        this.setState({supplyDialogOpen: false});
    }

    update = (newSupply) => {
        Object.keys(newSupply).forEach(val => {
            if ( Object.keys(this.state.book).includes(val) && val !== 'price' && val !== 'id') {
                this.setState({[val]: newSupply.val})
            }
        });
    }

    render() {
        return (
            <TableRow key={this.props.book.id}>
                <TableCell align="center"><img src={this.props.book.photo} height='100px' alt='book cover'/></TableCell>
                <TableCell align="left">{this.props.book.title}</TableCell>
                <TableCell align="left">{this.props.book.isbn}</TableCell>
                <TableCell align="left">€{this.props.book.price}</TableCell>
                <TableCell align="center">
                    <Button variant="outlined" color="primary" style={{margin: '4px'}} onClick={this.handleDemandOpen}>
                        Cerca
                    </Button>
                    <Button variant="outlined" color="primary" style={{margin: '4px'}} onClick={this.handleSupplyOpen}>
                        Offri
                    </Button>
                </TableCell>
                <CreateDemandDialog book={this.props.book} open={this.state.demandDialogOpen} handleClose={this.handleDemandClose} />
                <CreateSupplyDialog owner={true} update={this.update} book={this.props.book} open={this.state.supplyDialogOpen} handleClose={this.handleSupplyClose} />
            </TableRow>
        );
    }
}

export default BookTableRow;
