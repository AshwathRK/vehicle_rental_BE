import * as React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function Lineup() {
    const [categories, setCategories] = useState([]);
    const [manageCost, setManageCost] = React.useState({ maxPriceDay: 400 });
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
        categories: {} // <- dynamic categories will go here
    });
    const [isFiltersOpen, setIsFiltersOpen] = useState(window.innerWidth >= 1024);

    const handleToggleFilters = () => {
        setIsFiltersOpen(!isFiltersOpen);
    };

    useEffect(() => {
        const handleResize = () => {
            setIsFiltersOpen(window.innerWidth >= 1024);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

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

    console.log(manageCost)

    const [value1, setValue1] = React.useState([1000, 3000]);

    const handleCheck = (event) => {
        const { name, checked: isChecked, dataset } = event.target;

        // For dynamic category checkboxes
        if (dataset.type === "category") {
            setChecked((prev) => ({
                ...prev,
                categories: {
                    ...prev.categories,
                    [name]: isChecked
                }
            }));
        } else {
            // For static checkboxes
            setChecked((prev) => ({
                ...prev,
                [name]: isChecked
            }));
        }
    };


    const handleChange1 = (_event, newValue, activeThumb) => {
        if (!Array.isArray(newValue)) return;

        if (activeThumb === 0) {
            setValue1([Math.min(newValue[0], value1[1] - 10), value1[1]]);
        } else {
            setValue1([value1[0], Math.max(newValue[1], value1[0] + 10)]);
        }
    };

    // console.log(value1)
    // console.log(checked)

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

    return (
        <div className="h-[calc(99.8vh-78.4px)] bg-lower flex flex-col lg:flex-row">
            {/* Left side filters */}
            <div
                className={`${isFiltersOpen ? 'lg:w-1/5 w-full' : 'w-0 lg:w-0'
                    } bg-white lg:h-full h-auto border-r-2 lg:border-r-2 border-gray-200 accordion !bg-lower overflow-hidden transition-all duration-300`}
            >
                <div className="w-full pl-5">
                    <div className="w-full h-20 flex items-end">
                        <h5 className="poppins-semibold">Filters</h5>
                    </div>
                </div>
                <div className='overflow-y-auto h-[calc(100vh-178.4px)] scrollbar-hide'>
                    {/* Car types */}
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} className="h-15">
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

                    {/* Price Range */}
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography component="span">
                                <p className="font-bold m-0 text-md poppins-semibold">Price Range</p>
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{ width: "100%" }}>
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

                    {/* Transmission */}
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} className="h-15">
                            <Typography component="span">
                                <p className="font-bold m-0 text-md poppins-semibold">Transmission</p>
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className="flex flex-col gap-2">
                                <label className="flex items-center text-sm">
                                    <input
                                        type="checkbox"
                                        name="manual"
                                        checked={checked.manual}
                                        onChange={handleCheck}
                                        className="mx-2 w-4 h-4 accent-mid"
                                    />
                                    Manual
                                </label>
                                <label className="flex items-center text-sm">
                                    <input
                                        type="checkbox"
                                        name="automatic"
                                        checked={checked.automatic}
                                        onChange={handleCheck}
                                        className="mx-2 w-4 h-4 accent-mid"
                                    />
                                    Automatic
                                </label>
                            </div>
                        </AccordionDetails>
                    </Accordion>

                    {/* Fuel Type */}
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} className="h-15">
                            <Typography component="span">
                                <p className="font-bold m-0 text-md poppins-semibold">Fuel Type</p>
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className="flex flex-col gap-2">
                                <label className="flex items-center text-sm">
                                    <input
                                        type="checkbox"
                                        name="petrol"
                                        checked={checked.petrol}
                                        onChange={handleCheck}
                                        className="mx-2 w-4 h-4 accent-mid"
                                    />
                                    Petrol
                                </label>
                                <label className="flex items-center text-sm">
                                    <input
                                        type="checkbox"
                                        name="diesel"
                                        checked={checked.diesel}
                                        onChange={handleCheck}
                                        className="mx-2 w-4 h-4 accent-mid"
                                    />
                                    Diesel
                                </label>
                                <label className="flex items-center text-sm">
                                    <input
                                        type="checkbox"
                                        name="electric"
                                        checked={checked.electric}
                                        onChange={handleCheck}
                                        className="mx-2 w-4 h-4 accent-mid"
                                    />
                                    Electric
                                </label>
                                <label className="flex items-center text-sm">
                                    <input
                                        type="checkbox"
                                        name="cng"
                                        checked={checked.cng}
                                        onChange={handleCheck}
                                        className="mx-2 w-4 h-4 accent-mid"
                                    />
                                    CNG
                                </label>
                            </div>
                        </AccordionDetails>
                    </Accordion>

                    {/* Seats Type */}
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} className="h-15">
                            <Typography component="span">
                                <p className="font-bold m-0 text-md poppins-semibold">Seats</p>
                            </Typography>
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

                    {/* User Ratings */}
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} className="h-15">
                            <Typography component="span">
                                <p className="font-bold m-0 text-md poppins-semibold">User Ratings</p>
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className="flex flex-col gap-2">
                                <label className="flex items-center text-sm">
                                    <input
                                        type="checkbox"
                                        name="fourFiveRated"
                                        checked={checked.fourFiveRated}
                                        onChange={handleCheck}
                                        className="mx-2 w-4 h-4 accent-mid"
                                    />
                                    4.5+ Rated
                                </label>
                                <label className="flex items-center text-sm">
                                    <input
                                        type="checkbox"
                                        name="fourRated"
                                        checked={checked.fourRated}
                                        onChange={handleCheck}
                                        className="mx-2 w-4 h-4 accent-mid"
                                    />
                                    4+ Rated
                                </label>
                                <label className="flex items-center text-sm">
                                    <input
                                        type="checkbox"
                                        name="threeEightRated"
                                        checked={checked.threeEightRated}
                                        onChange={handleCheck}
                                        className="mx-2 w-4 h-4 accent-mid"
                                    />
                                    3.8+ Rated
                                </label>
                                <label className="flex items-center text-sm">
                                    <input
                                        type="checkbox"
                                        name="threeFiveRated"
                                        checked={checked.threeFiveRated}
                                        onChange={handleCheck}
                                        className="mx-2 w-4 h-4 accent-mid"
                                    />
                                    3.5+ Rated
                                </label>
                                <label className="flex items-center text-sm">
                                    <input
                                        type="checkbox"
                                        name="allRated"
                                        checked={checked.allRated}
                                        onChange={handleCheck}
                                        className="mx-2 w-4 h-4 accent-mid"
                                    />
                                    All
                                </label>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                </div>
            </div>

            {/* Toggle button */}
            <button
                className="lg:hidden block absolute bg-mid text-white w-10 top-22 left-2 p-2 rounded"
                onClick={handleToggleFilters}
            >
                {isFiltersOpen ? <img src="./close.png" className='w-5 h-5 invert' alt="Menu" /> 
                : <img src="./setting.png" className='w-5 h-5 invert' alt="Close" />}
            </button>

            {/* Right side placeholder */}
            <div className="flex-grow"></div>
        </div>
    );
}