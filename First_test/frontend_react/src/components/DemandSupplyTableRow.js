import TableCell from "@material-ui/core/TableCell";
import Button from "@material-ui/core/Button";
import TableRow from "@material-ui/core/TableRow";
import React from "react";
import CreateDemandDialog from "../dialogs/CreateDemandDialog";
import BookInformationDialog from "../dialogs/BookInformationDialog";
import Link from "@material-ui/core/Link";

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
                <BookInformationDialog owner={(!this.props.showAllUsers || this.props.item.user.email === localStorage.getItem('user_email'))} book={{...this.props.item.book, userPrice: this.props.item.price, info: (this.props.item.info === undefined)? {cover: false, pen: false} : JSON.parse(this.props.item.info)}} open={this.state.supplyDialogOpen}
                                    handleClose={this.handeClose} type='supply'/>
            </TableRow>
        );
    }
}

export default DemandSupplyTableRow;
