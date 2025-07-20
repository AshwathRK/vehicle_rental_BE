import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { ClimbingBoxLoader } from 'react-spinners';

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
        console.log(newValue)
    };

    useEffect(() => {
        const getAffiliateAddedVehicleInfo = async () => {
            setLoading(true);
            try {
                let response;

                if (userInfo.profileType === 'Admin') {
                    if (value === "1") {
                        response = await axios.get(`${serverUrl}/approvedvehicle`);
                    } else if (value === "2") {
                        response = await axios.get(`${serverUrl}/notapprovedvehicle`);
                    }
                } else {
                    const userId = userInfo._id;
                    response = await axios.get(`${serverUrl}/affiliate/${userId}`);
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
    }, [userInfo.profileType, userInfo._id, value]);

    console.log(vehicleInfo)

    if (userInfo.profileType === 'Affiliate') {
        return (
            <div className='w-full h-full'>

            </div>
        )
    }

    return (
        <div className="w-full h-full overflow-y-auto">
            {loading ? (
                <div className="w-full h-[80vh] flex justify-center items-center">
                    <ClimbingBoxLoader color="#36d7b7" />
                </div>
            ) : (
                <>
                    <Box sx={{ width: '100%', typography: 'body1' }}>
                        <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList onChange={handleChange} aria-label="lab API tabs example">
                                    <Tab label="Approved" value="1" />
                                    <Tab label="Not Approved" value="2" />
                                </TabList>
                            </Box>
                            <TabPanel value="1">Item One</TabPanel>
                            <TabPanel value="2">Item Two</TabPanel>
                        </TabContext>
                    </Box>
                </>
            )}
        </div>

    )
}
