import axios from 'axios';
import React, { use } from 'react'
import { useEffect } from 'react'
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Button } from '@mui/joy';
import { useNavigate } from 'react-router-dom';
import { ClimbingBoxLoader } from 'react-spinners';

// === Load server URL from environment ===
const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function BookingHistory() {
    const accessToken = sessionStorage.getItem('accessToken');
    const deviceId = sessionStorage.getItem('deviceId');
    const [bookingHistory, setBookingHistory] = React.useState([]);
    const navigator = useNavigate();
    const [loadder, setLoader] = React.useState(false);

    useEffect(() => {
        setLoader(true);
        const fetchPaymentInformation = async () => {
            try {
                // 1️⃣ Get user details
                const userData = await axios.get(`${serverUrl}`, {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Device-Id': deviceId
                    }
                });
                const userId = userData.data?.user?._id;

                // 2️⃣ Get bookings for the user
                const { data: bookings } = await axios.get(`${serverUrl}/booking/user/${userId}`);

                if (!bookings?.data || bookings?.data.length === 0) {
                    console.warn("No bookings found for user");
                    return;
                }

                // 3️⃣ For each booking, fetch its payment info
                const bookingsWithPayments = await Promise.all(
                    bookings.data.map(async (booking) => {
                        try {
                            const { data: paymentInfo } = await axios.get(
                                `${serverUrl}/payment/${booking.paymentId}`
                            );
                            return { ...booking, paymentDetails: paymentInfo };
                        } catch (err) {
                            console.error(`Error fetching payment for booking ${booking._id}`, err);
                            return { ...booking, paymentDetails: null };
                        }
                    })
                );

                // 4️⃣ Save in state
                setBookingHistory(bookingsWithPayments);

                console.log("Bookings with Payments:", bookingsWithPayments);

            } catch (error) {
                console.error("Error fetching payment information:", error);
            }
            finally {
                setLoader(false);
            }
        };

        fetchPaymentInformation();
    }, []);

    const columns = [
        { id: 'payid', label: 'Payment Number', minWidth: 170 },
        { id: 'startdate', label: 'Start Date', minWidth: 100 },
        {
            id: 'enddate',
            label: 'End Date',
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'amount',
            label: 'Amount (₹)',
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'activity',
            label: 'Activity',
            minWidth: 170,
            align: 'right',
            format: (value) => value.toFixed(2),
        },
    ];

    function createData(payid, startdate, enddate, amount, activityElement) {
        return { payid, startdate, enddate, amount, activity: activityElement };
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const pad = n => n < 10 ? '0' + n : n;
        return [
            pad(date.getDate()),
            pad(date.getMonth() + 1),
            date.getFullYear()
        ].join('-') + ' ' +
            pad(date.getHours()) + ':' +
            pad(date.getMinutes());
    }

    const moreDetails = (id) => {
        navigator(`/profile/detailedbookinghistory/${id}`);
    }

    const rows = bookingHistory.map((booking) =>
        createData(
            booking?.paymentDetails?.id,
            formatDate(booking?.startDateTime),
            formatDate(booking?.endDateTime),
            booking?.paymentDetails?.amount / 100,
            <div onClick={() => moreDetails(booking?._id)}>
                <Button variant="text">
                    More Details
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-4 mx-1"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                        />
                    </svg>
                </Button>
            </div>
        )
    );



    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    if (loadder) {
        <div className='w-full h-full flex items-center justify-center'>
            <ClimbingBoxLoader />
        </div>
    }

    return (
        <div className='w-full h-full flex items-center justify-center'>
            <div className='h-[95%] w-[96%] bg-white border rounded'>
                <header className='w-full h-[10%] border-b border-[#d4d4d4] flex items-center'>
                    <div className='flex items-center'>
                        <div className='w-8 h-8 border flex items-center justify-center mx-3 rounded'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
                            </svg>

                        </div>
                        <h6 className='m-0 poppins-semibold'>Booking History</h6>
                    </div>
                </header>
                <div className='h-[90%] flex flex-col'>
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        <TableContainer sx={{ maxHeight: 600 }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                align={column.align}
                                                style={{ minWidth: column.minWidth }}
                                            >
                                                {column.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                                    {columns.map((column) => {
                                                        const value = row[column.id];
                                                        return (
                                                            <TableCell key={column.id} align={column.align}>
                                                                {column.format && typeof value === 'number'
                                                                    ? column.format(value)
                                                                    : value}
                                                            </TableCell>
                                                        );
                                                    })}
                                                </TableRow>
                                            );
                                        })
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            component="div"
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                </div>
            </div>
        </div>
    )
}

