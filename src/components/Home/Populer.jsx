import React, { useEffect, useState } from 'react'
import axios from 'axios'

const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function Populer() {
    const [topRatedCar, setTopRatedCars] = useState([]);
    const [topBookingCar, setTopBookigCars] = useState([])

    useEffect(() => {
        const fetchingTopRatedCars = async () => {
            try {
                const responce = await axios.get(`${serverUrl}/top-rated`)
                setTopRatedCars(responce.data)

            } catch (error) {
                console.log(error.message)
            }
        }
        const fetchingTopBookingCars = async () => {
            try {
                const responce = await axios.get(`${serverUrl}/topbooking`)
                setTopBookigCars(responce.data.vehicles)

            } catch (error) {
                console.log(error.message)
            }
        }

        fetchingTopRatedCars()
        fetchingTopBookingCars()

    }, [])

    console.log(topRatedCar)
    console.log(topBookingCar)
    return (
        <div className='h-screen bg-lower w-full flex'>
            <div className='h-full w-2/8'></div>
            <div className='h-full w-6/8 flex flex-col'>
                <div className='top-review w-full h-1/2'>
                    <div className='border-l-4 headding-topreview my-3 h-10'>
                        <h2 className='poppins-extrabold px-2 mid'>Highest Rated Vehicles</h2>
                    </div>
                        
                    <div>

                    </div>
                </div>
                <div className='high-booking w-full h-1/2'>
                    <div className='border-l-4 headding-topbooking my-3 h-10'>
                        <h2 className='poppins-extrabold px-2 primary'>Top Picks by Our Renters</h2>
                    </div>
                    <div>
                    </div>
                </div>
            </div>
        </div>
    )
}
