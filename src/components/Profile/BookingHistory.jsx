import axios from 'axios';
import React from 'react'
import { useEffect } from 'react'

// === Load server URL from environment ===
const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function BookingHistory() {

    const accessToken = sessionStorage.getItem('accessToken');
    const deviceId = sessionStorage.getItem('deviceId');
    useEffect(() => {
        debugger
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

                if (!bookings || bookings.length === 0) {
                    console.warn("No bookings found for user");
                    return;
                }

                // 3️⃣ Pick the first booking (or whichever logic you need)
                const bookingId = bookings[0]._id;

                // 4️⃣ Get payment information for that booking
                const { data: paymentInfo } = await axios.get(`${serverUrl}/payment/${bookingId}`);

                console.log("Payment Information:", paymentInfo);
            } catch (error) {
                console.error("Error fetching payment information:", error);
            }
        };

        fetchPaymentInformation();
    }, []);


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
                <div className='h-[90%] flex '>

                    <div className='w-2/3 h-full'></div>
                </div>
            </div>
        </div>
    )
}
