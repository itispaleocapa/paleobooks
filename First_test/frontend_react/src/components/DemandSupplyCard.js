import React from "react";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import CreateDemandDialog from "../dialogs/CreateDemandDialog";
import BookInformationDialog from "../dialogs/BookInformationDialog";

class DemandSupplyCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {demandDialogOpen: false, supplyDialogOpen: false, book: {...this.props.item.book, email: this.props.item.user?.email, userPrice: this.props.item.price, info: this.props.type === 'supply'? this.props.item.info: false}};
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
            if ( Object.keys(this.state.book).includes(val) && val !== 'price' && val !== 'id') {
                this.setState({[val]: newSupply.val})
            }
        });
    }

    render() {
        return (
            <Card style={{marginBottom: '20px'}}>
                {this.props.item.book.photo != null && <CardMedia
                    component="img"
                    alt={this.props.item.book.title}
                    height="140"
                    image={this.props.item.book.photo}
                    title={this.props.item.book.title}
                />}
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {this.props.item.book.title}
                    </Typography>
                    {this.props.type === 'supplies' ?
                        <Typography variant="body1" component="p" style={{float: 'left'}}>
                            <span
                                style={{textDecoration: 'line-through'}}><i>€{this.props.item.book.price}</i></span>&nbsp;
                            <span>€{this.props.item.price}</span>
                        </Typography>
                        : <span></span>}
                    <Typography variant="body2" color="textSecondary" component="p"
                                style={this.props.type === 'supplies' ? {marginTop: '2px', float: 'right'} : {marginTop: '2px', textAlign: 'center'}}>
                        ISBN: {this.props.item.book.isbn}
                    </Typography>
                    <div style={{float: 'none', clear: 'both'}}/>
                </CardContent>
                <CardActions>
                    <Button size="small" color="primary" style={{margin: '0 auto'}} onClick={this.handleOpen}>
                        Dettagli
                    </Button>
                </CardActions>
                <CreateDemandDialog book={this.props.item.book} open={this.state.demandDialogOpen}
                                    handleClose={this.handeClose} type='demand'/>
                <BookInformationDialog update={this.update} owner={!this.props.showAllUsers} book={this.state.book} open={this.state.supplyDialogOpen}
                                    handleClose={this.handeClose} type='supply'/>
            </Card>
        );
    }
}

export default DemandSupplyCard;
