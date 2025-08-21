import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useNavigate, useParams } from 'react-router-dom'
import { ClimbingBoxLoader } from 'react-spinners';
import { toast, ToastContainer } from 'react-toastify';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

// === Load server URL from environment ===
const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function CarRiview() {

    const { id } = useParams();
    const [vehicleInfo, setVehicleInfo] = useState(null);
    const [value, setValue] = useState('1');
    const [loadding, setLoadding] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [vehicelCategory, setVehicelCategory] = useState('')
    const [bookingHistory, setBookingHistory] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const navigator = useNavigate()

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        setLoadding(true);
        const getVehicleInformation = async () => {
            try {
                const response = await axios.get(`${serverUrl}/vehicle/${id}`);
                setVehicleInfo(response.data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoadding(false);
            }
        };
        getVehicleInformation();
    }, []);

    useEffect(() => {
        const getTheCategoryById = async () => {
            if (!vehicleInfo?.category) return;
            try {
                const response = await axios.get(`${serverUrl}/categorie/${vehicleInfo?.category}`);
                setVehicelCategory(response.data?.category?.category);
            } catch (error) {
                console.log(error);
            }
        };

        getTheCategoryById();
    }, [vehicleInfo?.category]);

    const goToPrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? vehicleInfo?.images.length - 1 : prevIndex - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === vehicleInfo?.images.length - 1 ? 0 : prevIndex + 1));
    };

    const handleApprove = async () => {
        try {
            const approveVehicle = await axios.put(
                `${serverUrl}/vehicle/${id}`,
                {
                    vehicleInfo: JSON.stringify({
                        isAdminApproved: true
                    })
                },
                { withCredentials: true }
            );
            toast('The Vehicle has been approved')
            setTimeout(() => {
                navigator('/profile/carinfo')
            }, "3500");
        } catch (error) {
            console.error("Approval failed:", error);
            toast('Something went wrong the vehicle not approved!')
        }
    };

    const currentImage = vehicleInfo?.images[currentIndex];

    const formatADate = (isoDate) => {
        const date = new Date(isoDate);
        const formattedDate = `${String(date.getDate()).padStart(2, '0')
            }-${String(date.getMonth() + 1).padStart(2, '0')
            }-${date.getFullYear()
            }`;

        return formattedDate
    }


    if (vehicleInfo) {
        console.log()
    }

    // always keep hooks at the top
    useEffect(() => {
        setLoadding(true);
        const fetchPaymentInformation = async () => {
            try {
                const { data: bookings } = await axios.get(`${serverUrl}/booking/car/${id}`);
                if (!bookings?.data || bookings?.data.length === 0) {
                    console.warn("No bookings found for user");
                    return;
                }

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
                setBookingHistory(bookingsWithPayments);
            } catch (error) {
                console.error("Error fetching payment information:", error);
            } finally {
                setLoadding(false);
            }
        };

        fetchPaymentInformation();
    }, [id]);

    // ✅ only after all hooks
    if (loadding || !vehicleInfo || !vehicleInfo?.images || !vehicelCategory) {
        return (
            <div className='flex w-full h-full items-center justify-center'>
                <ClimbingBoxLoader />
            </div>
        );
    }


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
            <div className='hover:text-blue-400' onClick={() => moreDetails(booking?._id)}>
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

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };


    return (
        <div className='flex w-full h-full'>
            <div className='w-4/12 h-full border-r border-[#d4d4d4] p-4 flex flex-col' >
                <h5 className='poppins-reguler m-0'>Register Number: <span className='poppins-bold'>{vehicleInfo?.licensePlate}</span></h5>
                <div className='h-[300px] w-full my-5'>
                    <div className="relative w-full h-full rounded overflow-hidden shadow">
                        <img
                            src={`data:${currentImage.contentType};base64,${currentImage.data}`}
                            alt={`Slide ${currentIndex}`}
                            className="w-full h-full object-cover rounded"
                        />

                        {vehicleInfo?.images.length > 1 && (
                            <>
                                <button
                                    onClick={goToPrev}
                                    className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" />
                                    </svg>

                                </button>
                                <button
                                    onClick={goToNext}
                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
                                    </svg>
                                </button>
                            </>
                        )}
                    </div>
                </div>
                <div className='h-[200px] w-full flex flex-col'>
                    <Button disabled={vehicleInfo?.isAdminApproved} onClick={handleApprove} className='w-full my-2' variant="contained" color="success">{vehicleInfo.isAdminApproved ? 'Approved' : 'Approve'}</Button>
                    {/* {
                        vehicleInfo.isAdminApproved ?
                            <Button className='w-full my-2' variant="outlined" color="danger">Disable</Button> :
                            <Button className='w-full my-2' variant="outlined" color="danger">Delete</Button>
                    } */}
                </div>
            </div>
            <div className='w-8/12'>
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChange} aria-label="lab API tabs example">
                                <Tab label="Information" value="1" />
                                {
                                    vehicleInfo?.isAdminApproved ?
                                        <Tab label="History" value="2" /> : ''
                                }
                            </TabList>
                        </Box>
                        <TabPanel className="h-[calc(95.5vh-200px)] p-2 overflow-y-auto" value="1">
                            <div className='w-full h-full p-4'>
                                <h4 className='poppins-bold !text-[30px]'>{`${vehicleInfo?.make}-${vehicleInfo?.model}`}</h4>
                                <p className='poppins-semibold !text-[20px] mb-2'>{`₹ ${vehicleInfo?.pricePerHour} / hour (₹ ${vehicleInfo?.pricePerDay} / day)`}</p>
                                <p className='poppins-reguler !text-[15px] mb-2'>{`${vehicleInfo?.fuelType}.${vehicleInfo?.transmission}.${vehicelCategory}`}</p>
                                <p className='poppins-reguler !text-[15px] m-0 flex'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" className="size-5 mr-2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                    </svg>
                                    {`${vehicleInfo?.averageRating.toFixed(2)} (${vehicleInfo?.reviewCount})`}
                                    {/* 4.8 */}
                                </p>
                                <hr className='border-b border-[#d4d4d4]' />
                                <div className='pb-4'>
                                    <h6 className='poppins-semibold !text-[18px] my-3'>{`Basic Information`}</h6>
                                    <div className='w-full grid grid-cols-3 gap-3 border-b border-[#d4d4d4] pb-4'>
                                        <div>
                                            <label htmlFor="newPassword" className='poppins-semibold text-sm my-2'>Vehicle Register Year</label>
                                            <input type="text" name="newPassword" value={vehicleInfo?.year} disabled className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] bg-zinc-100`} placeholder='New password' />
                                        </div>

                                        <div>
                                            <label htmlFor="newPassword" className='poppins-semibold text-sm my-2'>Odometer Value</label>
                                            <input type="text" name="newPassword" value={vehicleInfo?.maintenance.odometerReading} disabled className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] bg-zinc-100`} placeholder='New password' />
                                        </div>

                                        <div >
                                            <label htmlFor="newPassword" className='poppins-semibold text-sm my-2'>Kilometers per Liter (km/l)</label>
                                            <input type="text" name="newPassword" value={vehicleInfo?.mileage} disabled className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] bg-zinc-100`} placeholder='New password' />
                                        </div>

                                        <div>
                                            <label htmlFor="newPassword" className='poppins-semibold text-sm my-2'>seats</label>
                                            <input type="text" name="newPassword" value={vehicleInfo?.seatingCapacity} disabled className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] bg-zinc-100`} placeholder='New password' />
                                        </div>

                                        <div>
                                            <label htmlFor="newPassword" className='poppins-semibold text-sm my-2'>Total Doors</label>
                                            <input type="text" name="newPassword" value={vehicleInfo?.numberOfDoors} disabled className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] bg-zinc-100`} placeholder='New password' />
                                        </div>

                                        <div>
                                            <label htmlFor="newPassword" className='poppins-semibold text-sm my-2'>Luggage Capacity</label>
                                            <input type="text" name="newPassword" value={vehicleInfo?.luggageCapacity} disabled className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] bg-zinc-100`} placeholder='New password' />
                                        </div>

                                        <div>
                                            <label htmlFor="newPassword" className='poppins-semibold text-sm my-2'>AC Available</label>
                                            <input type="text" name="newPassword" value={vehicleInfo?.airConditioning ? 'Available' : 'Not-available'} disabled className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] bg-zinc-100`} placeholder='New password' />
                                        </div>
                                    </div>

                                    <h6 className='poppins-semibold !text-[18px] my-3'>Maintenance Information</h6>
                                    <div className='w-full grid grid-cols-3 gap-3 border-b border-[#d4d4d4] pb-4'>
                                        <div>
                                            <label htmlFor="newPassword" className='poppins-semibold text-sm my-2'>Last Serviced</label>
                                            <input type="text" name="newPassword" value={formatADate(vehicleInfo?.maintenance?.lastServiced)} disabled className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] bg-zinc-100`} placeholder='New password' />
                                        </div>

                                        <div>
                                            <label htmlFor="newPassword" className='poppins-semibold text-sm my-2'>Next Service Due</label>
                                            <input type="text" name="newPassword" value={formatADate(vehicleInfo?.maintenance.nextServiceDue)} disabled className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] bg-zinc-100`} placeholder='New password' />
                                        </div>

                                        <div >
                                            <label htmlFor="newPassword" className='poppins-semibold text-sm my-2'>Condition</label>
                                            <input type="text" name="newPassword" value={vehicleInfo?.maintenance?.condition} disabled className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] bg-zinc-100`} placeholder='New password' />
                                        </div>

                                        {/* Insuranse Information */}
                                        <div>
                                            <label htmlFor="newPassword" className='poppins-semibold text-sm my-2'>Insurance Type</label>
                                            <input type="text" name="newPassword" value={vehicleInfo?.insurance?.type} disabled className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] bg-zinc-100`} placeholder='New password' />
                                        </div>

                                        <div>
                                            <label htmlFor="newPassword" className='poppins-semibold text-sm my-2'>Insurance Provider</label>
                                            <input type="text" name="newPassword" value={vehicleInfo?.insurance.provider} disabled className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] bg-zinc-100`} placeholder='New password' />
                                        </div>

                                        <div >
                                            <label htmlFor="newPassword" className='poppins-semibold text-sm my-2'>Insurance ExpiryDate</label>
                                            <input type="text" name="newPassword" value={formatADate(vehicleInfo?.insurance?.expiryDate)} disabled className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] bg-zinc-100`} placeholder='New password' />
                                        </div>
                                    </div>

                                    <h6 className='poppins-semibold !text-[18px] my-3'>Booking Details</h6>
                                    <div className='w-full grid grid-cols-3 gap-3 border-b border-[#d4d4d4] pb-4'>
                                        <div>
                                            <label htmlFor="newPassword" className='poppins-semibold text-sm my-2'>Vehicle Pickup location</label>
                                            <input type="text" name="newPassword" value={vehicleInfo?.location?.pickup} disabled className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] bg-zinc-100`} placeholder='New password' />
                                        </div>

                                        <div>
                                            <label htmlFor="newPassword" className='poppins-semibold text-sm my-2'>Vehicle Drop location</label>
                                            <input type="text" name="newPassword" value={vehicleInfo?.location?.dropoff} disabled className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] bg-zinc-100`} placeholder='New password' />
                                        </div>

                                        <div >
                                            <label htmlFor="newPassword" className='poppins-semibold text-sm my-2'>City</label>
                                            <input type="text" name="newPassword" value={vehicleInfo?.location?.city} disabled className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] bg-zinc-100`} placeholder='New password' />
                                        </div>

                                        <div>
                                            <label htmlFor="newPassword" className='poppins-semibold text-sm my-2'>Fuel Policy</label>
                                            <input type="text" name="newPassword" value={vehicleInfo?.fuelPolicy} disabled className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] bg-zinc-100`} placeholder='New password' />
                                        </div>

                                        <div>
                                            <label htmlFor="newPassword" className='poppins-semibold text-sm my-2'>Weekly Discount %</label>
                                            <input type="text" name="newPassword" value={vehicleInfo?.discounts?.weekly} disabled className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] bg-zinc-100`} placeholder='New password' />
                                        </div>

                                        <div >
                                            <label htmlFor="newPassword" className='poppins-semibold text-sm my-2'>Monthly Discount %</label>
                                            <input type="text" name="newPassword" value={vehicleInfo?.discounts?.monthly} disabled className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] bg-zinc-100`} placeholder='New password' />
                                        </div>
                                    </div>

                                    <h6 className='poppins-semibold !text-[18px] my-3'>Requirements</h6>
                                    <div className='w-full grid grid-cols-3 gap-3 border-b border-[#d4d4d4] pb-4'>
                                        <div>
                                            <label htmlFor="newPassword" className='poppins-semibold text-sm my-2'>Driver Minmum age</label>
                                            <input type="text" name="newPassword" value={vehicleInfo?.driverRequirements?.minAge} disabled className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] bg-zinc-100`} placeholder='New password' />
                                        </div>

                                        <div>
                                            <label htmlFor="newPassword" className='poppins-semibold text-sm my-2'>Basic driver license type</label>
                                            <input type="text" name="newPassword" value={vehicleInfo?.driverRequirements?.licenseType} disabled className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] bg-zinc-100`} placeholder='New password' />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabPanel>
                        <TabPanel className="h-[calc(95.5vh-200px)] p-2 overflow-y-auto" value="2">
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
                        </TabPanel>
                    </TabContext>
                </Box>
            </div>
            <ToastContainer />
        </div>
    )
}
