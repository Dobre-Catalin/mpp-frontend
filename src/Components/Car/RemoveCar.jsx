import * as React from 'react';
import PropTypes from 'prop-types';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import TableHead from "@mui/material/TableHead";

export default function RemoveCar({ removeFunction, cars }) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleRemoveCar = (index) => {
        const carIndex = page * rowsPerPage + index;
        const carToRemove = cars[index];
        const confirmDelete = window.confirm(`Are you sure you want to remove ${carToRemove.make} ${carToRemove.model} from the list?`);
        if (confirmDelete) {
            removeFunction(carIndex);
        }
    }



    const emptyRows = rowsPerPage - Math.min(rowsPerPage, cars.length - page * rowsPerPage);

    const tableHeight = emptyRows > 0 ? "auto" : "100%";


    return (
        <>
            <div>
                <h1>List of current cars</h1>
                <h2>Press directly on the table to delete</h2>
                <h4>Then confirm your selection</h4>
                <br />
                <br />
            </div>
            <div>
                <TableContainer component={Paper} style={{ height: tableHeight }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Make</TableCell>
                                <TableCell>Model</TableCell>
                                <TableCell>Year</TableCell>
                                <TableCell>Price</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cars.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((car, index) => (
                                <TableRow key={index} onClick={() => handleRemoveCar(index)}>
                                    <TableCell>{car.make}</TableCell>
                                    <TableCell>{car.model}</TableCell>
                                    <TableCell>{car.year}</TableCell>
                                    <TableCell>{car.price}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={cars.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </div>
        </>
    );
}

RemoveCar.propTypes = {
    removeFunction: PropTypes.func.isRequired,
    cars: PropTypes.array.isRequired,
};
