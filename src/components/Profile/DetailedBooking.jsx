import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

// === Load server URL from environment ===
const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function DetailedBooking() {
    const { id } = useParams();
    const [bookingInfo, setBookingInfo] = useState()
    const [paymentDetails, setPaymantDetails] = useState()
    const [vehicleInfo, setVehicleInfo] = useState()

    useEffect(() => {
        // Fetch booking details using the id from params
        const fetchBookingDetails = async () => {
            debugger
            const bookingId = id;
            try {
                const response = await axios.get(`${serverUrl}/booking/${bookingId}`, { withCredentials: true });
                
                if (response.status == 200) {
                    setBookingInfo(response?.data?.data)
                    const { data: paymentInfo } = await axios.get(
                        `${serverUrl}/payment/${response?.data?.data.paymentId}`
                    );
                    setPaymantDetails(paymentInfo?.data)
                    const {data: vehicleInformation} = await axios.get(`${serverUrl}/vehicle/${response?.data?.data.carId}`)
                    setVehicleInfo(vehicleInformation?.data)
                }
            } catch (error) {
                console.error('Error fetching booking details:', error);
            }
        };
        fetchBookingDetails();
    }, [id]);

    console.log(`BookingInformation`, bookingInfo)
    console.log(`paymentDetails`, paymentDetails)
    console.log(`vehicleInfo`, vehicleInfo)

    return (
        <div className='w-full h-full flex items-center justify-center'>
            <div className='h-[95%] w-[96%] bg-white border rounded'>
                <header className='w-full h-[10%] border-b border-[#d4d4d4] flex items-center'>
                    <div className='flex items-center'>
                        <div className='w-8 h-8 border flex items-center justify-center mx-3 rounded'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                            </svg>


                        </div>
                        <h6 className='m-0 poppins-semibold'>Booking Details</h6>
                    </div>
                </header>
                <div className='h-[90%] flex flex-col'>
                </div>
            </div>
        </div>
    )
}
