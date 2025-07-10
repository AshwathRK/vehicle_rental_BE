import React, { useEffect, useState } from 'react'
import axios from 'axios'

const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function Populer() {
    const [topRatedCar, setTopRatedCars] = useState([])

    useEffect(() => {
        debugger
        const fetchingTopRatedCars = async () => {
            try {
                const responce = await axios.get(`${serverUrl}/top-rated`)
                setTopRatedCars(responce.data)

            } catch (error) {
                console.log(error.message)
            }
        }

        fetchingTopRatedCars()

    }, [])

    console.log(topRatedCar)
    return (
        <div className='h-screen bg-gray-300 w-full flex'>
            <div className='h-full w-2/8'></div>
            <div className='h-full w-6/8'></div>
        </div>
    )
}
