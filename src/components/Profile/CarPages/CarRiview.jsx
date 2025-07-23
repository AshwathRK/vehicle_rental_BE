import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useParams } from 'react-router-dom'
import { ClimbingBoxLoader } from 'react-spinners';

// === Load server URL from environment ===
const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function CarRiview() {

    const { id } = useParams()
    const [vehicleInfo, setVehicleInfo] = useState()
    const [value, setValue] = React.useState('1');
    const [loadding, setLoadding] = useState(false)

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        setLoadding(true)
        try {
            const getVehicleInformation = async () => {
                const response = await axios.get(`${serverUrl}/vehicle/${id}`)
                setVehicleInfo(response.data)
                setLoadding(false)
            }
            getVehicleInformation()
        } catch (error) {
            console.log(error)
            setLoadding(false)
        }
    }, [])

    console.log(vehicleInfo)

    const [currentIndex, setCurrentIndex] = useState(0);

    if (!vehicleInfo?.images || vehicleInfo?.images.length === 0) return (
        <div className='flex w-[1178.040px] h-[635.975px]'>
            <ClimbingBoxLoader />
        </div>
    );

    const goToPrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? vehicleInfo?.images.length - 1 : prevIndex - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === vehicleInfo?.images.length - 1 ? 0 : prevIndex + 1));
    };

    const currentImage = vehicleInfo?.images[currentIndex];

    if (loadding) {
        return (
            <div className='flex w-full h-full'>
                <ClimbingBoxLoader />
            </div>
        )
    }

    return (
        <div className='flex w-full h-full'>
            <div className='w-4/12 h-full border-r border-[#d4d4d4] p-4 flex flex-col' >
                <h6 className='poppins-reguler m-0'>Register Number: <span className='poppins-bold'>{vehicleInfo.licensePlate}</span></h6>
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
                    <Button disabled className='w-full my-2' variant="contained" color="success">Approve</Button>
                    <Button className='w-full my-2' variant="outlined" color="danger">Delete</Button>
                </div>
            </div>
            <div className='w-8/12'>
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChange} aria-label="lab API tabs example">
                                <Tab label="Information" value="1" />
                                <Tab label="History" value="2" />
                            </TabList>
                        </Box>
                        <TabPanel className="h-[calc(95.5vh-200px)] p-2 overflow-y-auto" value="1">

                        </TabPanel>
                        <TabPanel className="h-[calc(95.5vh-200px)] p-2 overflow-y-auto" value="2">

                        </TabPanel>
                    </TabContext>
                </Box>
            </div>
        </div>
    )
}
