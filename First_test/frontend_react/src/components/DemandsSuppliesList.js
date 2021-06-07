import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import React from "react";
import DemandSupplyTableRow from "./DemandSupplyTableRow";
import DemandSupplyCard from "./DemandSupplyCard";
import TablePagination from "@material-ui/core/TablePagination";


class DemandsSuppliesList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {page: 0, rowsPerPage: 25, items: []};
    }

    componentDidMount() {
        this.setPage(0);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.items !== this.props.items) {
            this.setPage(this.state.page, this.state.rowsPerPage, false);
        }
    }

    handleChangePage = (e, page) => {
        this.setPage(page);
    }

    handleChangeRowsPerPage = (e) => {
        this.setState({rowsPerPage: parseInt(e.target.value)})
        this.setPage(0, e.target.value);
    }

    setPage = (page, rowsPerPage = this.state.rowsPerPage, scroll = true) => {
        if (scroll === true) {
            window.scroll({top: 0, left: 0, behavior: 'smooth' });
        }
        this.setState({page: page});
        let items = this.props.items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
        let count = 0;
        let timer = setInterval(() => {
            if (window.scrollY < 100 || count++ >= 50 || scroll !== true) {
                this.setState({items: items});
                clearInterval(timer);
            }
        }, 50)
    }

    render() {
        return (
            <>
                <TableContainer component={Paper} style={{marginTop: '20px'}} className='book-list-table-view'>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Immagine</TableCell>
                                <TableCell align="left">Titolo</TableCell>
                                <TableCell align="left">ISBN</TableCell>
                                <TableCell align="left">Prezzo{this.props.type === 'supplies' && ' di copertina'}</TableCell>
                                {this.props.type === 'supplies' && <TableCell align="left">Prezzo di vendita</TableCell>}
                                {this.props.showAllUsers ? <> {this.props.type === 'supplies'? <> <TableCell align="center">Utente</TableCell> <TableCell align="center">Azioni</TableCell></>: <TableCell align="center">Utente</TableCell>} </> : <> <TableCell align="center">Azioni</TableCell> </> }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.items.map((item) => (
                                <DemandSupplyTableRow key={item.id} item={item} type={this.props.type} refreshList={this.props.refreshList} showAllUsers={this.props.showAllUsers} />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <div style={{marginTop: '20px', display: 'none'}} className='book-list-card-view'>
                    {this.state.items.map((item) => (
                        <DemandSupplyCard key={item.id} item={item} type={this.props.type} refreshList={this.props.refreshList} showAllUsers={this.props.showAllUsers}/>
                    ))}
                </div>
                <TablePagination
                    component="div"
                    count={this.props.items.length}
                    page={this.state.page}
                    onChangePage={this.handleChangePage}
                    rowsPerPage={this.state.rowsPerPage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    backIconButtonText='Pagina precedente'
                    nextIconButtonText='Pagina successiva'
                    labelRowsPerPage='Righe'
                    labelDisplayedRows={({from, to, count}) => {
                        return from + "-" + to + " di " + count;
                    }}
                    style={{width: 'fit-content', margin: '5px auto 0'}}
                />
            </>
        )
    }
}

export default DemandsSuppliesList;
