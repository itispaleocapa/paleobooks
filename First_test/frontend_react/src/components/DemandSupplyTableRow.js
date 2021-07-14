import TableCell from "@material-ui/core/TableCell";
import Button from "@material-ui/core/Button";
import TableRow from "@material-ui/core/TableRow";
import React from "react";
import CreateDemandDialog from "../dialogs/CreateDemandDialog";
import CreateSupplyDialog from "../dialogs/CreateSupplyDialog";
import Link from "@material-ui/core/Link";

class DemandSupplyTableRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {demandDialogOpen: false, supplyDialogOpen: false, book: {...this.props.item.book, userPrice: this.props.item.price, info: (this.props.item.info === undefined)? {cover: false, pen: false} : JSON.parse(this.props.item.info)}};
    }

    handleOpen = () => {
        this.setState({[this.props.type === 'demands' ? 'demandDialogOpen' : 'supplyDialogOpen']: true});
    }

    handeClose = () => {
        this.setState({[this.props.type === 'demands' ? 'demandDialogOpen' : 'supplyDialogOpen']: false});
        this.props.refreshList();
    }

    update = (newSupply) => {

        Object.keys(newSupply).forEach(val => {
            if (Object.keys(this.state.book).includes(val) && val !== 'price') {
                this.setState({[val]: newSupply.val})
            }
        });
    }

    render() {
        return (
            <TableRow key={this.props.item.book.id}>
                <TableCell align="center"><img src={this.props.item.book.photo} height='100px' alt='book cover'/></TableCell>
                <TableCell align="left">{this.props.item.book.title}</TableCell>
                <TableCell align="left">{this.props.item.book.isbn}</TableCell>
                <TableCell align="left">€{this.props.item.book.price}</TableCell>
                {this.props.type === 'supplies' && <TableCell align="left">€{this.props.item.price}</TableCell>}
                {this.props.showAllUsers ?
                    <>    
                        <TableCell align="center">
                            {this.props.item.user.name}<br/>
                            <Link href={'mailto:' + this.props.item.user.email} target='_blank'>{this.props.item.user.email}</Link>
                        </TableCell> 

                        {this.props.type === "supplies"?
                        <>

                        <TableCell align="center">
                            <Button variant="outlined" color="primary" style={{margin: '4px'}} onClick={this.handleOpen}>
                                Dettagli
                            </Button>
                        </TableCell>

                        </>:<></>}
                    </>:
                    <TableCell align="center">
                        <Button variant="outlined" color="primary" style={{margin: '4px'}} onClick={this.handleOpen}>
                            Dettagli
                        </Button>
                    </TableCell>
                }

                

                <CreateDemandDialog book={this.props.item.book} open={this.state.demandDialogOpen}
                                    handleClose={this.handeClose} type='demand'/>
                <CreateSupplyDialog owner={!this.props.showAllUsers} book={this.state.book} open={this.state.supplyDialogOpen}
                                    update={this.update} handleClose={this.handeClose} type='supply'/>
            </TableRow>
        );
    }
}

export default DemandSupplyTableRow;
