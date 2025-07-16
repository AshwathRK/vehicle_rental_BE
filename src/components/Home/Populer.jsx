import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// === Load server URL from environment ===
const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function Populer() {
    // === State: Store top-rated and top-booked cars ===
    const [topRatedCar, setTopRatedCars] = useState([]);
    const [topBookingCar, setTopBookingCars] = useState([]);

    // === State: Manage image indices for sliders ===
    const [imageIndicesForRating, setImageIndicesForRating] = useState({});
    const [imageIndices, setImageIndices] = useState({});

    // === State: Manage min and max cost ===
    const [manageCost, setManageCost] = useState({});

    // === useEffect: Fetch data for top-rated and top-booking cars on mount ===
    useEffect(() => {
        // --- Fetch top-rated cars ---
        const fetchingTopRatedCars = async () => {
            try {
                const response = await axios.get(`${serverUrl}/top-rated`);
                setTopRatedCars(response.data);

                // Initialize image index for each car
                const ratedIndices = {};
                response.data.forEach((car) => {
                    ratedIndices[car.vehicle._id] = 0;
                });
                setImageIndicesForRating((prev) => ({ ...prev, ...ratedIndices }));
            } catch (error) {
                console.log(error.message);
            }
        };

        // --- Fetch top-booking cars ---
        const fetchingTopBookingCars = async () => {
            try {
                const response = await axios.get(`${serverUrl}/topbooking`);
                setTopBookingCars(response.data.vehicles);

                const bookingIndices = {};
                response.data.vehicles.forEach((car) => {
                    bookingIndices[car._id] = 0;
                });
                setImageIndices((prev) => ({ ...prev, ...bookingIndices }));
            } catch (error) {
                console.log(error.message);
            }
        };

        fetchingTopRatedCars();
        fetchingTopBookingCars();
    }, []);

    useEffect(() => {
        const fetchCost = async () => {
            try {
                const responce = await axios.get(`${serverUrl}/startfrom`);
                setManageCost(responce.data.lowPrice[0])
            } catch (error) {
                console.log(error.message);
            }
        }
        fetchCost()
    }, [])

    // console.log(manageCost)

    // === Image Slider Functions for Top-Rated Cars ===
    const handlePrevForRate = (id, length) => {
        setImageIndicesForRating((prev) => ({
            ...prev,
            [id]: prev[id] === 0 ? length - 1 : prev[id] - 1,
        }));
    };

    const handleNextForRate = (id, length) => {
        setImageIndicesForRating((prev) => ({
            ...prev,
            [id]: prev[id] === length - 1 ? 0 : prev[id] + 1,
        }));
    };

    // === Image Slider Functions for Top-Booking Cars ===
    const handlePrev = (id, length) => {
        setImageIndices((prev) => ({
            ...prev,
            [id]: prev[id] === 0 ? length - 1 : prev[id] - 1,
        }));
    };

    const handleNext = (id, length) => {
        setImageIndices((prev) => ({
            ...prev,
            [id]: prev[id] === length - 1 ? 0 : prev[id] + 1,
        }));
    };

    // console.log(topRatedCar)

    // === Main UI Rendering ===
    return (
        <div className="w-full flex flex-col lg:flex-row gap-2">
            {/* Sidebar or filter area (Cost Information) */}
            <div className="w-full lg:w-2/8 color">
                <section className='h-auto lg:h-1/2 lg:mb-0'>
                    <div className='w-full h-20 flex justify-center items-center py-3'>
                        <h2 className='poppins-bold text-lg text-white'>Cost Information</h2>
                    </div>
                    <div className="features px-5 flex flex-col justify-around lg:h-3/5 h-auto">
                        <div className="card1 mb-3 relative flex justify-center items-end">
                            <img src="/Price.jpg" alt="Price" className='w-full h-40 rounded-xl opacity-30' />
                            <div className='absolute h-16 w-full rounded-b-xl flex flex-col items-center lg-grad'>
                                <h4 className="title text-sm m-0 text-gray-600 text-white">Starting Price</h4>
                                <p className="text-md font-medium m-0 text-black text-white">₹{manageCost.minPrice}/hr | ₹{manageCost.minPriceDay}/day</p>
                            </div>
                        </div>

                        <div className="card1 mb-3 relative flex justify-center items-end">
                            <img src="/Quality.avif" alt="Price" className='w-full h-40 rounded-xl opacity-30' />
                            <div className='absolute h-16 w-full rounded-b-xl flex flex-col items-center lg-grad'>
                                <h4 className="title text-sm m-0 text-gray-600 text-white">Expense Cost</h4>
                                <p className="text-md font-medium m-0 text-black text-white">₹{manageCost.maxPrice}/hr | ₹{manageCost.maxPriceDay}/day</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section className='h-auto lg:h-1/2 flex flex-col items-center'>
                    <div className='w-full h-20 flex justify-center items-center py-3'>
                        <h5 className='poppins-bold text-lg text-white'>
                            ⭐ Why Choose Us / Key Features
                        </h5>
                    </div>

                    <div className="features flex flex-col gap-2 lg:h-3/5 h-auto">
                        <p className='text-white text-base flex items-center md:m-0'><img src="./arrow.png" className='w-5 h-5 mx-2' alt="arrow" /> 24/7 Roadside Assistance</p>
                        <p className='text-white text-base flex items-center'><img src="./arrow.png" className='w-5 h-5 mx-2' alt="arrow" /> Affordable Daily Rates</p>
                        <p className='text-white text-base flex items-center'><img src="./arrow.png" className='w-5 h-5 mx-2' alt="arrow" /> Wide Range of Vehicles</p>
                        <p className='text-white text-base flex items-center'><img src="./arrow.png" className='w-5 h-5 mx-2' alt="arrow" /> Easy Online Booking</p>
                        <p className='text-white text-base flex items-center'><img src="./arrow.png" className='w-5 h-5 mx-2' alt="arrow" /> Flexible Pick-up/Drop-off</p>
                    </div>
                </section>
            </div>

            {/* Main content area */}
            <div className="w-full lg:w-6/8 py-4 flex flex-col gap-2">
                {/* === Highest Rated Vehicles Section === */}
                <div className="top-review w-full h-1/2 rounded">
                    <div className="headding-topreview h-2/10 w-full flex items-center">
                        <h2 className="poppins-extrabold px-2 py-3 mid">Highest Rated Vehicles</h2>
                    </div>

                    <div className="flex items-center h-8/10 overflow-x-auto scrollbar-thin scrollbar-thumb-mid scrollbar-track-gray-100 gap-1 px-1">
                        {topRatedCar.map((value, key) => {
                            const car = value.vehicle;
                            const images = car.images || [];
                            const imageIndex = imageIndicesForRating[car._id] ?? 0;
                            const imageData = images[imageIndex];
                            const imageSrc = imageData
                                ? `data:${imageData.contentType};base64,${imageData.data}`
                                : './fallback.jpg';

                            return (
                                <div key={key} className="min-w-[340px] h-76 border rounded shadow mx-1 flex-shrink-0 bg-white relative">
                                    <div className="h-4/5 relative">
                                        {/* === Car Image === */}
                                        <img
                                            src={imageSrc}
                                            alt={`${car.make}-${car.model}`}
                                            className="w-[340px] h-[200px] object-cover rounded-t-md mx-auto"
                                        />

                                        {/* === Image Navigation Buttons === */}
                                        {images.length > 1 && (
                                            <>
                                                <button onClick={() => handlePrevForRate(car._id, images.length)} className="absolute top-1/2 left-2 -translate-y-1/2 bg-black bg-opacity-40 p-1 rounded-full text-white hover:bg-opacity-70 z-10">
                                                    <ChevronLeft size={20} />
                                                </button>
                                                <button onClick={() => handleNextForRate(car._id, images.length)} className="absolute top-1/2 right-2 -translate-y-1/2 bg-black bg-opacity-40 p-1 rounded-full text-white hover:bg-opacity-70 z-10">
                                                    <ChevronRight size={20} />
                                                </button>
                                            </>
                                        )}

                                        {/* === Overlay Info (Car Name, Specs, Rating) === */}
                                        <div className="w-full h-20 absolute bottom-0 left-0 flex justify-between px-2 lg-grad">
                                            <div className="h-full flex flex-col justify-center">
                                                <h6 className="text-white poppins-semibold">{car.make} - {car.model}</h6>
                                                <p className="text-white poppins-semibold text-[12px]">
                                                    {car.fuelType}. {car.transmission}. {car.seatingCapacity} Seats
                                                </p>
                                            </div>
                                            <div className="w-[120px] flex items-center">
                                                <img src="./reviewstar.png" className="w-4 mx-2" alt="review star" />
                                                <h6 className="text-white poppins-semibold m-0">
                                                    {value.averageRating.toFixed(2)} ({value.reviewCount})
                                                </h6>
                                            </div>
                                        </div>
                                    </div>

                                    {/* === Pricing & Booking Button === */}
                                    <div className="w-full h-1/5 px-2 flex items-center justify-between bg-white">
                                        <div className="flex flex-col">
                                            <p className="text-sm m-0 poppins-bold mx-2">₹{car.pricePerDay} /day</p>
                                            {car.delivery && (
                                                <p className="text-sm m-0 poppins-bold flex items-center">
                                                    <img src="./destination.png" className="w-3 h-3 mx-1" alt="Delivery" />
                                                    Delivery available
                                                </p>
                                            )}
                                        </div>
                                        <button className="bg-mid text-white px-3 py-1 rounded text-sm hover:bg-orange-600">
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* === Top Booked Vehicles Section === */}
                <div className="high-booking w-full h-1/2 rounded">
                    <div className="headding-topbooking h-2/10 w-full flex items-center">
                        <h2 className="poppins-extrabold px-2 py-3  primary">Top Picks by Our Renters</h2>
                    </div>

                    <div className="flex items-center h-8/10 overflow-x-auto scrollbar-thin scrollbar-thumb-mid scrollbar-track-gray-100 gap-1 px-1">
                        {topBookingCar.map((car, key) => {
                            const images = car.images || [];
                            const imageIndex = imageIndices[car._id] || 0;
                            const imageData = images[imageIndex];
                            const imageSrc = imageData
                                ? `data:${imageData.contentType};base64,${imageData.data}`
                                : './fallback.jpg';

                                // console.log(imageData)
                                // console.log(imageSrc)
                            return (
                                <div key={key} className="min-w-[340px] h-76 border rounded shadow mx-1 flex-shrink-0 bg-white relative">
                                    <div className="h-4/5 relative">
                                        {/* === Car Image === */}
                                        <img
                                            src={imageSrc}
                                            alt={`${car.make}-${car.model}`}
                                            className="w-[340px] h-[200px] object-cover rounded-t-md mx-auto"
                                        />

                                        {/* === Image Navigation Buttons === */}
                                        {images.length > 1 && (
                                            <>
                                                <button onClick={() => handlePrev(car._id, images.length)} className="absolute top-1/2 left-2 -translate-y-1/2 bg-black bg-opacity-40 p-1 rounded-full text-white hover:bg-opacity-70 z-10">
                                                    <ChevronLeft size={20} />
                                                </button>
                                                <button onClick={() => handleNext(car._id, images.length)} className="absolute top-1/2 right-2 -translate-y-1/2 bg-black bg-opacity-40 p-1 rounded-full text-white hover:bg-opacity-70 z-10">
                                                    <ChevronRight size={20} />
                                                </button>
                                            </>
                                        )}

                                        {/* === Overlay Info (Car Name, Specs, Booking Count) === */}
                                        <div className="w-full h-20 absolute bottom-0 left-0 flex justify-between px-2 lg-grad">
                                            <div className="h-full flex flex-col justify-center">
                                                <h6 className="text-white poppins-semibold">{car.make} - {car.model}</h6>
                                                <p className="text-white poppins-semibold text-[12px]">
                                                    {car.fuelType}. {car.transmission}. {car.seatingCapacity} Seats
                                                </p>
                                            </div>
                                            <div className="w-[120px] flex items-center">
                                                <img src="./reviewstar.png" className="w-4 mx-2" alt="review star" />
                                                <h6 className="text-white poppins-semibold m-0">
                                                    Chosen by {car.bookingCount} renter{car.bookingCount !== 1 && 's'}
                                                </h6>
                                            </div>
                                        </div>
                                    </div>

                                    {/* === Pricing & Booking Button === */}
                                    <div className="w-full h-1/5 px-2 flex items-center justify-between bg-white">
                                        <div className="flex flex-col">
                                            <p className="text-sm m-0 poppins-bold mx-2">₹{car.pricePerDay} /day</p>
                                            {car.delivery && (
                                                <p className="text-sm m-0 poppins-bold flex items-center">
                                                    <img src="./destination.png" className="w-3 h-3 mx-1" alt="Delivery" />
                                                    Delivery available
                                                </p>
                                            )}
                                        </div>
                                        <button className="bg-primery text-white px-3 py-1 rounded text-sm hover:bg-orange-600">
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

        </div>
    );
}
