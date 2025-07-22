import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import axios from 'axios';
import { ClimbingBoxLoader } from 'react-spinners';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { toast } from 'react-toastify';

const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function AddCars() {
    const [value, setValue] = React.useState('1');
    const [categories, getCategories] = useState([])
    const [loadder, setLoadder] = useState(false)

    // Get tokens form the local storage
    const accessToken = sessionStorage.getItem('accessToken');
    const deviceId = sessionStorage.getItem('deviceId');

    const [modalOpen, setModalOpen] = useState(false);
    const [previewImages, setPreviewImages] = useState([]);
    // const [fileToUpload, setFileToUpload] = useState(null);
    const [fileToUpload, setFileToUpload] = useState([]);

    const navigator = useNavigate()
    const [vehicleInfo, setVehicleInfo] = useState({
        make: '',
        model: '',
        registerModel: '',
        category: '',
        registerNumber: '',
        transmission: '',
        fuelType: '',
        mileage: '',
        seatingCapacity: '',
        numberOfDoors: '',
        airConditioning: '',
        luggageCapacity: '',
        insuranceType: '',
        provider: '',
        expiryDate: '',
        minLicense: '',
        minage: '',
        lastServiced: '',
        nextServiceDue: '',
        vehicleCondition: '',
        odometerReading: '',
        pickup: '',
        drop: '',
        city: '',
        doorDelivery: '',
        fuelPolicy: '',
        pricePerHour: '',
        pricePerDay: '',
        weekdiscount: '',
        monthlydiscount: '',
    });

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        console.log(id, value)
        setVehicleInfo((prevInfo) => ({ ...prevInfo, [id]: value }));
    };

    useEffect(() => {
        const fetchAllCategory = async () => {
            setLoadder(true)
            try {
                const response = await axios.get(`${serverUrl}/categories`)
                getCategories(response.data.responce)
                // console.log(response.data.responce)
                setLoadder(false)
            } catch (error) {
                console.log(error)
            }

        }
        fetchAllCategory()
    }, [])

    const handleCancel = () => {
        navigator('/profile/carinfo')
    }

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (!vehicleInfo.make) newErrors.make = 'Vehicle brand is required';
        if (!vehicleInfo.model) newErrors.model = 'Model is required';
        if (!vehicleInfo.registerModel) newErrors.registerModel = 'Register Model is required';
        if (!vehicleInfo.category) newErrors.category = 'Category is required';
        if (!vehicleInfo.registerNumber) newErrors.registerNumber = 'Register Number is required';
        if (!vehicleInfo.transmission) newErrors.transmission = 'Transmission is required';
        if (!vehicleInfo.fuelType) newErrors.fuelType = 'Fuel Type is required';
        if (!vehicleInfo.mileage) newErrors.mileage = 'Mileage is required';
        if (!vehicleInfo.seatingCapacity) newErrors.seatingCapacity = 'Seating Capacity is required';
        if (!vehicleInfo.numberOfDoors) newErrors.numberOfDoors = 'Number Of Doors is required';
        if (!vehicleInfo.airConditioning) newErrors.airConditioning = 'Air Conditioning is required';
        if (!vehicleInfo.luggageCapacity) newErrors.luggageCapacity = 'Luggage Capacity is required';
        if (!vehicleInfo.insuranceType) newErrors.insuranceType = 'Insurance Type is required';
        if (!vehicleInfo.provider) newErrors.provider = 'Provider is required';
        if (!vehicleInfo.expiryDate) newErrors.expiryDate = 'Expiry Date is required';
        if (!vehicleInfo.lastServiced) newErrors.lastServiced = 'Last Serviced is required';
        if (!vehicleInfo.nextServiceDue) newErrors.nextServiceDue = 'Next Service is required';
        if (!vehicleInfo.doorDelivery) newErrors.doorDelivery = 'Door Delivery is required';
        if (!vehicleInfo.vehicleCondition) newErrors.vehicleCondition = 'Vehicle Condition is required';
        if (!vehicleInfo.odometerReading) newErrors.odometerReading = 'Odometer Reading is required';
        if (!vehicleInfo.pickup) newErrors.pickup = 'Pickup location is required';
        if (!vehicleInfo.drop) newErrors.drop = 'Drop location is required';
        if (!vehicleInfo.city) newErrors.city = 'City is required';
        if (!vehicleInfo.fuelPolicy) newErrors.fuelPolicy = 'Fuel Policy is required';
        if (!vehicleInfo.pricePerHour) newErrors.pricePerHour = 'Price Per Hour is required';
        if (!vehicleInfo.pricePerDay) newErrors.pricePerDay = 'Price Per Day is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleCloseModal = () => {
        setModalOpen(false);
        setPreviewImages(null);
    };

    const handleUpload = async () => {
        setModalOpen(false);
    }


    const handleBrowseImages = (e) => {
        const files = Array.from(e.target.files).slice(0, 5);
        const previews = files.map(file => URL.createObjectURL(file));
        setPreviewImages(previews);
        setFileToUpload(files); // ✅ Do NOT use `files` immediately here
    };


    const handleSubmit = async () => {
        if (!validateForm()) return;
        if (!fileToUpload.length) {
            console.warn("No images selected");
            return;
        }

        const formImage = new FormData();

        fileToUpload.forEach((file, index) => {
            console.log("Appending file", index, file.name); // ✅ Must log
            formImage.append('images', file); // ✅ Backend expects 'images'
        });

        formImage.append('vehicleInfo', JSON.stringify(vehicleInfo));

        try {
            const response = await axios.post(`${serverUrl}/vehicle`, formImage, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Device-Id': deviceId,
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success('The Vehicle has been created')
            setTimeout(() => {
                navigator('/profile/carinfo')
            }, 2000);
            console.log("Upload successful", response.data);
        } catch (error) {
            console.error("Upload failed", error);
        }
    };

    console.log(vehicleInfo)
    return (
        <div className='w-full h-full'>
            <>
                {
                    loadder ?
                        <div className='h-[40vw] w-full flex items-center justify-center'>
                            <ClimbingBoxLoader color="#36d7b7" />
                        </div> :
                        <Box sx={{ width: '100%', typography: 'body1' }}>
                            <TabContext value={value}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                                        <Tab label="Add New Car" value="1" />
                                    </TabList>
                                </Box>

                                {/* === Approved Vehicles Tab === */}
                                <TabPanel className="h-[calc(95.5vh-200px)] p-2 overflow-y-auto" value="1">
                                    <div className='w-full'>
                                        <h6 className='poppins-bold p-2'>Basic Vehicle Information</h6>
                                        <div className=' grid grid-cols-1 sm:grid-cols-3 gap-4 border-b pb-5 border-[#d4d4d4]'>
                                            <div className='px-2'>
                                                <label htmlFor="make" className='poppins-semibold text-sm my-2'>Vehicle brand</label>
                                                <input type="input"
                                                    id='make' className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] ${errors.accountnumber ? 'border-red-500' : ''}`} autoComplete="off"
                                                    placeholder='eg: Kia' value={vehicleInfo.make} onChange={handleInputChange} />
                                                {errors.make && <p className='text-red-500 text-xs'>{errors.make}</p>}
                                            </div>
                                            <div className='px-2'>
                                                <label htmlFor="model" className='poppins-semibold text-sm my-2'>Vehicle model</label>
                                                <input type="input"
                                                    id='model' className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] ${errors.accountnumber ? 'border-red-500' : ''}`} autoComplete="off"
                                                    placeholder='eg: Sonet' value={vehicleInfo.model} onChange={handleInputChange} />
                                                {errors.model && <p className='text-red-500 text-xs'>{errors.model}</p>}
                                            </div>
                                            <div className='px-2'>
                                                <label htmlFor="registerModel" className='poppins-semibold text-sm my-2'>Register Model</label>
                                                <input type="input"
                                                    id='registerModel' className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] ${errors.accountnumber ? 'border-red-500' : ''}`} autoComplete="off"
                                                    placeholder='eg: 2024' value={vehicleInfo.registerModel} onChange={handleInputChange} />
                                                {errors.registerModel && <p className='text-red-500 text-xs'>{errors.registerModel}</p>}
                                            </div>
                                            <div className='px-2'>
                                                <label htmlFor="category" className='poppins-semibold text-sm my-2 block text-black'>Category</label>
                                                <select
                                                    id='category'
                                                    className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] text-black ${errors.accountnumber ? 'border-red-500' : ''}`}
                                                    defaultValue=""
                                                    value={vehicleInfo.category} onChange={handleInputChange}
                                                >
                                                    <option value="" disabled>Select a category</option>
                                                    {
                                                        categories.map((value, key) => {
                                                            return (
                                                                <option key={key} value={value.id}>{value.category}</option>
                                                            );
                                                        })
                                                    }
                                                </select>
                                                {errors.category && <p className='text-red-500 text-xs'>{errors.category}</p>}
                                            </div>
                                            <div className='px-2'>
                                                <label htmlFor="registerNumber" className='poppins-semibold text-sm my-2'>Register Number</label>
                                                <input type="input"
                                                    id='registerNumber' className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] ${errors.accountnumber ? 'border-red-500' : ''}`} autoComplete="off"
                                                    placeholder='eg: CN02 AC0042' value={vehicleInfo.registerNumber} onChange={handleInputChange} />
                                                {errors.registerNumber && <p className='text-red-500 text-xs'>{errors.registerNumber}</p>}
                                            </div>
                                            <div className='px-2'>
                                                <label htmlFor="transmission" className='poppins-semibold text-sm my-2'>Transmission</label>
                                                <select
                                                    id='transmission'
                                                    className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] text-black ${errors.accountnumber ? 'border-red-500' : ''}`}
                                                    defaultValue=""
                                                    value={vehicleInfo.transmission} onChange={handleInputChange}
                                                >
                                                    <option value="" disabled>Select a transmisson</option>
                                                    <option value="Manual">Manual</option>
                                                    <option value="Automatic">Automatic</option>
                                                </select>
                                                {errors.transmission && <p className='text-red-500 text-xs'>{errors.transmission}</p>}
                                            </div>
                                            <div className='px-2'>
                                                <label htmlFor="fuelType" className='poppins-semibold text-sm my-2'>Fuel Type</label>
                                                <select
                                                    id='fuelType'
                                                    className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] text-black ${errors.accountnumber ? 'border-red-500' : ''}`}
                                                    defaultValue=""
                                                    value={vehicleInfo.fuelType} onChange={handleInputChange}
                                                >
                                                    <option value="" disabled>Select a transmisson</option>
                                                    <option value="Petrol">Petrol</option>
                                                    <option value="Diesel">Diesel</option>
                                                    <option value="Electric">Electric</option>
                                                    <option value="Hybrid">Hybrid</option>
                                                </select>
                                                {errors.fuelType && <p className='text-red-500 text-xs'>{errors.fuelType}</p>}
                                            </div>
                                            <div className='px-2'>
                                                <label htmlFor="mileage" className='poppins-semibold text-sm my-2'>Average Mileage</label>
                                                <input type="number"
                                                    id='mileage' className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] ${errors.accountnumber ? 'border-red-500' : ''}`} autoComplete="off"
                                                    placeholder='eg: 16/litre' value={vehicleInfo.mileage} onChange={handleInputChange} />
                                                {errors.mileage && <p className='text-red-500 text-xs'>{errors.mileage}</p>}
                                            </div>
                                            <div className='px-2'>
                                                <label htmlFor="seatingCapacity" className='poppins-semibold text-sm my-2'>Seating Capacity</label>
                                                <input type="number"
                                                    id='seatingCapacity' className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] ${errors.accountnumber ? 'border-red-500' : ''}`} autoComplete="off"
                                                    placeholder='eg: 5' value={vehicleInfo.seatingCapacity} onChange={handleInputChange} />
                                                {errors.seatingCapacity && <p className='text-red-500 text-xs'>{errors.seatingCapacity}</p>}
                                            </div>
                                            <div className='px-2'>
                                                <label htmlFor="numberOfDoors" className='poppins-semibold text-sm my-2'>Number Of Doors</label>
                                                <input type="number"
                                                    id='numberOfDoors' className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] ${errors.accountnumber ? 'border-red-500' : ''}`} autoComplete="off"
                                                    placeholder='eg: 4' value={vehicleInfo.numberOfDoors} onChange={handleInputChange} />
                                                {errors.numberOfDoors && <p className='text-red-500 text-xs'>{errors.numberOfDoors}</p>}
                                            </div>
                                            <div className='px-2'>
                                                <label htmlFor="airConditioning" className='poppins-semibold text-sm my-2'>Air Conditioning</label>
                                                <select
                                                    id='airConditioning'
                                                    className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] text-black ${errors.accountnumber ? 'border-red-500' : ''}`}
                                                    defaultValue=""
                                                    value={vehicleInfo.airConditioning} onChange={handleInputChange}
                                                >
                                                    <option value="" disabled>Select a transmisson</option>
                                                    <option value="Available">Available</option>
                                                    <option value="Not-Available">Not-Available</option>
                                                </select>
                                                {errors.airConditioning && <p className='text-red-500 text-xs'>{errors.airConditioning}</p>}
                                            </div>
                                            <div className='px-2'>
                                                <label htmlFor="luggageCapacity" className='poppins-semibold text-sm my-2'>Luggage Capacity</label>
                                                <select
                                                    id='luggageCapacity'
                                                    className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] text-black ${errors.accountnumber ? 'border-red-500' : ''}`}
                                                    defaultValue=""
                                                    value={vehicleInfo.luggageCapacity} onChange={handleInputChange}
                                                >
                                                    <option value="" disabled>Select a transmisson</option>
                                                    <option value="Small">Small</option>
                                                    <option value="Medium">Medium</option>
                                                    <option value="Large">Large</option>
                                                </select>
                                                {errors.luggageCapacity && <p className='text-red-500 text-xs'>{errors.luggageCapacity}</p>}
                                            </div>
                                        </div>

                                        <h6 className='poppins-bold p-2 mt-3'>Insurance and Devier requirement</h6>
                                        <div className=' grid grid-cols-1 sm:grid-cols-3 gap-4 border-b pb-5 border-[#d4d4d4]'>
                                            <div className='px-2'>
                                                <label htmlFor="insuranceType" className='poppins-semibold text-sm my-2'>Insurance Type</label>
                                                <select
                                                    id='insuranceType'
                                                    className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] text-black ${errors.accountnumber ? 'border-red-500' : ''}`}
                                                    defaultValue=""
                                                    value={vehicleInfo.insuranceType} onChange={handleInputChange}
                                                >
                                                    <option value="" disabled>Select a transmisson</option>
                                                    <option value="Comprehensive">Comprehensive</option>
                                                    <option value="Third-party">Third-party</option>

                                                </select>
                                                {errors.insuranceType && <p className='text-red-500 text-xs'>{errors.insuranceType}</p>}
                                            </div>
                                            <div className='px-2'>
                                                <label htmlFor="provider" className='poppins-semibold text-sm my-2'>Provider</label>
                                                <input type="input"
                                                    id='provider' className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] ${errors.accountnumber ? 'border-red-500' : ''}`} autoComplete="off"
                                                    placeholder='eg: Provider 91' value={vehicleInfo.provider} onChange={handleInputChange} />
                                                {errors.provider && <p className='text-red-500 text-xs'>{errors.provider}</p>}
                                            </div>
                                            <div className='px-2'>
                                                <label htmlFor="expiryDate" className='poppins-semibold text-sm my-2'>Insurance Expiry date</label>
                                                <input type="date"
                                                    id='expiryDate' className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] ${errors.accountnumber ? 'border-red-500' : ''}`} autoComplete="off"
                                                    placeholder='eg: mm-dd-yyyy' value={vehicleInfo.expiryDate} onChange={handleInputChange} />
                                                {errors.expiryDate && <p className='text-red-500 text-xs'>{errors.expiryDate}</p>}
                                            </div>
                                            <div className='px-2'>
                                                <label htmlFor="minLicense" className='poppins-semibold text-sm my-2'>Required Driving license</label>
                                                <input type="input"
                                                    id='minLicense' className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px]`} autoComplete="off"
                                                    placeholder='eg: LMV' value={vehicleInfo.minLicense} onChange={handleInputChange} />
                                            </div>
                                            <div className='px-2'>
                                                <label htmlFor="minage" className='poppins-semibold text-sm my-2'>Minimum Driver Age</label>
                                                <input type="input"
                                                    id='minage' className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px]`} autoComplete="off"
                                                    placeholder='eg: 21' value={vehicleInfo.minage} onChange={handleInputChange} />
                                            </div>
                                        </div>

                                        <h6 className='poppins-bold p-2 mt-3'>Maintanance Information</h6>
                                        <div className=' grid grid-cols-1 sm:grid-cols-3 gap-4 border-b pb-5 border-[#d4d4d4]'>
                                            <div className='px-2'>
                                                <label htmlFor="lastServiced" className='poppins-semibold text-sm my-2'>Last Serviced</label>
                                                <input type="date"
                                                    id='lastServiced' className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] ${errors.accountnumber ? 'border-red-500' : ''}`} autoComplete="off"
                                                    value={vehicleInfo.lastServiced} onChange={handleInputChange}
                                                />
                                                {errors.lastServiced && <p className='text-red-500 text-xs'>{errors.lastServiced}</p>}
                                            </div>
                                            <div className='px-2'>
                                                <label htmlFor="nextServiceDue" className='poppins-semibold text-sm my-2'>Next Service</label>
                                                <input type="date"
                                                    id='nextServiceDue' className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] ${errors.accountnumber ? 'border-red-500' : ''}`} autoComplete="off"
                                                    value={vehicleInfo.nextServiceDue} onChange={handleInputChange}
                                                />
                                                {errors.nextServiceDue && <p className='text-red-500 text-xs'>{errors.nextServiceDue}</p>}
                                            </div>
                                            <div className='px-2'>
                                                <label htmlFor="vehicleCondition" className='poppins-semibold text-sm my-2'>Vehicle Condition</label>
                                                <select
                                                    id='vehicleCondition'
                                                    className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] text-black ${errors.accountnumber ? 'border-red-500' : ''}`}
                                                    defaultValue=""
                                                    value={vehicleInfo.vehicleCondition} onChange={handleInputChange}
                                                >
                                                    <option value="" disabled>Select a transmisson</option>
                                                    <option value="Good">Good</option>
                                                    <option value="Needs Service">Needs Service</option>
                                                    <option value="Damaged">Damaged</option>

                                                </select>
                                                {errors.vehicleCondition && <p className='text-red-500 text-xs'>{errors.vehicleCondition}</p>}
                                            </div>
                                            <div className='px-2'>
                                                <label htmlFor="odometerReading" className='poppins-semibold text-sm my-2'>Odometer Reading</label>
                                                <input type="input"
                                                    id='odometerReading' className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] ${errors.accountnumber ? 'border-red-500' : ''}`} autoComplete="off"
                                                    placeholder='eg: 6000'
                                                    value={vehicleInfo.odometerReading} onChange={handleInputChange}
                                                />
                                                {errors.odometerReading && <p className='text-red-500 text-xs'>{errors.odometerReading}</p>}
                                            </div>
                                        </div>

                                        <h6 className='poppins-bold p-2 mt-3'>Booking Information</h6>
                                        <div className=' grid grid-cols-1 sm:grid-cols-3 gap-4 border-b pb-5 border-[#d4d4d4]'>
                                            <div className='px-2'>
                                                <label htmlFor="pickup" className='poppins-semibold text-sm my-2'>Pickup location</label>
                                                <input type="text"
                                                    id='pickup' className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] ${errors.accountnumber ? 'border-red-500' : ''}`} autoComplete="off"
                                                    placeholder='eg: F2, Ourhomes'
                                                    value={vehicleInfo.pickup} onChange={handleInputChange}
                                                />
                                                {errors.pickup && <p className='text-red-500 text-xs'>{errors.pickup}</p>}
                                            </div>
                                            <div className='px-2'>
                                                <label htmlFor="drop" className='poppins-semibold text-sm my-2'>Drop location</label>
                                                <input type="text"
                                                    id='drop' className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] ${errors.accountnumber ? 'border-red-500' : ''}`} autoComplete="off"
                                                    placeholder='eg: 5B, 11th cross'
                                                    value={vehicleInfo.drop} onChange={handleInputChange}
                                                />
                                                {errors.drop && <p className='text-red-500 text-xs'>{errors.drop}</p>}
                                            </div>
                                            <div className='px-2'>
                                                <label htmlFor="city" className='poppins-semibold text-sm my-2'>City</label>
                                                <input type="text"
                                                    id='city' className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] ${errors.accountnumber ? 'border-red-500' : ''}`} autoComplete="off"
                                                    placeholder='eg: Chennai'
                                                    value={vehicleInfo.city} onChange={handleInputChange}
                                                />
                                                {errors.city && <p className='text-red-500 text-xs'>{errors.city}</p>}
                                            </div>
                                            <div className='px-2'>
                                                <label htmlFor="doorDelivery" className='poppins-semibold text-sm my-2'>Will you deliver?</label>
                                                <select
                                                    id='doorDelivery'
                                                    className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] text-black ${errors.accountnumber ? 'border-red-500' : ''}`}
                                                    defaultValue=""
                                                    value={vehicleInfo.doorDelivery} onChange={handleInputChange}
                                                >
                                                    <option value="" disabled>Select a transmisson</option>
                                                    <option value="yes">Yes</option>
                                                    <option value="No">No</option>
                                                </select>
                                                {errors.doorDelivery && <p className='text-red-500 text-xs'>{errors.doorDelivery}</p>}
                                            </div>
                                            <div className='px-2'>
                                                <label htmlFor="fuelPolicy" className='poppins-semibold text-sm my-2'>Fuel Policy</label>
                                                <select
                                                    id='fuelPolicy'
                                                    className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] text-black ${errors.accountnumber ? 'border-red-500' : ''}`}
                                                    defaultValue=""
                                                    value={vehicleInfo.fuelPolicy} onChange={handleInputChange}
                                                >
                                                    <option value="" disabled>Select a transmisson</option>
                                                    <option value="Full-to-Full">Full-to-Full</option>
                                                    <option value="Prepaid">Prepaid</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                                {errors.fuelPolicy && <p className='text-red-500 text-xs'>{errors.fuelPolicy}</p>}
                                            </div>
                                        </div>

                                        <h6 className='poppins-bold p-2 mt-3'>Price Details</h6>
                                        <div className=' grid grid-cols-1 sm:grid-cols-3 gap-4 border-b pb-5 border-[#d4d4d4]'>
                                            <div className='px-2'>
                                                <label htmlFor="pricePerHour" className='poppins-semibold text-sm my-2'>Price Per Hour ₹</label>
                                                <input type="text"
                                                    id='pricePerHour' className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] ${errors.accountnumber ? 'border-red-500' : ''}`} autoComplete="off"
                                                    placeholder='eg: ₹120'
                                                    value={vehicleInfo.pricePerHour} onChange={handleInputChange}
                                                />
                                                {errors.pricePerHour && <p className='text-red-500 text-xs'>{errors.pricePerHour}</p>}
                                            </div>
                                            <div className='px-2'>
                                                <label htmlFor="pricePerDay" className='poppins-semibold text-sm my-2'>Price Per Day ₹</label>
                                                <input type="text"
                                                    id='pricePerDay' className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] ${errors.accountnumber ? 'border-red-500' : ''}`} autoComplete="off"
                                                    placeholder='eg: ₹2000' value={vehicleInfo.pricePerDay} onChange={handleInputChange}
                                                />
                                                {errors.pricePerDay && <p className='text-red-500 text-xs'>{errors.pricePerDay}</p>}
                                            </div>
                                            <div className='px-2'>
                                                <label htmlFor="weekdiscount" className='poppins-semibold text-sm my-2'>Weekly Discount [Optional]</label>
                                                <input type="number"
                                                    id='weekdiscount' className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] ${errors.accountnumber ? 'border-red-500' : ''}`} autoComplete="off"
                                                    placeholder='eg: 5%'
                                                    value={vehicleInfo.weekdiscount} onChange={handleInputChange}
                                                />

                                            </div>
                                            <div className='px-2'>
                                                <label htmlFor="monthlydiscount" className='poppins-semibold text-sm my-2'>Monthly Discount [Optional]</label>
                                                <input type="number"
                                                    id='monthlydiscount' className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px]`} autoComplete="off"
                                                    placeholder='eg: 8%'
                                                    value={vehicleInfo.monthlydiscount} onChange={handleInputChange}
                                                />
                                            </div>

                                        </div>

                                        <h6 className='poppins-bold p-2 mt-3'>Image</h6>
                                        <div className=' grid grid-cols-1 sm:grid-cols-3 gap-4 border-b pb-5 border-[#d4d4d4] flex items-center justify-center'>
                                            <Button
                                                component="label"
                                                role={undefined}
                                                variant="contained"
                                                tabIndex={-1}
                                                startIcon={<CloudUploadIcon />}
                                                onClick={() => setModalOpen(true)}
                                            >
                                                Upload files
                                            </Button>
                                            {previewImages && previewImages.length > 0 && (
                                                <div className="mb-4 flex flex-wrap justify-center gap-2">
                                                    {previewImages.map((img, index) => (
                                                        <img
                                                            key={index}
                                                            src={img}
                                                            alt={`Preview ${index}`}
                                                            className="w-20 h-20 object-cover rounded border"
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className='w-full h-20 flex items-center justify-end px-4'>
                                            <Stack direction="row" spacing={2}>
                                                <Button onClick={handleCancel} color="secondary">Cancel</Button>
                                                <Button onClick={handleSubmit} variant="contained" color="success">
                                                    Submit
                                                </Button>
                                            </Stack>
                                        </div>
                                    </div>
                                </TabPanel>
                            </TabContext>
                        </Box>
                }
                {/* Modal */}
                {modalOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
                        role="dialog"
                        aria-modal="true"
                        onClick={handleCloseModal}
                        onKeyDown={(e) => {
                            if (e.key === 'Escape') handleCloseModal();
                        }}
                        tabIndex={-1}
                    >
                        <div
                            className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative"
                            onClick={(e) => e.stopPropagation()} // Prevent close on modal body click
                        >
                            <h3 className="text-xl font-semibold mb-4 text-center">Select Images</h3>

                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleBrowseImages}
                                className="mb-4 w-full text-blue-400"
                            />

                            {previewImages && previewImages.length > 0 && (
                                <div className="mb-4 flex flex-wrap justify-center gap-2">
                                    {previewImages.map((img, index) => (
                                        <img
                                            key={index}
                                            src={img}
                                            alt={`Preview ${index}`}
                                            className="w-20 h-20 object-cover rounded border"
                                        />
                                    ))}
                                </div>
                            )}

                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={handleUpload}
                                    disabled={!previewImages || previewImages.length === 0}
                                    className={`px-4 py-2 rounded text-white mx-2 ${previewImages && previewImages.length > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                                >
                                    Upload
                                </button>
                                {previewImages && previewImages.length > 0 ? (
                                    <button
                                        onClick={() => setPreviewImages([])}
                                        className="px-4 py-2 rounded bg-red-200 hover:bg-red-300"
                                    >
                                        Delete
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleCloseModal}
                                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

            </>
        </div>
    )
}
