import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ClimbingBoxLoader } from 'react-spinners';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

// === Load server URL from environment ===
const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function DetailedCarInfo() {

    const { id } = useParams();
    const [vehicleInfo, setVehicleInfo] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [vehicleCategory, setVehicleCategory] = useState('');
    const [loadder, setLoadder] = useState(false)
    const [userDetails, setUserDetils] = useState({})
    const [reviews, setReviews] = useState({})
    const [similarcars, setSimilarCars] = useState({})

    useEffect(() => {
        const getVehicleInformation = async () => {
            setLoadder(true)
            try {
                const response = await axios.get(`${serverUrl}/vehicle/${id}`);
                setVehicleInfo(response.data);
                const userId = response.data.userId;
                console.log(response.data)
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

    useEffect(() => {
        const getCategoryById = async () => {
            // debugger
            setLoadder(true)
            if (!vehicleInfo?.category) return;
            try {
                const response = await axios.get(`${serverUrl}/categorie/${vehicleInfo.category}`);
                setVehicleCategory(response.data?.category?.category || '');
                setLoadder(false)
            } catch (error) {
                console.error(error);
                setLoadder(false)
            }
        };
        getCategoryById();
    }, [vehicleInfo?.category]);

    useEffect(() => {
        const similerCars = async () => {
            try {
                const response = await axios.get(`${serverUrl}/similarcars/${vehicleInfo.category}`, {
                    withCredentials: true,
                })
                setSimilarCars(response.data.suggestedVehicles)
            } catch (error) {
                console.log(error)
            }
        }
        similerCars()
    }, [vehicleInfo])

    const goToPrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? vehicleInfo.images.length - 1 : prevIndex - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === vehicleInfo.images.length - 1 ? 0 : prevIndex + 1));
    };


    const currentImage = vehicleInfo?.images?.[currentIndex];

    useEffect(() => {
        const getRatingsAndReviews = async () => {
            try {
                const response = await axios.get(`${serverUrl}/review/car/${id}`);
                if (response.data.length !== 0) {
                    const reviewsWithUserInfo = await Promise.allSettled(response.data.map(async (value) => {
                        try {
                            const userInfoResponse = await axios.get(`${serverUrl}/user/${value.userId._id}`);
                            return { ...value, userInfo: userInfoResponse.data };
                        } catch (error) {
                            console.log(`Error fetching user info for ${value.userId.user}:`, error);
                            return { ...value, userInfo: null }; // or some default value
                        }
                    }));
                    const fulfilledReviews = reviewsWithUserInfo.filter((result) => result.status === 'fulfilled').map((result) => result.value);
                    setReviews(fulfilledReviews);
                } else {
                    setReviews([]); // or some default value
                }
            } catch (error) {
                console.log(error);
            }
        };

        getRatingsAndReviews();
    }, [id, serverUrl]);

    // console.log(reviews)

    const formatDate = (dateString) => {
        if (!dateString) return "No date available";
        let date = new Date(dateString);
        return date.toLocaleString();
    }

    const getProfileImage = (profile) => {
        if (!profile || profile.length === 0) return "/boy.png";
        const img = profile[0];
        const uint8Array = new Uint8Array(img.data.data);
        const blob = new Blob([uint8Array], { type: img.contentType });
        return URL.createObjectURL(blob);
    };

    if (loadder) {
        return (
            <div className='h-[calc(99.8vh-78.4px)] w-full flex items-center justify-center relative top-[78px]'>
                <ClimbingBoxLoader />
            </div>
        )
    }

    console.log(similarcars)

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
                        <div className='h-1/5 flex justify-start flex'>
                            <div className='w-1/2 flex items-center'>
                                <h3 className='mid m-0'>{vehicleInfo?.averageRating.toFixed(2)}</h3>
                                <Stack spacing={1} className='mx-2'>
                                    <Rating name="half-rating-read" defaultValue={vehicleInfo?.averageRating} precision={0.5} readOnly />
                                </Stack>
                            </div>
                            <div className='w-1/2 flex justify-end items-center'>
                                {
                                    reviews.length > 5 ? <a href="" className='flex items-center !no-underline'>see more
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="mx-2 mb-0 size-4">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                        </svg>
                                    </a> : ''
                                }

                            </div>
                        </div>
                        <div className='w-4/5'>
                            <h6 className='!text-[12px] poppins-semibold'>Reviews</h6>
                            <div className='w-[880px] h-[160px]'>
                                <div className='w-full h-full overflow-y-auto flex gap-2'>

                                    {
                                        reviews.length === 0 ? <h6>No reviews</h6> :
                                            Array.isArray(reviews) && reviews.map((value, key) => (
                                                <div key={value.id || key} className='h-full w-42 rounded border px-2'>
                                                    <section className='w-full h-1/3 flex items-center'>
                                                        <img
                                                            src={getProfileImage(value.userInfo.userDetails.profile)}
                                                            className='w-8 h-8 rounded-[50%] object-cover'
                                                        />
                                                        <div className='h-full w-[140px] px-3 flex flex-col justify-center'>
                                                            <h6 className='!text-[13px] m-0'>{value.userInfo.userDetails.fullname}</h6>
                                                            <p className='!text-[10px] m-0 !text-[#7a7a7a]'>{formatDate(value.createdAt)}</p>
                                                        </div>
                                                    </section>
                                                    <div className='h-2/3 p-1'>
                                                        <p className='!text-[10px] overflow-wrap break-word'>
                                                            {value.comment}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                    <h6 className='!text-[13px] mt-3 poppins-semibold mb-2'>Similar Listings</h6>
                    <div className='w-full h-[200px] rounded overflow-x-auto  gap-2 flex items-center px-1'>

                        {
                            Array.isArray(similarcars) && similarcars.map((value, index) => (
                                <Link to={`/car/${value._id}`} key={index} className="no-underline">
                                    <div className="w-[200px] h-[180px] border rounded overflow-hidden flex flex-col hover:shadow-xl cursor-pointer transition-all duration-300">
                                        <img
                                            src={getProfileImage(value.images)}
                                            alt={`${value.make} ${value.model}`}
                                            className="w-full h-[60%] object-cover"
                                        />
                                        <div className="h-[40%] p-2 flex justify-between">
                                            <div className="flex flex-col justify-center">
                                                <h6 className="text-sm font-semibold m-0">{`${value.make} ${value.model}`}</h6>
                                                <p className="text-xs text-gray-600 m-0">
                                                    {`${value.transmission} • ${value.fuelType} • ${value.seatingCapacity} Seats`}
                                                </p>
                                            </div>
                                            <div className="flex items-center text-right">
                                                <h6 className="text-sm font-medium m-0">{`₹${value.pricePerDay}/day`}</h6>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        }
                    </div>
                </div>

            </div>
            <div className='h-[calc(99.8vh-78.4px)] bg-[#f0eded] w-3/10 fixed top-20 right-0'>

            </div>
        </div>
    )
}
