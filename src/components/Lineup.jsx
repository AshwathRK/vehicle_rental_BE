import * as React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';

// MUI Components
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { useLocation } from 'react-router-dom';

// --- ENV Config ---
const serverUrl = import.meta.env.VITE_SERVER_URL;
const secretKey = import.meta.env.VITE_SECRET_KEY;

export default function Lineup() {
    // --- State Management ---
    const [categories, setCategories] = useState([]);
    const [manageCost, setManageCost] = useState({ maxPriceDay: 400 }); // fetched price range
    const [value1, setValue1] = useState([1000, 3000]); // slider values
    const location = useLocation();
    const [categoryId, setCategoryId] = useState(null);

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const token = query.get('token');

        if (token) {
            try {
                const bytes = CryptoJS.AES.decrypt(token, secretKey);
                const decryptedId = bytes.toString(CryptoJS.enc.Utf8);
                setCategoryId(decryptedId);
            } catch (e) {
                console.error('Invalid token', e);
            }
        }
    }, [location.search]);

    // console.log(categoryId);

    // All filter checkbox states
    const [checked, setChecked] = useState({
        delivery: false,
        manual: false,
        automatic: false,
        petrol: false,
        diesel: false,
        electric: false,
        cng: false,
        fourSeats: false,
        sixSeats: false,
        fourFiveRated: false,
        fourRated: false,
        threeEightRated: false,
        threeFiveRated: false,
        allRated: false,
        categories: {} // <- dynamic categories
    });

    useEffect(() => {
        if (!categoryId || categories.length === 0) return;

        const matchedCategory = categories.find(cat => cat._id === categoryId);
        if (matchedCategory) {
            setChecked((prev) => ({
                ...prev,
                categories: {
                    ...prev.categories,
                    [matchedCategory.category]: true
                }
            }));
        }
    }, [categoryId, categories]);



    // Responsive filter visibility
    const [isFiltersOpen, setIsFiltersOpen] = useState(window.innerWidth >= 1024);

    // --- Handlers ---
    const handleToggleFilters = () => {
        setIsFiltersOpen(!isFiltersOpen);
    };

    const handleCheck = (event) => {
        const { name, checked: isChecked, dataset } = event.target;

        if (dataset.type === "category") {
            // --- Dynamic Category Filter ---
            setChecked((prev) => ({
                ...prev,
                categories: {
                    ...prev.categories,
                    [name]: isChecked
                }
            }));
        } else {
            // --- Static Filter ---
            setChecked((prev) => ({
                ...prev,
                [name]: isChecked
            }));
        }
    };

    const handleChange1 = (_event, newValue, activeThumb) => {
        // --- Price Range Slider Handler ---
        if (!Array.isArray(newValue)) return;

        if (activeThumb === 0) {
            setValue1([Math.min(newValue[0], value1[1] - 10), value1[1]]);
        } else {
            setValue1([value1[0], Math.max(newValue[1], value1[0] + 10)]);
        }
    };

    // --- Effect: Fetch categories ---
    useEffect(() => {
        const getCategories = async () => {
            try {
                const response = await axios.get(`${serverUrl}/categories`);
                setCategories(response.data.responce);
            } catch (error) {
                console.log(error.message);
            }
        };
        getCategories();
    }, []);

    // --- Effect: Fetch cost range ---
    useEffect(() => {
        const fetchCost = async () => {
            try {
                const response = await axios.get(`${serverUrl}/startfrom`);
                setManageCost(response.data.lowPrice[0]);
            } catch (error) {
                console.error(error);
            }
        };
        fetchCost();
    }, []);

    // --- Effect: Responsive filter toggle ---
    useEffect(() => {
        const handleResize = () => {
            setIsFiltersOpen(window.innerWidth >= 1024);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // --- UI ---
    return (
        <div className="h-[calc(99.8vh-78.4px)] bg-lower flex flex-col lg:flex-row">
            {/* --- Left Sidebar: Filters --- */}
            <div className={`${isFiltersOpen ? 'lg:w-1/5 w-full' : 'w-0 lg:w-0'} bg-white lg:h-full h-auto border-r-2 lg:border-r-2 border-gray-200 accordion !bg-lower overflow-hidden transition-all duration-300`}>
                <div className="w-full pl-5">
                    <div className="w-full h-20 flex items-end">
                        <h5 className="poppins-semibold">Filters</h5>
                    </div>
                </div>

                {/* --- Filters Scrollable List --- */}
                <div className='overflow-y-auto h-[calc(100vh-178.4px)] scrollbar-hide'>

                    {/* --- Car Types --- */}
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography component="span">
                                <p className="font-bold m-0 text-md poppins-semibold">Car Type</p>
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {categories.map((cat, idx) => (
                                <div className="flex flex-col gap-2" key={idx}>
                                    <label className="flex items-center text-sm">
                                        <input
                                            type="checkbox"
                                            name={cat.category}
                                            data-type="category"
                                            checked={checked.categories[cat.category] || false}
                                            onChange={handleCheck}
                                            className="mx-2 w-4 h-4 accent-mid"
                                        />
                                        {cat.category}
                                    </label>
                                </div>
                            ))}
                        </AccordionDetails>
                    </Accordion>

                    {/* --- Price Range --- */}
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography component="span">
                                <p className="font-bold m-0 text-md poppins-semibold">Price Range</p>
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{ width: "100%" }} className='px-3'>
                                <Slider
                                    getAriaLabel={() => 'Minimum distance'}
                                    value={value1}
                                    onChange={handleChange1}
                                    valueLabelDisplay="on"
                                    getAriaValueText={(value) => `${value}`}
                                    disableSwap
                                    min={manageCost.minPriceDay}
                                    max={manageCost.maxPriceDay}
                                />
                                <p>₹/per day</p>
                            </Box>
                        </AccordionDetails>
                    </Accordion>

                    {/* --- Transmission --- */}
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography><p className="font-bold m-0 text-md poppins-semibold">Transmission</p></Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className="flex flex-col gap-2">
                                {["manual", "automatic"].map((type) => (
                                    <label key={type} className="flex items-center text-sm">
                                        <input
                                            type="checkbox"
                                            name={type}
                                            checked={checked[type]}
                                            onChange={handleCheck}
                                            className="mx-2 w-4 h-4 accent-mid"
                                        />
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </label>
                                ))}
                            </div>
                        </AccordionDetails>
                    </Accordion>

                    {/* --- Fuel Type --- */}
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography><p className="font-bold m-0 text-md poppins-semibold">Fuel Type</p></Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className="flex flex-col gap-2">
                                {["petrol", "diesel", "electric", "cng"].map((fuel) => (
                                    <label key={fuel} className="flex items-center text-sm">
                                        <input
                                            type="checkbox"
                                            name={fuel}
                                            checked={checked[fuel]}
                                            onChange={handleCheck}
                                            className="mx-2 w-4 h-4 accent-mid"
                                        />
                                        {fuel.charAt(0).toUpperCase() + fuel.slice(1)}
                                    </label>
                                ))}
                            </div>
                        </AccordionDetails>
                    </Accordion>

                    {/* --- Seats --- */}
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography><p className="font-bold m-0 text-md poppins-semibold">Seats</p></Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className="flex flex-col gap-2">
                                <label className="flex items-center text-sm">
                                    <input
                                        type="checkbox"
                                        name="fourSeats"
                                        checked={checked.fourSeats}
                                        onChange={handleCheck}
                                        className="mx-2 w-4 h-4 accent-mid"
                                    />
                                    4/5 Seats
                                </label>
                                <label className="flex items-center text-sm">
                                    <input
                                        type="checkbox"
                                        name="sixSeats"
                                        checked={checked.sixSeats}
                                        onChange={handleCheck}
                                        className="mx-2 w-4 h-4 accent-mid"
                                    />
                                    6/7 Seats
                                </label>
                            </div>
                        </AccordionDetails>
                    </Accordion>

                    {/* --- Ratings --- */}
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography><p className="font-bold m-0 text-md poppins-semibold">User Ratings</p></Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className="flex flex-col gap-2">
                                {[
                                    { name: "fourFiveRated", label: "4.5+ Rated" },
                                    { name: "fourRated", label: "4+ Rated" },
                                    { name: "threeEightRated", label: "3.8+ Rated" },
                                    { name: "threeFiveRated", label: "3.5+ Rated" },
                                    { name: "allRated", label: "All" },
                                ].map(({ name, label }) => (
                                    <label key={name} className="flex items-center text-sm">
                                        <input
                                            type="checkbox"
                                            name={name}
                                            checked={checked[name]}
                                            onChange={handleCheck}
                                            className="mx-2 w-4 h-4 accent-mid"
                                        />
                                        {label}
                                    </label>
                                ))}
                            </div>
                        </AccordionDetails>
                    </Accordion>
                </div>
            </div>

            {/* --- Mobile Filter Toggle Button --- */}
            <button
                className="lg:hidden block absolute bg-mid text-white w-10 top-22 left-2 p-2 rounded"
                onClick={handleToggleFilters}
            >
                {isFiltersOpen
                    ? <img src="./close.png" className='w-5 h-5 invert' alt="Close" />
                    : <img src="./setting.png" className='w-5 h-5 invert' alt="Menu" />}
            </button>

            {/* --- Right Panel (Content area placeholder) --- */}
            <div className="flex-grow">
                <div className='w-full h-1/5'>
                    <div className='h-3/5 flex items-center'>
                        <input type="text" className='md:border my-2 border-green-700 bg-white w-40 md:w-4/5 py-2.5 px-4 rounded-lg mx-2 md:mx-3 poppins-semibold' placeholder='Search here!' />
                        <button className='w-30 h-11 mx-1 bg-green-200 rounded text-white bg-mid poppins-semibold flex items-center justify-center'>
                            <img src="/Search.png" className='w-4 h-4 mx-2 invert' />
                            Search
                        </button>
                    </div>
                    <div className='h-2/5'></div>
                </div>
                <div className='w-full h-/5 hide-scrollbar'></div>
            </div>
        </div>
    );
}
