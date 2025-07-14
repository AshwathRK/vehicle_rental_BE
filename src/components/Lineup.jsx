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

    const[search, setSearch] = useState([])
    const[serched, setSearched] = useState('')

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

    const [selectedFilter, setSelectedFilter] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState([]);

    // Catugory check
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

    const getSelectedFilters = () => {
        const { categories, ...rest } = checked;

        // 1. Get main filters that are true
        const selectedMain = Object.entries(rest)
            .filter(([_, value]) => value === true)
            .map(([key]) => key);

        // 2. Get categories that are true
        const selectedCategories = Object.entries(categories)
            .filter(([_, value]) => value === true)
            .map(([key]) => key);

        setSelectedFilter([...selectedMain]);
        setSelectedCategory([...selectedCategories]);

        return {
            filters: selectedMain,
            categories: selectedCategories,
        };
    };

    useEffect(() => {
        getSelectedFilters();
    }, [checked]);

    const allFilters = (selectedFilter.concat(selectedCategory));

    const searchValue = (event)=>{
        setSearch(event.target.value)
    }

    const setSearchValue = ()=>{
        setSearched(search)
    }

    console.log(serched)
    console.log(allFilters)
    console.log(value1)

    const resetFilters = () => {
        setChecked({
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
            categories: {}
        });
    }


    // --- UI ---
    return (
        <div className="lg:h-[calc(99.8vh-78.4px)] h-screen bg-lower flex flex-col lg:flex-row">
            {/* --- Left Sidebar: Filters --- */}
            <div className={`${isFiltersOpen ? 'lg:w-1/5 w-full h-screen fixed top-0 left-0 z-20 bg-white' : 'w-0 lg:w-1/5'} lg:relative lg:h-full h-auto border-r-2 lg:border-r-2 border-gray-200 accordion !bg-lower overflow-hidden transition-all duration-300`}>
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
                                    min={0}
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
                                            data-type="transmission"
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
                                            data-type="fual-type"
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
                                        data-type="Seate"
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
                                        data-type="Seate"
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
                                            data-type="UserRatings"
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
                className="lg:hidden block bg-mid text-white w-10 p-2 rounded fixed top-22 left-2 z-30"
                onClick={handleToggleFilters}
            >
                {isFiltersOpen
                    ? <img src="./close.png" className='w-5 h-5 invert' alt="Close" />
                    : <img src="./setting.png" className='w-5 h-5 invert' alt="Menu" />}
            </button>

            {/* --- Right Panel (Content area placeholder) --- */}

            <div className="flex-grow lg:pl-4">
                {/* Top section with search bar and filter apply */}
                <div className='w-full h-auto p-4 border-b-2 border-gray-200 lg:relative absolute top-[70px] lg:top-[0]'>
                    <div className='flex flex-col lg:flex-row items-center justify-between gap-4'>
                        <div className='flex flex-col lg:flex-row items-center gap-2 lg:gap-4 w-full lg:w-5/5'>
                            <input
                                type="text"
                                className='w-full lg:w-5/5 md:border border-green-700 bg-white py-2.5 px-4 rounded-lg poppins-semibold'
                                placeholder='Search here!'
                                onChange={searchValue}
                            />
                            <button
                                className='w-full lg:w-30 h-11 bg-green-200 rounded text-white bg-mid poppins-semibold flex items-center justify-center'
                                onClick={setSearchValue}
                            >
                                <img src="/Search.png" className='w-4 h-4 mx-2 invert' />
                                Search
                            </button>
                        </div>
                        {allFilters.length > 0 && (
                            <button className='poppins-bold border-2 rounded w-30 h-11' onClick={resetFilters}>Reset Filter</button>
                        )}
                    </div>
                    {/* Selected Filter Container */}
                    <div className="h-auto w-full flex items-center mt-4">
                        {/* Inner container with border */}
                        <div className="w-full h-auto flex flex-wrap items-center py-2 rounded gap-2">
                            {/* Map through selected filters and render each one */}
                            {allFilters.map((value, index) => (
                                <div
                                    key={value}
                                    className="h-7 flex items-center justify-center rounded overflow-hidden"
                                >
                                    {/* Filter value container */}
                                    <div className=" h-full bg-gray-500 flex justify-center items-center">
                                        <p className="poppins-semibold text-sm m-0 text-white px-2">
                                            {value.charAt(0).toUpperCase() + value.slice(1)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Content area */}
                <div className='w-full h-[590px] lg:h-[582px] hide-scrollbar'>
                    {/* Add your content here */}
                </div>
            </div>
        </div>
    );
}
