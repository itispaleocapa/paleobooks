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
import TableCell from "@material-ui/core/TableCell";

class DemandSupplyCard extends React.Component {
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
                            <span style={{textDecoration: 'line-through'}}><i>€{this.props.item.book.price}</i></span>&nbsp;
                            <span>€{this.props.item.price}</span>
                        </Typography>
                        : <span></span>}
                    <Typography variant="body2" color="textSecondary" component="p"
                                style={{marginTop: '2px', float: 'right'}}>
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
                <CreateSupplyDialog book={this.props.item.book} open={this.state.supplyDialogOpen}
                                    handleClose={this.handeClose} type='supply'/>
            </Card>
        );
    }
}

export default DemandSupplyCard;