import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ClimbingBoxLoader } from 'react-spinners';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';

// === Load server URL from environment ===
const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function DetailedCarInfo() {

    const { id } = useParams();
    const [vehicleInfo, setVehicleInfo] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [vehicleCategory, setVehicleCategory] = useState('');
    const [loadder, setLoadder] = useState(false)
    const [userDetails, setUserDetils] = useState({})

    useEffect(() => {
        const getVehicleInformation = async () => {
            setLoadder(true)
            try {
                const response = await axios.get(`${serverUrl}/vehicle/${id}`);
                setVehicleInfo(response.data);
                const userId = response.data.userId;
                if (userId) {
                    const userResponse = await axios.get(`${serverUrl}/user/${userId}`);
                    setUserDetils(userResponse.data.userDetails);
                }
                setLoadder(false)
            } catch (error) {
                setLoadder(false)
                console.error(error);
            }
        };
        getVehicleInformation();
    }, [id]);

    console.log(userDetails)

    useEffect(() => {
        const getCategoryById = async () => {
            setLoadder(true)
            if (!vehicleInfo?.category) return;
            try {
                const response = await axios.get(`${serverUrl}/category/${vehicleInfo.category}`);
                setVehicleCategory(response.data?.category?.category || '');
                setLoadder(false)
            } catch (error) {
                console.error(error);
                setLoadder(false)
            }
        };

        getCategoryById();
    }, [vehicleInfo?.category]);

    console.log(vehicleInfo)

    const goToPrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? vehicleInfo.images.length - 1 : prevIndex - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === vehicleInfo.images.length - 1 ? 0 : prevIndex + 1));
    };


    console.log(vehicleInfo?.bookingCount)
    const currentImage = vehicleInfo?.images?.[currentIndex];

    if (loadder) {
        return (
            <div className='h-[calc(99.8vh-78.4px)] w-full flex items-center justify-center relative top-[78px]'>
                <ClimbingBoxLoader />
            </div>
        )
    }

    return (
        <div className='h-[calc(99.8vh-78.4px)] flex relative top-[78px]'>
            <div className='w-[200vw] w-7/10 overflow-y-auto hide-scrollbar'>
                <div className='w-7/10 gb-lower h-135 flex justify-center items-center'>
                    <div className="relative w-230 h-125 my-4 overflow-hidden">
                        <img
                            src={`data:${currentImage?.contentType};base64,${currentImage?.data}`}
                            alt={`Slide ${currentIndex}`}
                            className="w-full h-full object-contain"
                        />

                        {vehicleInfo?.images.length > 1 && (
                            <>
                                <button
                                    onClick={goToPrev}
                                    className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white border-black border rounded bg-opacity-50 text-white p-1 "
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" class="size-5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" />
                                    </svg>

                                </button>
                                <button
                                    onClick={goToNext}
                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 border border-black bg-white rounded bg-opacity-50 text-white p-1"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" class="size-5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
                                    </svg>

                                </button>
                            </>
                        )}
                    </div>
                </div>
                <div className='w-7/10  gb-lower px-20 h-full flex flex-col'>
                    <div className='w-full h-[100px] flex border-b border-[#d4d4d4]'>
                        <div className='w-1/2'>
                            <h6 className='flex items-center mb30 !text-[13px] !text-[#7a7a7a] poppins-reguler'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="blue" className="mr-1 size-4 ">
                                    <path fill-rule="evenodd" d="M3.396 6.093a2 2 0 0 0 0 3.814 2 2 0 0 0 2.697 2.697 2 2 0 0 0 3.814 0 2.001 2.001 0 0 0 2.698-2.697 2 2 0 0 0-.001-3.814 2.001 2.001 0 0 0-2.697-2.698 2 2 0 0 0-3.814.001 2 2 0 0 0-2.697 2.697ZM6 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm3.47-1.53a.75.75 0 1 1 1.06 1.06l-4 4a.75.75 0 1 1-1.06-1.06l4-4ZM11 10a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" clip-rule="evenodd" />
                                </svg>
                                {`Host by ${userDetails?.fullname?.charAt(0).toUpperCase() + userDetails?.fullname?.slice(1)}`}
                            </h6>
                            <div className='my-3'>
                                <h4 className='poppins-bold m-0 mid'>{`${vehicleInfo?.make}-${vehicleInfo?.model}`}</h4>
                                <h6 className='poppins-semibold !text-[13px] !text-[#7a7a7a] mb-3'>{`${vehicleInfo?.fuelType}.${vehicleInfo?.transmission}.${vehicleInfo?.seatingCapacity} Seats`}</h6>
                            </div>
                        </div>
                        <div className='w-1/2 flex justify-end items-center'>
                            <div className='w-[160px] h-[65%] rounded-xl mr-5'>
                                <div className='w-full h-1/2 bg-mid rounded-t-xl flex items-center justify-center'>
                                    <h6 className='text-white flex items-center'>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4 mx-1">
                                            <path fill-rule="evenodd" d="M8 1.75a.75.75 0 0 1 .692.462l1.41 3.393 3.664.293a.75.75 0 0 1 .428 1.317l-2.791 2.39.853 3.575a.75.75 0 0 1-1.12.814L7.998 12.08l-3.135 1.915a.75.75 0 0 1-1.12-.814l.852-3.574-2.79-2.39a.75.75 0 0 1 .427-1.318l3.663-.293 1.41-3.393A.75.75 0 0 1 8 1.75Z" clip-rule="evenodd" />
                                        </svg>
                                        {`${vehicleInfo?.averageRating.toFixed(2)} (${vehicleInfo?.reviewCount})`}</h6>
                                </div>
                                <div className='w-full h-1/2 border !border-[#06923E] rounded-b-xl flex items-center justify-center'>
                                    <h6 className='poppins-semibold !text-[12px] m-0'>
                                        {`${vehicleInfo?.bookingCount ?? '0'} ${(vehicleInfo?.bookingCount == 1 || vehicleInfo?.bookingCount == 0) ? 'Booking' : 'Bookings'}`}
                                    </h6>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className='w-full h-20 border mt-2 rounded px-3 py-2'>
                        <h6 className='mb-0 !text-[#7a7a7a] poppins-semibold !text-[15px]'>Car location</h6>
                        <h6 className='!text-[13px] px-5 pt-2'>
                            {vehicleInfo?.location?.pickup}
                        </h6>
                    </div>
                    <h6 className='!text-[13px] mt-3 poppins-semibold mb-0'>Ratings & Review</h6>
                    <div className='w-full h-62 border mt-2 rounded px-3 py-2'>
                        <div className='h-1/5 flex justify-start'>
                            <div className='w-1/2 flex items-center'>
                                <h3 className='mid m-0'>{vehicleInfo?.averageRating.toFixed(2)}</h3>
                                <Stack spacing={1} className='mx-2'>
                                    <Rating name="half-rating-read" defaultValue={vehicleInfo?.averageRating} precision={0.5} readOnly />
                                </Stack>
                            </div>
                        </div>
                        <div className='w-4/5'>

                        </div>
                    </div>
                </div>

            </div>
            <div className='h-[calc(99.8vh-78.4px)] bg-[#f0eded] w-3/10 fixed top-20 right-0'>

            </div>
        </div>
    )
}
