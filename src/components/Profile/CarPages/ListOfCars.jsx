import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { ClimbingBoxLoader } from 'react-spinners';
import { Link } from 'react-router-dom';

const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function ListOfCars() {

    const accessToken = sessionStorage.getItem('accessToken');
    const deviceId = sessionStorage.getItem('deviceId');

    const [userInfo, setUserInfo] = useState([])
    const [value, setValue] = React.useState('1');
    const [vehicleInfo, setVehicleInfo] = useState([])
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const verifyUserAuthentication = async () => {
            try {
                const response = await axios.get(`${serverUrl}`, {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Device-Id': deviceId
                    }
                });

                if (response.status === 200 && response.data) {
                    setUserInfo(response.data.user);
                }
            } catch (error) {
                console.log(error)
            }
        };

        verifyUserAuthentication();
    }, []);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        const getAffiliateAddedVehicleInfo = async () => {
            if (!userInfo || !userInfo._id) return; // Wait for userInfo to be populated
            setLoading(true);
            try {
                let response;
                const userId = userInfo._id;
                if (userInfo.profileType === 'Admin') {
                    if (value === "1") {
                        response = await axios.get(`${serverUrl}/approvedvehicle`);
                    } else if (value === "2") {
                        response = await axios.get(`${serverUrl}/notapprovedvehicle`);
                    }
                    else if (value === "3") {
                        try {
                            const responseValue = await axios.get(`${serverUrl}/affiliate/${userId}`);
                            console.log(responseValue)
                            response = responseValue?.data
                        } catch (error) {
                            console.log(error)
                        }
                    }
                } else {

                    const responseValue = await axios.get(`${serverUrl}/affiliate/${userId}`);
                    response = responseValue?.data
                }

                if (response) {
                    setVehicleInfo(response.data);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        getAffiliateAddedVehicleInfo();
    }, [userInfo, value]); // Depend on userInfo and value

    // console.log(vehicleInfo)

    if (userInfo.profileType === 'Affiliate') {
        return (
            <div className='w-full h-full p-2'>
                {loading ? (
                    <div className="w-full h-[30vw] flex justify-center items-center">
                        <ClimbingBoxLoader color="#36d7b7" />
                    </div>
                ) : (
                    <div className="space-y-3">
                        {vehicleInfo?.map((value, key) => (
                            <div
                                key={key}
                                className="w-full border rounded p-2 flex flex-col md:flex-row md:items-center gap-2 md:gap-0"
                            >
                                {/* License Plate */}
                                <div className="md:w-2/12 w-full bg-gray-300 flex items-center justify-center rounded-md py-2">
                                    <h5 className="text-sm md:text-base text-center">{value.licensePlate}</h5>
                                </div>

                                {/* Make & Model */}
                                <div className="md:w-2/12 w-full flex flex-col px-2 justify-center">
                                    <h6 className="font-semibold text-sm md:text-base">{`${value.make} ${value.model}`}</h6>
                                    <h6 className="text-xs md:text-sm">{`${value.transmission} ${value.fuelType}`}</h6>
                                </div>

                                {/* Booking & Rating */}
                                <div className="md:w-2/12 w-full flex flex-col px-2 justify-center">
                                    <h6 className="text-sm">Total Booking: {value.bookingCount} times</h6>
                                    <h6 className="text-xs md:text-sm">Ratings: {value.averageRating}</h6>
                                </div>

                                {/* Price Per Day */}
                                <div className="md:w-2/12 w-full text-center px-2">
                                    <h6 className="text-sm md:text-base">{value.pricePerDay}/day</h6>
                                </div>

                                {/* Approval Status */}
                                <div className="md:w-2/12 w-full text-center px-2">
                                    <h6 className="text-sm md:text-base">
                                        {value.isAdminApproved ? (
                                            <span className="text-green-600">Approved</span>
                                        ) : (
                                            <span className="text-red-500">Pending</span>
                                        )}
                                    </h6>
                                </div>

                                {/* Edit Link */}
                                <div className="md:w-2/12 w-full text-center px-2 flex flex-col">
                                    <Link to={`/profile/carinfo/editcar/${value._id}`} className='w-full'>
                                        <Button variant="outlined" className='my-2'>
                                            Edit
                                        </Button>
                                    </Link>
                                    {value.isAdminApproved ? (
                                        <Button variant="outlined">
                                            Booking Details
                                        </Button>
                                    ) : (
                                        ''
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )
    }

    console.log(vehicleInfo)

    if (userInfo.profileType === 'Admin') {
        return (
            <div className="w-full h-full">

                <>
                    <Box sx={{ width: '100%', typography: 'body1' }}>
                        <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList onChange={handleChange} aria-label="lab API tabs example">
                                    <Tab label="Approved" value="1" />
                                    <Tab label="Not Approved" value="2" />
                                    <Tab label="Your Cars" value="3" />
                                </TabList>
                            </Box>

                            {/* === Approved Vehicles Tab === */}
                            <TabPanel className="h-[calc(95.5vh-200px)] p-2 overflow-y-auto" value="1">
                                {loading ? (
                                    <div className="w-full h-[30vw] flex justify-center items-center">
                                        <ClimbingBoxLoader color="#36d7b7" />
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {vehicleInfo?.map((value, key) => (
                                            <div
                                                key={key}
                                                className="w-full border rounded p-2 flex flex-col md:flex-row md:items-center gap-2 md:gap-0"
                                            >
                                                <div className="md:w-2/12 w-full bg-gray-300 flex items-center justify-center rounded-md py-2">
                                                    <h5 className="text-center text-sm md:text-base">{value.licensePlate}</h5>
                                                </div>

                                                <div className="md:w-2/12 w-full flex flex-col px-2 justify-center">
                                                    <h6 className="font-semibold text-sm md:text-base">{`${value.make} ${value.model}`}</h6>
                                                    <h6 className="text-xs md:text-sm">{`${value.transmission} ${value.fuelType}`}</h6>
                                                </div>

                                                <div className="md:w-2/12 w-full flex flex-col px-2 justify-center">
                                                    <h6 className="text-sm">Total Booking: {value.bookingCount} times</h6>
                                                    <h6 className="text-xs md:text-sm">Ratings: {value.averageRating}</h6>
                                                </div>

                                                <div className="md:w-2/12 w-full text-center px-2">
                                                    <h6 className="text-sm md:text-base">{value.pricePerDay}/day</h6>
                                                </div>

                                                <div className="md:w-2/12 w-full text-center px-2">
                                                    <a href="#" className="text-blue-500 underline text-sm">More Info</a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </TabPanel>

                            {/* === Not Approved Vehicles Tab === */}
                            <TabPanel className="h-[calc(95.5vh-200px)] p-2 overflow-y-auto" value="2">
                                {loading ? (
                                    <div className="w-full h-[30vw] flex justify-center items-center">
                                        <ClimbingBoxLoader color="#36d7b7" />
                                    </div>
                                ) : (
                                    <div>
                                        {vehicleInfo?.length === 0 ? (
                                            <div className="w-full h-[37.8vw] flex items-center justify-center">
                                                <h6 className="text-sm md:text-base">No vehicle found!</h6>
                                            </div>
                                        ) : (
                                            vehicleInfo?.map((value, key) => (
                                                <div
                                                    key={key}
                                                    className="w-full border rounded p-2 flex flex-col md:flex-row md:items-center gap-2 md:gap-0 mb-2"
                                                >
                                                    <div className="md:w-2/12 w-full bg-gray-300 flex items-center justify-center rounded-md py-2">
                                                        <h5 className="text-center text-sm md:text-base">{value.licensePlate}</h5>
                                                    </div>

                                                    <div className="md:w-2/12 w-full flex flex-col px-2 justify-center">
                                                        <h6 className="font-semibold text-sm md:text-base">{`${value.make} ${value.model}`}</h6>
                                                        <h6 className="text-xs md:text-sm">{`${value.transmission} ${value.fuelType}`}</h6>
                                                    </div>

                                                    <div className="md:w-2/12 w-full flex flex-col px-2 justify-center">
                                                        <h6 className="text-sm">Total Booking: {value.bookingCount} times</h6>
                                                        <h6 className="text-xs md:text-sm">Ratings: {value.averageRating}</h6>
                                                    </div>

                                                    <div className="md:w-2/12 w-full text-center px-2">
                                                        <h6 className="text-sm md:text-base">{value.pricePerDay}/day</h6>
                                                    </div>

                                                    <div className="md:w-2/12 w-full text-center px-2">
                                                        <a href="#" className="text-blue-500 underline text-sm">Review</a>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </TabPanel>

                            <TabPanel className="h-[calc(95.5vh-200px)] p-2 overflow-y-auto" value="3">
                                {loading ? (
                                    <div className="w-full h-[30vw] flex justify-center items-center">
                                        <ClimbingBoxLoader color="#36d7b7" />
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {vehicleInfo?.map((value, key) => (
                                            <div
                                                key={key}
                                                className="w-full border rounded p-2 flex flex-col md:flex-row md:items-center gap-2 md:gap-0"
                                            >
                                                {/* License Plate */}
                                                <div className="md:w-2/12 w-full bg-gray-300 flex items-center justify-center rounded-md py-2">
                                                    <h5 className="text-sm md:text-base text-center">{value.licensePlate}</h5>
                                                </div>

                                                {/* Make & Model */}
                                                <div className="md:w-2/12 w-full flex flex-col px-2 justify-center">
                                                    <h6 className="font-semibold text-sm md:text-base">{`${value.make} ${value.model}`}</h6>
                                                    <h6 className="text-xs md:text-sm">{`${value.transmission} ${value.fuelType}`}</h6>
                                                </div>

                                                {/* Booking & Rating */}
                                                <div className="md:w-2/12 w-full flex flex-col px-2 justify-center">
                                                    <h6 className="text-sm">Total Booking: {value.bookingCount} times</h6>
                                                    <h6 className="text-xs md:text-sm">Ratings: {value.averageRating}</h6>
                                                </div>

                                                {/* Price Per Day */}
                                                <div className="md:w-2/12 w-full text-center px-2">
                                                    <h6 className="text-sm md:text-base">{value.pricePerDay}/day</h6>
                                                </div>

                                                {/* Approval Status */}
                                                <div className="md:w-2/12 w-full text-center px-2">
                                                    <h6 className="text-sm md:text-base">
                                                        {value.isAdminApproved ? (
                                                            <span className="text-green-600">Approved</span>
                                                        ) : (
                                                            <span className="text-red-500">Pending</span>
                                                        )}
                                                    </h6>
                                                </div>

                                                {/* Edit Link */}
                                                <div className="md:w-2/12 w-full text-center px-2 flex flex-col">
                                                    <Link to={`/profile/carinfo/editcar/${value._id}`} className='w-full'>
                                                        <Button variant="outlined" className='my-2'>
                                                            Edit
                                                        </Button>
                                                    </Link>
                                                    {value.isAdminApproved ? (
                                                        <Button variant="outlined">
                                                            Booking Details
                                                        </Button>
                                                    ) : (
                                                        ''
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </TabPanel>
                        </TabContext>
                    </Box>
                </>

            </div>

        )
    }

}
