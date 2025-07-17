import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import { ClipLoader } from 'react-spinners';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// === Load server URL from environment ===
const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function UserDetails() {

    const [userInfo, setuseInfo] = useState([]);
    const [formData, setFormData] = useState({
        fullname: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        secondary: '',
        website: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isPasswordEditing, setIsPasswordEditing] = useState(false);
    const navigate = useNavigate()

    // Get tokens form the local storage
    const accessToken = sessionStorage.getItem('accessToken');
    const deviceId = sessionStorage.getItem('deviceId');

    useEffect(() => {
        const checkAuth = async () => {
            // debugger
            try {
                const res = await axios.get(`${serverUrl}`, {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Device-Id': deviceId
                    }
                });
                if (res.status === 200) {
                    setuseInfo(res.data.user);
                }
            } catch (err) {
                console.log(err?.response?.data?.message || "Not logged in");
            }
        };
        checkAuth();
    }, []);

    useEffect(() => {
        if (userInfo) {
            setFormData({
                fullname: userInfo?.fullname || '',
                firstName: userInfo?.firstName || '',
                lastName: userInfo?.lastName || '',
                email: userInfo?.email || '',
                phone: userInfo?.phone || '',
                secondary: userInfo?.secondary || '',
                website: userInfo?.website || ''
            });
        }
    }, [userInfo]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handlePAsswordEditClick = () => {
        setIsPasswordEditing(true);
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSave = async () => {
        try {
            const res = await axios.put(`${serverUrl}/update-profile`, formData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Device-Id': deviceId
                }
            });
            if (res.status === 200) {
                setuseInfo(res.data.user);
                setIsEditing(false);
            }
        } catch (err) {
            console.error("Error updating profile", err);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
    }

    const handlePasswordCancel = () => {
        setIsPasswordEditing(false)
    }

    const [isEmailsent, setIsEmailSent] = useState(false)
    const sendOTP = async () => {
        debugger
        try {
            const email = userInfo.email
            const response = await axios.post(`${serverUrl}/sendotp`, email, { withCredentials: true })
            if (response.status === 200) {
                setIsEmailSent(true)
                toast.success('The OTP has sent to you email')
            }
        } catch (error) {
            console.log(error)
        }

    }

    const [otp, setOtp] = useState('')

    const validateOTP = async () =>{
        try {
            const email = userInfo.email
            const response = await axios.post(`${serverUrl}/verifyotp`, {email, otp}, { withCredentials: true })
            if (response.status === 200) {
                setIsEmailSent(true)
                toast.success('The OTP has sent to you email')
            }
        } catch (error) {
            console.log(error)
        }
    }

    const navHomePage = ()=>{
        navigate('/login')
    }

    if(userInfo.length===0){
        return(
            <div className='h-full w-full flex flex-col items-center justify-center'>
                <h5>The Session has been expired</h5>
                <p><button className='text-blue-400' onClick={navHomePage}>Click here</button> to home page</p>
            </div>
        )
    }

    return (
        <div className='w-full h-full flex items-center justify-center'>
            <div className='h-[95%] w-[96%] bg-white border rounded'>
                <header className='w-full h-[10%] border-b border-[#d4d4d4] flex items-center'>
                    <div className='flex items-center'>
                        <div className='w-8 h-8 border flex items-center justify-center mx-3 rounded'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                        </div>
                        <h6 className='m-0 poppins-semibold'>Use Details</h6>
                    </div>
                </header>
                <div className='h-[90%] flex '>
                    <div className='w-1/3 h-full border-r border-[#d4d4d4] px-4'>
                        <h6 className='poppins-requler h-10 flex items-center m-2'>Account Management</h6>
                        <div className='w-full h-60 flex justify-center relative mb-3'>
                            <img src="./Profile.png" alt="Profile" className='w-60 h-full rounded border' />
                            <button className='absolute top-2 left-64 z-4'>
                                <div className='h-7 w-7 rounded-[50%] flex items-center justify-center bg-gray-200'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg>
                                </div>
                            </button>
                        </div>
                        <div className='w-full h-20  bg-[#f5f7fa] rounded flex items-center justify-center border'>
                            <Button className='w-[90%] h-[65%] bg-white text-black !font-bold' variant="contained" disableElevation>
                                Upload Photo
                            </Button>
                        </div>
                        <div className='py-2'>
                            <div className='w-full flex justify-end'>
                                <button className={`${isPasswordEditing ? 'hidden' : ''}`} onClick={handlePAsswordEditClick}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>
                                </button>
                                <div className={`${isPasswordEditing ? '' : 'hidden'} items-center flex`}>
                                    <button className='mx-2'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="green" class="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                        </svg>

                                    </button>
                                    <button onClick={handlePasswordCancel} className='mx-2'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>

                                    </button>
                                </div>
                            </div>
                            <div className=''>
                                <label htmlFor="Password" className='poppins-semibold text-sm my-2'>Old Password</label>
                                <input type="password" className={`w-full h-9 border rounded px-3 poppins-medium !text-[0.8vw] ${!isPasswordEditing ? 'bg-zinc-100' : ''}`} placeholder='Password' />
                            </div>
                            <div>
                                <label htmlFor="Password" className='poppins-semibold text-sm my-2'>New Password</label>
                                <input type="password" className={`w-full h-9 border rounded px-3 poppins-medium !text-[0.8vw] ${!isPasswordEditing ? 'bg-zinc-100' : ''}`} placeholder='New password' />
                            </div>
                            <Button className='w-full h-10 my-3 border bg-white text-black !font-bold' variant="contained" disableElevation>
                                Change Password
                            </Button>
                        </div>
                    </div>
                    <div className='w-2/3 h-full px-4'>
                        <div className='w-full flex justify-between'>
                            <h6 className='poppins-requler h-10 flex items-center m-2'>Profile Information</h6>
                            <button className={`${isEditing ? 'hidden' : ''}`} onClick={handleEditClick}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                            </button>
                            <div className={`${isEditing ? '' : 'hidden'} items-center flex`}>
                                <button onClick={handleSave} className='mx-2'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="green" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                    </svg>

                                </button>
                                <button onClick={handleCancel} className='mx-2'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg>

                                </button>
                            </div>

                        </div>
                        <div className='w-full flex flex-wrap mb-15'>

                            {/* UserName */}
                            <div className='w-[50%] px-2'>
                                <label htmlFor="username" className='poppins-semibold text-sm my-2'>UserName</label>
                                <input type="input" value={formData.fullname?.charAt(0).toUpperCase() + userInfo.fullname?.slice(1)}
                                    onChange={handleInputChange}
                                    disabled={!isEditing} id='username' className={`w-full h-9 border rounded px-3 poppins-medium !text-[0.8vw] ${!isEditing ? 'bg-zinc-100' : ''}`} autocomplete="off" />
                            </div>

                            {/* First Name */}
                            <div className='w-[50%] px-2'>
                                <label htmlFor="firstname" className='poppins-semibold text-sm my-2'>First Name</label>
                                <input type="input" value={formData.username}
                                    onChange={handleInputChange}
                                    disabled={!isEditing} id='firstname' className={`w-full h-9 border rounded px-3 poppins-medium !text-[0.8vw] ${!isEditing ? 'bg-zinc-100' : ''}`} autocomplete="off" />
                            </div>

                            {/* Last Name */}
                            <div className='w-[50%] px-2'>
                                <label htmlFor="lastname" className='poppins-semibold text-sm my-2'>Last Name</label>
                                <input type="input" value={formData.username}
                                    onChange={handleInputChange}
                                    disabled={!isEditing} id='lastname' className={`w-full h-9 border rounded px-3 poppins-medium !text-[0.8vw] ${!isEditing ? 'bg-zinc-100' : ''}`} autocomplete="off" />
                            </div>

                            {/* Account Type */}
                            <div className='w-[50%] px-2'>
                                <label htmlFor="accounttype" className='poppins-semibold text-sm my-2'>Account Type</label>
                                <input type="input" id='accounttype' disabled value={userInfo?.isAdmin ? 'Admin' : (userInfo?.isAffiliate ? 'Affiliate' : 'User')} className='w-full h-9 border rounded px-3 poppins-medium !text-[0.8vw] bg-zinc-100' autocomplete="off" />
                            </div>

                        </div>
                        <h6 className='poppins-requler h-10 flex items-center m-2'>Contact Information</h6>
                        <div className='w-full flex flex-wrap mb-15'>

                            {/* Email Field */}
                            <div className='w-[50%] px-2 relative'>
                                <label htmlFor="email" className='poppins-semibold text-sm my-2'>Email</label>
                                <input type="email" id='email'
                                    value={formData.email}
                                    className='w-full h-9 border rounded px-3 poppins-medium !text-[0.8vw] bg-zinc-100' disabled autocomplete="off" />
                                <label htmlFor="otp" className={`poppins-semibold  text-sm ${isEmailsent ? '' : '!hidden'} my-2`}>OTP</label>
                                <input type="input" id='otp' className={`w-full h-9 border ${isEmailsent ? '' : 'hidden'} rounded px-3 poppins-medium !text-[0.8vw]`} autocomplete="off" />
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="green" className="size-4 absolute top-11.5 hidden left-[90%]">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                <p className={`m-0 flex items-center text-red-500 text-[0.9vw] ${isEmailsent ? 'hidden' : ''}`}>The Emali is not verified</p>
                                {
                                    isEmailsent?
                                    <Button color="error" variant="contained" onClick={sendOTP} className='rounded h-6 w-10 my-2'>Verify</Button>:
                                    <Button color="error" variant="contained" onClick={validateOTP} className='rounded h-6 w-10 my-2'>Verify</Button>
                                }
                            </div>

                            {/* Phone Field */}
                            <div className='w-[50%] px-2 relative'>
                                <label htmlFor="Phone" className='poppins-semibold text-sm my-2'>Phone Number</label>
                                <input type="input" value={formData.username}
                                    onChange={handleInputChange}
                                    disabled={!isEditing} id='Phone' className={`w-full h-9 border rounded px-3 poppins-medium !text-[0.8vw] ${!isEditing ? 'bg-zinc-100' : ''}`} autocomplete="off" />
                                <label htmlFor="otp" className='poppins-semibold !hidden text-sm my-2'>OTP</label>
                                {/* <input type="input" id='otp' className='w-full h-9 hidden border rounded px-3 poppins-medium !text-[0.8vw]' autocomplete="off" />
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="green" className="size-4 hidden absolute top-11.5 left-[90%]">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                <p className='m-0 flex items-center text-red-500 text-[0.9vw]'>The Phone number is not verified</p>
                                <Button color="error" variant="contained" className='rounded h-6 w-10'>Verify</Button> */}
                            </div>

                            {/* Secondary Number */}
                            <div className='w-[50%] px-2'>
                                <label htmlFor="lastname" className='poppins-semibold text-sm my-2'>Secondary Number</label>
                                <input type="input" value={formData.username}
                                    onChange={handleInputChange}
                                    disabled={!isEditing} id='lastname' className={`w-full h-9 border rounded px-3 poppins-medium !text-[0.8vw] ${!isEditing ? 'bg-zinc-100' : ''}`} autocomplete="off" />
                            </div>

                            {/* Website */}
                            <div className='w-[50%] px-2'>
                                <label htmlFor="accounttype" className='poppins-semibold text-sm my-2'>Website</label>
                                <input type="input" value={formData.username}
                                    onChange={handleInputChange}
                                    disabled={!isEditing} id='accounttype' className={`w-full h-9 border rounded px-3 poppins-medium !text-[0.8vw] ${!isEditing ? 'bg-zinc-100' : ''}`} autocomplete="off" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}
