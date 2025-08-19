import axios from 'axios';
import Button from '@mui/material/Button';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ClimbingBoxLoader } from 'react-spinners';

// === Load server URL from environment ===
const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function DetailedBooking() {
    const { id } = useParams();
    const [bookingInfo, setBookingInfo] = useState()
    const [paymentDetails, setPaymantDetails] = useState()
    const [vehicleInfo, setVehicleInfo] = useState()
    const [ownerDetails, setOwnerDetails] = useState()
    const [loadder, setLoadder] = useState(false)

    useEffect(() => {
        // Fetch booking details using the id from params
        const fetchBookingDetails = async () => {
            setLoadder(true)
            const bookingId = id;
            try {
                const response = await axios.get(`${serverUrl}/booking/${bookingId}`, { withCredentials: true });

                if (response.status == 200) {
                    setBookingInfo(response?.data?.data)
                    const { data: paymentInfo } = await axios.get(
                        `${serverUrl}/payment/${response?.data?.data.paymentId}`
                    );
                    setPaymantDetails(paymentInfo)
                    const { data: vehicleInformation } = await axios.get(`${serverUrl}/vehicle/${response?.data?.data.carId}`)
                    if (vehicleInformation) {
                        setVehicleInfo(vehicleInformation)
                        const { data: vehicleOwnerDetails } = await axios.get(`${serverUrl}/user/${vehicleInformation?.userId}`)
                        // console.log(`vehicle owner details`,  vehicleOwnerDetails.userDetails)
                        setOwnerDetails(vehicleOwnerDetails.userDetails)
                    }
                }
            } catch (error) {
                console.error('Error fetching booking details:', error);
            }
            finally {
                setLoadder(false)
            }
        };
        fetchBookingDetails();
    }, [id]);

    console.log(`BookingInformation`, bookingInfo)
    console.log(`paymentDetails`, paymentDetails)
    console.log(`vehicleInfo`, vehicleInfo)
    console.log(`Owner Details`, ownerDetails)

    function formatDateTimeLocal(dateString) {
        const date = new Date(dateString);

        // Get components with leading zeros
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }


    if (loadder) {
        return (
            <div className='w-full h-full flex items-center justify-center'>
                <ClimbingBoxLoader />
            </div>
        )
    }

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
                    <div className='w-full h-[15%] border-b border-[#d4d4d4] flex flex-col items-center justify-center gap-1'>
                        <h5 className='m-0 h-[25px] poppins-semibold'>{`${vehicleInfo?.make} - ${vehicleInfo?.model}`}</h5>
                        <h5 className='m-0 h-[25px] !text-[13px] poppins-regular'>{`${vehicleInfo?.fuelType} - ${vehicleInfo?.transmission}`}</h5>
                    </div>
                    <div className='w-full h-full flex'>
                        <div className='h-[85%] w-[70%] h-full border-r border-[#d4d4d4] px-4'>
                            <h6 className='poppins-semibold pt-2'>Booking Details</h6>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                                {/* Field 1 */}
                                <div>
                                    <label htmlFor="startDate" className="poppins-semibold !text-[13px] my-2 block">
                                        Booking Start Date
                                    </label>
                                    <input
                                        value={formatDateTimeLocal(bookingInfo?.startDateTime)}
                                        type="datetime-local"
                                        name="startDate"
                                        className="w-full h-9 border rounded px-3 poppins-medium !text-[13px] bg-zinc-100"
                                        placeholder="Start date"
                                        disabled
                                    />
                                </div>

                                {/* Field 2 */}
                                <div>
                                    <label htmlFor="endDate" className="poppins-semibold !text-[13px] my-2 block">
                                        Booking End Date
                                    </label>
                                    <input
                                        value={formatDateTimeLocal(bookingInfo?.endDateTime)}
                                        type="datetime-local"
                                        name="endDate"
                                        className="w-full h-9 border rounded px-3 poppins-medium !text-[13px] bg-zinc-100"
                                        placeholder="End date"
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className=' gap-4 flex'>
                                <label htmlFor="endDate" className="poppins-semibold !text-[13px] my-2 block">
                                    Booking Address
                                </label>
                                <textarea
                                    name="message"
                                    id="message"
                                    value={`${bookingInfo?.address?.name || ""}\n${bookingInfo?.address?.email || ""}\n${bookingInfo?.address?.AddressLine1 || ''} ${bookingInfo?.address?.AddressLine2 || ''} ${bookingInfo?.address?.City || ''} ${bookingInfo?.address?.City || ''}\n${bookingInfo?.address?.state || ''} - ${bookingInfo?.address?.Zipcode || ''} \n${bookingInfo?.address?.mobile || ''}`}
                                    rows="4"
                                    className="w-full border rounded px-3 py-2 h-26 poppins-medium !text-[13px]"
                                    placeholder="booking address..."
                                    disabled
                                />

                            </div>
                            <h6 className='poppins-semibold pt-5'>Vehicle and Owner details</h6>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                                {/* Field 1 */}
                                <div>
                                    <label htmlFor="startDate" className="poppins-semibold !text-[13px] my-2 block">
                                        Vehicle Number
                                    </label>
                                    <input
                                        value={vehicleInfo?.licensePlate}
                                        type="text"
                                        name="startDate"
                                        className="w-full h-9 border rounded px-3 poppins-medium !text-[13px] bg-zinc-100"
                                        placeholder="Start date"
                                        disabled
                                    />
                                </div>

                                {/* Field 2 */}
                                <div>
                                    <label htmlFor="endDate" className="poppins-semibold !text-[13px] my-2 block">
                                        Owner Name
                                    </label>
                                    <input
                                        value={ownerDetails?.fullname?.charAt(0).toUpperCase() + ownerDetails?.fullname?.slice(1)}
                                        type="text"
                                        name="endDate"
                                        className="w-full h-9 border rounded px-3 poppins-medium !text-[13px] bg-zinc-100"
                                        placeholder="End date"
                                        disabled
                                    />
                                </div>
                            </div>
                            <div>
                                <div>
                                    <label htmlFor="endDate" className="poppins-semibold !text-[13px] my-2 block">
                                        Contact Details
                                    </label>
                                    <textarea
                                        value={`${ownerDetails?.fullname?.charAt(0).toUpperCase() + ownerDetails?.fullname?.slice(1) || ''} \n${ownerDetails?.email || ''} \n${ownerDetails?.phone || ''} \n${ownerDetails?.website ? ownerDetails?.website : ''}`}
                                        type="message"
                                        name="endDate"
                                        className="w-full h-20 border rounded px-3 poppins-medium !text-[13px] bg-zinc-100"
                                        placeholder="End date"
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='w-[30%]'>
                            <div className='px-4'>
                                <label htmlFor="endDate" className="poppins-semibold !text-[13px] my-2 block">
                                    Payment ID
                                </label>
                                <input
                                    value={paymentDetails?.id}
                                    type="text"
                                    name="endDate"
                                    className="w-full h-9 border rounded px-3 poppins-medium !text-[13px] bg-zinc-100"
                                    placeholder="End date"
                                    disabled
                                />
                            </div>

                            <div className='px-4'>
                                <label htmlFor="endDate" className="poppins-semibold !text-[13px] my-2 block">
                                    Total Amount
                                </label>
                                <input
                                    value={paymentDetails?.amount / 100}
                                    type="text"
                                    name="endDate"
                                    className="w-full h-9 border rounded px-3 poppins-medium !text-[13px] bg-zinc-100"
                                    placeholder="End date"
                                    disabled
                                />
                            </div>
                            <div>
                                <Button>Modify Booking</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
