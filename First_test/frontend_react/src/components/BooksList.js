import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import BookTableRow from "./BookTableRow";
import TableContainer from "@material-ui/core/TableContainer";
import React from "react";
import BookCard from "./BookCard";


class BooksList extends React.Component {
    constructor(props) {
        super(props);
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
                                <TableCell align="left">Prezzo</TableCell>
                                <TableCell align="center">Azioni</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.props.books.map((book) => (
                                <BookTableRow key={book.id} book={book}/>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <div style={{marginTop: '20px', display: 'none'}} className='book-list-card-view'>
                    {this.props.books.map((book) => (
                        <BookCard key={book.id} book={book}/>
                    ))}
                </div>
            </>
        )
    }
}

export default BooksList;