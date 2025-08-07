import React, { useEffect } from 'react';
import Stepper from '@mui/joy/Stepper';
import Step, { stepClasses } from '@mui/joy/Step';
import StepIndicator, { stepIndicatorClasses } from '@mui/joy/StepIndicator';
import Typography, { typographyClasses } from '@mui/joy/Typography';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import AppRegistrationRoundedIcon from '@mui/icons-material/AppRegistrationRounded';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import Button from '@mui/material/Button';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MultiInputDateTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputDateTimeRangeField';
import dayjs from 'dayjs';
import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import moment from 'moment/moment';
import { DateTime } from 'luxon';

// === Load server URL from environment ===
const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function BookingPage() {
    const { id } = useParams();
    // Stepper state
    const [stepper, setStepper] = React.useState({
        activeStep: 0,
    });

    const [confirmBooking, setConfirmBooking] = useState({});

    const [tabValue, setTabValue] = React.useState('1');
    const [vehicleInfo, setVehicleInfo] = useState({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [vehicelCategory, setVehicelCategory] = useState('')
    const [duration, setDuration] = useState(0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const handleRangeChange = (item) => {
        if (item.selection.endDate === null) {
            setState([{ ...item.selection, endDate: item.selection.startDate }]);
            setValue([dayjs(item.selection.startDate), dayjs(item.selection.startDate)]);
        } else {
            setState([item.selection]);
            setValue([dayjs(item.selection.startDate), dayjs(item.selection.endDate)]);
        }
    };

    const [disabledRanges, setDisabledRanges] = React.useState([]);

    useEffect(() => {
        const getBookingData = async () => {
            // Fetch booking data from the server or perform any necessary operations
            try {
                const response = await axios.get(`${serverUrl}/booking/car/${id}`,
                    { withCredentials: true });
                // Process the response data as needed
                setDisabledRanges(response.data.data || []);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching booking data:', error);
            }
        }

        getBookingData();

    }, []);

    function isDateInRange(date, range) {
        return date >= range.start && date <= range.end;
    }

    function findNextAvailableDate(startDate, disabledRanges) {
        let current = new Date(startDate);

        while (true) {
            let isInRange = false;

            for (const range of disabledRanges) {
                if (isDateInRange(current, range)) {
                    current = new Date(range.end);
                    current.setDate(current.getDate() + 1);
                    isInRange = true;
                    break;
                }
            }

            if (!isInRange) {
                return current;
            }
        }
    }

    // ✅ Find next available date
    const nextAvailable = findNextAvailableDate(today, disabledRanges);
    const nextAvailablePlus24Hours = moment(nextAvailable).add(24, 'hours');

    const [state, setState] = useState([
        {
            startDate: nextAvailable,
            endDate: nextAvailablePlus24Hours,
            key: 'selection'
        }
    ]);

    const [value, setValue] = useState([dayjs(nextAvailable), dayjs(nextAvailablePlus24Hours)]);


    const disabledDates = [];
    disabledRanges?.forEach((range) => {
        const startDate = new Date(range.startDateTime);
        const endDate = new Date(range.endDateTime);
        let currentDate = startDate;
        while (currentDate <= endDate) {
            disabledDates.push(currentDate);
            currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
        }
    });

    const startDate = new Date(value[0]);
    const endDate = new Date(value[1]);

    useEffect(() => {
        if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
            const durationInHours = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600));
            console.log(startDate.toISOString().replace('T', ' ').slice(0, -5));
            console.log(endDate.toISOString().replace('T', ' ').slice(0, -5));
            setDuration(durationInHours);
        } else {
            console.log("Invalid input");
        }
    }, [startDate, endDate]);

    console.log(duration);

    // Function to handle booking confirmation
    const handleConfirmBookingPage = () => {
        // debugger
        if (value && value.length === 2 && value[0] && value[1]) {
            const startDate = value[0].format('YYYY-MM-DD HH:mm:ss');
            const endDate = value[1].format('YYYY-MM-DD HH:mm:ss');

            if (startDate && endDate) {
                setConfirmBooking({
                    startDate,
                    endDate,
                    carId: id,
                });
                setStepper((prev) => ({
                    ...prev,
                    activeStep: prev.activeStep + 1,
                }));
                setTabValue('2');
            } else {
                console.error('Error formatting dates');
            }
        } else {
            console.error('Invalid date range');
        }
    }

    console.log('Booking Data:', confirmBooking);

    useEffect(() => {
        const getVehicleData = async () => {
            try {
                const response = await axios.get(`${serverUrl}/vehicle/${id}`, { withCredentials: true });
                if (response.status == 200) {
                    setVehicleInfo(response.data);
                } else {
                    console.error('Error fetching vehicle data:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching vehicle data:', error);
            }
        }

        getVehicleData()
    }, [])

    console.log('Vehicle Info:', vehicleInfo);

    const [formData, setFormData] = useState({
        name: '',
        AddressLine1: '',
        AddressLine2: '',
        City: '',
        state: '',
        Zipcode: '',
        Country: '',
        mobile: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const goToPrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? vehicleInfo?.images.length - 1 : prevIndex - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === vehicleInfo?.images.length - 1 ? 0 : prevIndex + 1));
    };

    const currentImage = vehicleInfo?.images?.[currentIndex] ?? 'default-image-url.jpg';

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

    // Define a function to calculate the booking total
    const calculateBookingTotal = () => {
        // debugger
        const totalPrice = Math.floor(duration / 24) * vehicleInfo?.pricePerDay + (duration % 24) * vehicleInfo?.pricePerHour;
        let discount = 0;
        if (duration >= 672) {
            discount = vehicleInfo?.discounts?.monthly || 0;
            return (totalPrice - (totalPrice * discount / 100)).toFixed(2);
        }
        else if (duration >= 168) {
            discount = vehicleInfo?.discounts?.weekly || 0;
            return (totalPrice - (totalPrice * discount / 100)).toFixed(2);
        }
        return (totalPrice - (totalPrice * discount / 100)).toFixed(2);

    }

    console.log('Form Data:', formData);

    return (
        <div className="h-[calc(99.8vh-78.4px)] flex relative top-[78px]">
            <div className="w-[20%] flex items-center justify-center border-r border-[#d4d4d4]">
                <Stepper
                    orientation="vertical"
                    sx={(theme) => ({
                        '--Stepper-verticalGap': '10rem',
                        '--StepIndicator-size': '2.5rem',
                        '--Step-gap': '1rem',
                        '--Step-connectorInset': '0.5rem',
                        '--Step-connectorRadius': '1rem',
                        '--Step-connectorThickness': '4px',
                        '--joy-palette-success-solidBg': 'var(--joy-palette-success-400)',
                        [`& .${stepClasses.completed}`]: {
                            '&::after': { bgcolor: 'success.solidBg' },
                        },
                        [`& .${stepClasses.active}`]: {
                            [`& .${stepIndicatorClasses.root}`]: {
                                border: '4px solid',
                                borderColor: '#fff',
                                boxShadow: `0 0 0 1px ${theme.vars.palette.primary[500]}`,
                            },
                        },
                        [`& .${stepClasses.disabled} *`]: {
                            color: 'neutral.softDisabledColor',
                        },
                        [`& .${typographyClasses['title-sm']}`]: {
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            fontSize: '10px',
                        },
                    })}
                >
                    <Step
                        active={stepper.activeStep === 0}
                        completed={stepper.activeStep > 0}
                        indicator={
                            <StepIndicator
                                variant="solid"
                                color={stepper.activeStep < 1 ? 'primary' : 'success'}
                            >
                                {stepper.activeStep < 1 ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="size-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z"
                                        />
                                    </svg>
                                ) : (
                                    <CheckRoundedIcon />
                                )}
                            </StepIndicator>
                        }
                    >
                        <div>
                            <Typography level="title-sm">Step 1</Typography>
                            Choose Booking Date
                        </div>
                    </Step>

                    <Step
                        active={stepper.activeStep === 1}
                        completed={stepper.activeStep > 1}
                        indicator={
                            <StepIndicator
                                variant="solid"
                                color={stepper.activeStep < 2 ? 'primary' : 'success'}
                            >
                                {stepper.activeStep < 2 ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                    </svg>

                                ) : (
                                    <CheckRoundedIcon />
                                )}
                            </StepIndicator>
                        }
                    >
                        <div>
                            <Typography level="title-sm">Step 2</Typography>
                            Choose Booking Address
                        </div>
                    </Step>

                    <Step
                        active={stepper.activeStep === 2}
                        completed={stepper.activeStep > 2}
                        indicator={
                            <StepIndicator
                                variant="solid"
                                color={stepper.activeStep < 3 ? 'primary' : 'success'}
                            >
                                {stepper.activeStep < 3 ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="size-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"
                                        />
                                    </svg>
                                ) : (
                                    <CheckRoundedIcon />
                                )}
                            </StepIndicator>
                        }
                    >
                        <div>
                            <Typography level="title-sm">Step 3</Typography>
                            Booking Review
                        </div>
                    </Step>

                    <Step
                        active={stepper.activeStep === 3}
                        completed={stepper.activeStep > 3}
                        indicator={
                            <StepIndicator variant="solid" color="primary">
                                <AppRegistrationRoundedIcon />
                            </StepIndicator>
                        }
                    >
                        <div>
                            <Typography level="title-sm">Step 4</Typography>
                            Payment details
                        </div>
                    </Step>
                </Stepper>
            </div>
            <div className="w-[80%] flex p-4 overflow-y-auto gap-4 flex-col items-center">
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={tabValue}>
                        <TabPanel value="1" gap-={2}>
                            <div className='flex flex-col items-center gap-3'>
                                <h6 className='!text-[24px] poppins-bold'>Car Availability</h6>
                                <div className="w-[60%]">
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer
                                            components={[
                                                'MultiInputDateTimeRangeField',
                                            ]}
                                        >
                                            <MultiInputDateTimeRangeField
                                                value={value}
                                                onChange={(newValue) => setValue(newValue)}
                                                slotProps={{
                                                    textField: ({ position }) => ({
                                                        label: position === 'start' ? 'Booking-Start' : 'Booking-End',
                                                    }),
                                                }}
                                                format="DD/MM/YYYY hh:mm a"
                                            />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </div>
                                <div className='flex justify-center gap-5 w-[80%] border border-[#d4d4d4] rounded-lg p-5'>
                                    <DateRangePicker className='w-[70%]'
                                        onChange={handleRangeChange}
                                        showSelectionPreview={true}
                                        moveRangeOnFirstSelection={false}
                                        months={2}
                                        minDate={new Date()}
                                        disablePast={true}
                                        ranges={state}
                                        direction="horizontal"
                                        preventSnapRefocus={true}
                                        calendarFocus="forwards"
                                        showDateDisplay={false}
                                        disabledDates={disabledDates.map(date => date.getTime())}
                                    />
                                </div>
                                <h6 className='!text-[14px]'><span className='poppins-semibold'>Please note:</span> Bookings made in minutes will be rounded up and charged at the hourly rate.</h6>
                                <div className='flex justify-end gap-3 px-20'>
                                    <Button onClick={handleConfirmBookingPage} variant="contained" color="success">Confirm Booking Date</Button>

                                    <Link to={`/car/${id}`}>
                                        <Button variant="outlined" color="primary">Back to Car Details</Button>
                                    </Link>

                                    {/* <Button>Cancel</Button> */}
                                </div>
                            </div>
                        </TabPanel>
                        <TabPanel value="2">
                            <div className='flex flex-col overflow-y-auto h-[calc(100vh-176px)] border rounded'>
                                {
                                    vehicleInfo && Object.keys(vehicleInfo).length > 0 && vehicleInfo.delivery ? (
                                        <div className='h-full w-full px-4 py-2 flex flex-col gap-3'>
                                            <h6 className='flex poppins-semibold'>Delivery Address</h6>
                                            <h6 className='!text-[13px] flex items-center px-1 m-0 poppins-semibold'>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="mx-1 size-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                                </svg>
                                                This car can be delivered to your location. Kindly enter your address below.</h6>
                                            <div className='flex flex-wrap gap-4'>
                                                <div>
                                                    <label htmlFor="name" className='poppins-semibold text-sm my-2'>Name</label>
                                                    <input
                                                        type="text"
                                                        id="name"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px]`}
                                                        placeholder='Tracy Lilibeth'
                                                        aria-required="true"
                                                        aria-label="Full Name"
                                                    />
                                                </div>

                                                <div>
                                                    <label htmlFor="AddressLine1" className='poppins-semibold text-sm my-2'>Address Line 1</label>
                                                    <input
                                                        type="text"
                                                        id="AddressLine1"
                                                        name="AddressLine1"
                                                        value={formData.AddressLine1}
                                                        onChange={handleChange}
                                                        className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px]`}
                                                        placeholder='17/1 G S T Road'
                                                        aria-required="true"
                                                        aria-label="Address Line 1"
                                                    />
                                                </div>

                                                <div>
                                                    <label htmlFor="AddressLine2" className='poppins-semibold text-sm my-2'>Address Line 2</label>
                                                    <input
                                                        type="text"
                                                        id="AddressLine2"
                                                        name="AddressLine2"
                                                        value={formData.AddressLine2}
                                                        onChange={handleChange}
                                                        className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px]`}
                                                        placeholder='St. Thomas Mount'
                                                        aria-label="Address Line 2"
                                                    />
                                                </div>

                                                <div>
                                                    <label htmlFor="City" className='poppins-semibold text-sm my-2'>City</label>
                                                    <input
                                                        type="text"
                                                        id="City"
                                                        name="City"
                                                        value={formData.City}
                                                        onChange={handleChange}
                                                        className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px]`}
                                                        placeholder='Chennai'
                                                        aria-required="true"
                                                        aria-label="City"
                                                    />
                                                </div>

                                                <div>
                                                    <label htmlFor="state" className='poppins-semibold text-sm my-2'>State</label>
                                                    <input
                                                        type="text"
                                                        id="state"
                                                        name="state"
                                                        value={formData.state}
                                                        onChange={handleChange}
                                                        className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px]`}
                                                        placeholder='Tamil Nadu'
                                                        aria-required="true"
                                                        aria-label="State"
                                                    />
                                                </div>

                                                <div>
                                                    <label htmlFor="Zipcode" className='poppins-semibold text-sm my-2'>Zip code</label>
                                                    <input
                                                        type="text"
                                                        id="Zipcode"
                                                        name="Zipcode"
                                                        value={formData.Zipcode}
                                                        onChange={handleChange}
                                                        className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px]`}
                                                        placeholder='600016'
                                                        aria-required="true"
                                                        aria-label="Zip Code"
                                                    />
                                                </div>

                                                <div>
                                                    <label htmlFor="Country" className='poppins-semibold text-sm my-2'>Country</label>
                                                    <input
                                                        type="text"
                                                        id="Country"
                                                        name="Country"
                                                        value={formData.Country}
                                                        onChange={handleChange}
                                                        className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px]`}
                                                        placeholder='India'
                                                        aria-required="true"
                                                        aria-label="Country"
                                                    />
                                                </div>

                                                <div>
                                                    <label htmlFor="mobile" className='poppins-semibold text-sm my-2'>Mobile</label>
                                                    <input
                                                        type="text"
                                                        id="mobile"
                                                        name="mobile"
                                                        value={formData.mobile}
                                                        onChange={handleChange}
                                                        className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px]`}
                                                        placeholder='9876543210'
                                                        aria-required="true"
                                                        aria-label="Mobile Number"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ) : <div className='h-full w-full px-4 py-2 flex flex-col gap-3'>
                                        <h6 className='flex poppins-semibold'>Delivery Address</h6>
                                        <h6 className='!text-[13px] flex items-center px-1 m-0 poppins-semibold'>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="mx-1 size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                            </svg>
                                            Home delivery is unavailable for this car. You can pick it up at the location mentioned below.</h6>
                                        <div className='flex flex-col flex-wrap gap-4'>
                                            <div className='flex gap-1'>
                                                <h6 className='poppins-semibold !text-[13px]'>PickUp location: </h6>
                                                <h6 className='poppins-reguler !text-[13px]'>{vehicleInfo.location?.pickup}</h6>
                                            </div>

                                            <div className='flex gap-1'>
                                                <h6 className='poppins-semibold !text-[13px]'>Drop location: </h6>
                                                <h6 className='poppins-reguler !text-[13px]'>{vehicleInfo.location?.dropoff}</h6>
                                            </div>
                                        </div>
                                    </div>
                                }
                                <div className='flex justify-end gap-3 px-20 py-3'>
                                    <Button onClick={() => {
                                        setTabValue('3'), setStepper((prev) => ({
                                            ...prev,
                                            activeStep: prev.activeStep + 1,
                                        }));
                                    }} variant="contained" color="success">Confirm Booking Address</Button>
                                    <Button onClick={() => {
                                        setTabValue('1'),
                                            setStepper((prev) => ({
                                                ...prev,
                                                activeStep: prev.activeStep - 1,
                                            }));
                                    }}>Back</Button>
                                </div>
                            </div>

                        </TabPanel>
                        <TabPanel value="3" className='p-0'>
                            <div className='flex flex-col overflew-y-auto h-[calc(100vh-128px)] border rounded'>
                                <div className='h-1/10 w-full border-b border-[#d4d4d4] flex items-center px-2'>
                                    <h6 className='!text-[16px] poppins-bold'>Booking Summary</h6>
                                </div>
                                <div className='w-full h-9/10 p-0 m-0 flex'>
                                    <div className='w-3/10 border-r border-[#d4d4d4] h-full p-2'>
                                        <h6 className='!text-[15px] poppins-bold'>Vehicle information</h6>
                                        <div className='w-full h-[calc(100%-300px)] flex flex-col gap-3 overflow-y-auto'>
                                            <div className="relative w-full h-full rounded overflow-hidden shadow">
                                                <img
                                                    src={`data:${currentImage?.contentType};base64,${currentImage?.data}`}
                                                    alt={`Slide ${currentIndex}`}
                                                    className="w-full h-full object-cover rounded"
                                                />

                                                {Array.isArray(vehicleInfo?.images) && vehicleInfo.images.length > 1 && (
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
                                        {
                                            vehicleInfo.delivery ?
                                                <>
                                                    <h6 className='py-2 poppins-semibold !text-[14px]'>Drop Location: </h6>
                                                    <span className='poppins-regular !text-[13px]'>{`${formData.name} ${formData.AddressLine1} ${formData.AddressLine2} ${formData.City} ${formData.Country} - ${formData.Zipcode} Mobile: ${formData.mobile}`}</span>
                                                </> :
                                                <>
                                                    <h6 className='py-2 poppins-semibold !text-[14px]'>PickUp location: </h6>
                                                    <span className='poppins-regular !text-[13px]'>{`${vehicleInfo?.location?.pickup}`}</span>

                                                    <h6 className='py-2 poppins-semibold !text-[14px]'>Drop location: </h6>
                                                    <span className='poppins-regular !text-[13px]'>{`${vehicleInfo?.location?.dropoff}`}</span>
                                                </>
                                        }
                                    </div>
                                    <div className='w-7/10 h-full flex flex-col p-5'>
                                        <h4 className='poppins-bold !text-[30px]'>{`${vehicleInfo?.make}-${vehicleInfo?.model}`}</h4>
                                        <p className='poppins-reguler !text-[15px] mb-2'>{`${vehicleInfo?.fuelType}.${vehicleInfo?.transmission}.${vehicelCategory}`}</p>
                                        {/* <p className='poppins-reguler !text-[14px]'><span className='poppins-semibold'>Booking Start Date:</span> {value[0].format('DD-MM-YYYY')}</p> */}
                                        <div className='flex gap-3 flex-wrap pb-3'>
                                            <div>
                                                <label htmlFor="newPassword" className='poppins-semibold text-sm my-2'>Booking Start Date:</label>
                                                <input type="text" name="newPassword" value={value[0].format('DD-MM-YYYY')} disabled className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] bg-zinc-100`} placeholder='New password' />
                                            </div>
                                            <div>
                                                <label htmlFor="newPassword" className='poppins-semibold text-sm my-2'>Booking End Date:</label>
                                                <input type="text" name="newPassword" value={value[1].format('DD-MM-YYYY')} disabled className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] bg-zinc-100`} placeholder='New password' />
                                            </div>
                                        </div>
                                        <p className='poppins-reguler !text-[14px]'> <span className='poppins-semibold'>Fuel Policy:</span> {vehicleInfo.fuelPolicy}</p>
                                        <p className='poppins-reguler !text-[14px]'><span className='poppins-semibold'>Booking Duration:</span> {`${Math.floor(duration / 24)} days ${duration % 24} hours`}</p>
                                        {/* <p className='poppins-reguler !text-[14px]'><span className='poppins-semibold'>Booking Price:</span> ₹{vehicleInfo?.pricePerDay * duration}</p> */}
                                        <p className='poppins-reguler !text-[14px]'>
                                            <span className='poppins-semibold'>Booking Total:</span>
                                            ₹{calculateBookingTotal()}
                                        </p>


                                        <div className='flex justify-end gap-3 px-20'>
                                            <Button onClick={() => setTabValue('3')} variant="contained" color="success">Proceed to Payment</Button>
                                            <Button onClick={() => {
                                                setTabValue('2'), setStepper((prev) => ({
                                                    ...prev,
                                                    activeStep: prev.activeStep - 1,
                                                }));
                                            }}>Back</Button>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className='w-[60%] flex flex-col gap-3 border border-[#d4d4d4] rounded-lg p-5'>
                                    <p className='!text-[18px] poppins-semibold'>Booking Start Date: {value[0].format('YYYY-MM-DD HH:mm:ss')}</p>
                                    <p className='!text-[18px] poppins-semibold'>Booking End Date: {value[1].format('YYYY-MM-DD HH:mm:ss')}</p>
                                </div> */}
                            </div>
                        </TabPanel>
                    </TabContext>
                </Box>
            </div>
        </div>
    );
}