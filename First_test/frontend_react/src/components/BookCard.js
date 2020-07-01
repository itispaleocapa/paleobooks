import React from "react";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import CreateDemandDialog from "../dialogs/CreateDemandDialog";
import CreateSupplyDialog from "../dialogs/CreateSupplyDialog";
import TableRow from "@material-ui/core/TableRow";

class BookCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {demandDialogOpen: false, supplyDialogOpen: false};
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

    render() {
        return (
            <Card style={{marginBottom: '20px'}}>
                {this.props.book.photo != null && <CardMedia
                    component="img"
                    alt={this.props.book.title}
                    height="140"
                    image={this.props.book.photo}
                    title={this.props.book.title}
                />}
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {this.props.book.title}
                    </Typography>
                    <Typography variant="body1" component="p" style={{float: 'left'}}>
                        €{this.props.book.price}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p" style={{marginTop: '2px', float: 'right'}}>
                        ISBN: {this.props.book.isbn}
                    </Typography>
                    <div style={{float: 'none', clear: 'both'}}/>
                </CardContent>
                <CardActions>
                    <Button size="small" color="primary" style={{marginLeft: '16px'}} onClick={this.handleDemandOpen}>
                        Cerca
                    </Button>
                    <Button size="small" color="primary" style={{marginLeft: 'auto', marginRight: '16px'}} onClick={this.handleSupplyOpen}>
                        Offri
                    </Button>
                </CardActions>
                <CreateDemandDialog book={this.props.book} open={this.state.demandDialogOpen} handleClose={this.handleDemandClose} />
                <CreateSupplyDialog book={this.props.book} open={this.state.supplyDialogOpen} handleClose={this.handleSupplyClose} />
            </Card>
        );
    }
}

export default BookCard;