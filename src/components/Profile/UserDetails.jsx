import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { ClimbingBoxLoader } from 'react-spinners';

// === Load server URL from environment ===
const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function UserDetails() {

    const [userInfo, setuseInfo] = useState([]);
    const [formData, setFormData] = useState({
        fullname: userInfo.fullname,
        firstName: '',
        lastName: '',
        dateofbirth: '',
        gender: '',
        email: '',
        phone: '',
        secondary: '',
        website: ''
    });

    const [isEditing, setIsEditing] = useState(false);
    const [isPasswordEditing, setIsPasswordEditing] = useState(false);
    const navigate = useNavigate()
    const [isEmailsent, setIsEmailSent] = useState(false)
    const [otp, setOtp] = useState('')
    const [isEmailVerified, setIsEmailVerified] = useState(false)
    const [loadder, setLoadder] = useState(false)

    const [modalOpen, setModalOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    // const [selectedImage, setSelectedImage] = useState(null);
    const [fileToUpload, setFileToUpload] = useState(null);

    // Get tokens form the local storage
    const accessToken = sessionStorage.getItem('accessToken');
    const deviceId = sessionStorage.getItem('deviceId');
    const date = new Date(userInfo.dateofbirth);
    const formattedDate = !isNaN(date.getTime()) ? date.toISOString().split('T')[0] : '';


    // ============================== Get user Info from the DB =============================== //

    useEffect(() => {
        const checkAuth = async () => {
            try {
                setLoadder(true)
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
                setLoadder(false)
            } catch (err) {
                console.log(err?.response?.data?.message || "Not logged in");
            }
        };
        checkAuth();
    }, [isEmailVerified, modalOpen]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    // ========================= Update Profile ============================ //

    const handleSave = async () => {
        try {
            const res = await axios.put(`${serverUrl}/user/${userInfo._id}`, formData, {
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
        if (!userInfo) return;

        setIsEditing(false);
        setFormData({
            fullname: userInfo.fullname || '',
            firstName: userInfo.firstName || '',
            lastName: userInfo.lastName || '',
            dateofbirth: userInfo.dateofbirth || '',
            gender: userInfo.gender || '',
            email: userInfo.email || '',
            phone: userInfo.phone || '',
            secondary: userInfo.secondary || '',
            website: userInfo.website || ''
        });
    };

    //========================== Email OTP verifiacation =============================== //

    const sendOTP = async () => {
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

    const handleOTPValue = (e) => {
        setOtp(e.target.value)
    }

    const validateOTP = async () => {
        try {
            const email = userInfo.email
            const response = await axios.post(`${serverUrl}/verifyotp`, { email, otp }, { withCredentials: true })
            if (response.status === 200) {
                setIsEmailSent(false)
                setIsEmailVerified(true)
                toast.success('Email has been verified')
            }
        } catch (error) {
            setIsEmailSent(false)
            toast.error('Something went wrong! try again')
        }
    }

    //======================= Handle Password Update ==============================//

    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: ''
    });

    const handlePasswordEditClick = () => {
        setIsPasswordEditing(true);
    };

    const handlePasswordCancel = () => {
        setIsPasswordEditing(false);
        setPasswordData({ oldPassword: '', newPassword: '' }); // Reset on cancel
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handelPasswordUpdate = async () => {
        try {
            if (
                passwordData.oldPassword.length < 12 ||
                passwordData.oldPassword.length > 14 ||
                !/[A-Z]/.test(passwordData.oldPassword) ||
                !/[^a-zA-Z0-9]/.test(passwordData.oldPassword)
            ) {
                toast.error('Password must be 12-14 characters long, include one uppercase letter and one special character.')
                setIsPasswordEditing(false);
                return
            }

            const email = userInfo.email;
            const res = await axios.put(`${serverUrl}/updatepassword/${userInfo._id}`, { email, passwordData }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Device-Id': deviceId
                }
            });
            if (res.status === 200) {
                setIsPasswordEditing(false);
                toast.success('Your Password has been updated')
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data.message)
        }
    }


    // ====================== Handle the profile image Upload ===========================//

    const handleBrowseImage = (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setPreviewImage(URL.createObjectURL(file));
            console.log(previewImage)
            setFileToUpload(file);
        }
    };
    

    const handleUpload = async () => {
        try {
            const formImage = new FormData();
            formImage.append('profile', fileToUpload); // append the actual file
            const res = await axios.put(`${serverUrl}/updateprofile/${userInfo._id}`, formImage, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Device-Id': deviceId,
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Assuming the response has the updated user data or at least the profile URL
            setuseInfo({ ...userInfo, profile: res.data.data.profile }); // update userInfo.profile
            setModalOpen(false);
            setPreviewImage(null);
            setFileToUpload(null);
            location.reload();
        } catch (error) {
            console.log(error);
        }
    };

    // console.log(userInfo)

    const handleCloseModal = () => {
        setModalOpen(false);
        setPreviewImage(null);
    };

    // ============================= Handle Sesstion event ============================= //

    const navHomePage = () => {
        navigate('/login')
    }

    if (!userInfo || Object.keys(userInfo).length === 0) {
        setTimeout(() => {
            return (
                <div className='h-full w-full flex flex-col items-center justify-center'>
                    <h5>The Session has been expired</h5>
                    <p><button className='text-blue-400' onClick={navHomePage}>Click here</button> to home page</p>
                </div>
            )
        }, 2000);
    }

    if (loadder) {
        return (
            <div className='w-full h-full flex items-center justify-center'>
                <ClimbingBoxLoader />
            </div>
        )
    }



    return (
        <>
            <div className='w-full h-full flex items-center justify-center'>
                <div className='h-[95%] w-[96%] bg-white border rounded overflow-y-auto hide-scrollbar'>
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
                    <div className='h-[90%] flex flex-col md:flex-row'>
                        <div className='md:w-1/3 w-full h-full border-r md:border-r border-[#d4d4d4] px-4'>
                            <h6 className='poppins-requler h-10 flex items-center m-2'>Account Management</h6>
                            <div className='w-full h-60 flex justify-center relative mb-3'>
                                {userInfo?.profile && userInfo?.profile.length > 0 ? (
                                    <div>
                                        <img
                                            src={userInfo?.profile}
                                            alt="Profile"
                                            className="w-60 h-full rounded border object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="h-full relative">
                                        <img src="./boy.png" alt="Profile" className="w-60 rounded border object-cover" />
                                    </div>
                                )}

                            </div>
                            <div className='w-full h-20 bg-[#f5f7fa] rounded flex items-center justify-center border'>
                                <Button onClick={() => setModalOpen(true)} className='w-[90%] h-[65%] bg-white text-black !font-bold' variant="contained" disableElevation>
                                    Upload Photo
                                </Button>
                            </div>

                            {/* Password Section */}
                            <div className='py-2'>
                                <div className='w-full flex justify-end'>
                                    <button className={`${isPasswordEditing ? 'hidden' : ''}`} onClick={handlePasswordEditClick}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                        </svg>
                                    </button>
                                    <div className={`${isPasswordEditing ? 'flex' : 'hidden'} items-center`}>
                                        <button onClick={handlePasswordCancel} className='mx-2'>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="oldPassword" className='poppins-semibold text-sm my-2'>Old Password</label>
                                    <input type="password" name="oldPassword" value={passwordData.oldPassword} onChange={handlePasswordChange} disabled={!isPasswordEditing} className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] ${!isPasswordEditing ? 'bg-zinc-100' : ''}`} placeholder='Password' />
                                </div>

                                <div>
                                    <label htmlFor="newPassword" className='poppins-semibold text-sm my-2'>New Password</label>
                                    <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} disabled={!isPasswordEditing} className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] ${!isPasswordEditing ? 'bg-zinc-100' : ''}`} placeholder='New password' />
                                </div>

                                <Button className={`w-full h-10 my-3 border bg-white text-black !font-bold ${!isPasswordEditing ? 'bg-zinc-100' : ''}`} onClick={handelPasswordUpdate} disabled={!isPasswordEditing} variant="contained" disableElevation>
                                    Change Password
                                </Button>
                            </div>
                        </div>

                        {/* Profile Information Area */}
                        <div className='md:w-2/3 md:m-0 mt-[60px] w-full h-full px-4'>
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
                            <div className='w-full flex flex-wrap mb-15 py-10 md:py-0'>

                                {/* FullName */}
                                <div className='w-[50%] px-2'>
                                    <label htmlFor="fullname" className='poppins-semibold text-sm my-2'>Full Name</label>
                                    <input type="input" onChange={handleInputChange} value={userInfo.fullname?.charAt(0).toUpperCase() + userInfo.fullname?.slice(1)}
                                        disabled={!isEditing} id='fullname' className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] ${!isEditing ? 'bg-zinc-100' : ''}`} autocomplete="off" />
                                </div>

                                {/* First Name */}
                                <div className='w-[50%] px-2'>
                                    <label htmlFor="firstName" className='poppins-semibold text-sm my-2'>First Name</label>
                                    <input type="input" value={userInfo.firstName}
                                        onChange={handleInputChange}
                                        disabled={!isEditing} id='firstName' className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] ${!isEditing ? 'bg-zinc-100' : ''}`} autocomplete="off" />
                                </div>

                                {/* Last Name */}
                                <div className='w-[50%] px-2'>
                                    <label htmlFor="lastName" className='poppins-semibold text-sm my-2'>Last Name</label>
                                    <input type="input" value={userInfo.lastName}
                                        onChange={handleInputChange}
                                        disabled={!isEditing} id='lastName' className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] ${!isEditing ? 'bg-zinc-100' : ''}`} autocomplete="off" />
                                </div>

                                {/*Date Of birth*/}
                                <div className='w-[50%] px-2'>
                                    <label htmlFor="dateofbirth" className='poppins-semibold text-sm my-2'>Date of birth</label>
                                    <input type="date" value={formData.dateofbirth ? formData.dateofbirth : formattedDate}
                                        onChange={handleInputChange}
                                        disabled={!isEditing} id='dateofbirth' className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] ${!isEditing ? 'bg-zinc-100' : ''}`} autoComplete="off" />
                                </div>

                                {/* Gender */}
                                <div className='w-[50%] px-2'>
                                    <label htmlFor="gender" className='poppins-semibold text-sm my-2'>Gender</label>
                                    <select
                                        value={userInfo.gender}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        id='gender'
                                        className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] ${!isEditing ? 'bg-zinc-100' : ''}`}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                {/* Account Type */}
                                <div className='w-[50%] px-2'>
                                    <label htmlFor="accounttype" className='poppins-semibold text-sm my-2'>Account Type</label>
                                    <input type="input" id='accounttype' disabled value={userInfo.profileType} className='w-full h-9 border rounded px-3 poppins-medium !text-[13px] bg-zinc-100' autocomplete="off" />
                                </div>

                            </div>
                            <h6 className='poppins-requler h-10 flex items-center m-2'>Contact Information</h6>
                            <div className='w-full flex flex-wrap mb-15'>

                                {/* Email Field */}
                                <div className='w-[50%] px-2 relative'>
                                    <label htmlFor="email" className='poppins-semibold text-sm my-2'>Email</label>
                                    <input type="email" id='email'
                                        value={userInfo.email}
                                        className='w-full h-9 border rounded px-3 poppins-medium !text-[13px] bg-zinc-100' disabled autocomplete="off" />
                                    <label htmlFor="otp" className={`poppins-semibold  text-sm ${isEmailsent ? '' : '!hidden'} my-2`}>OTP</label>
                                    <input type="input" id='otp' onChange={handleOTPValue} className={`w-full h-9 border ${isEmailsent ? '' : 'hidden'} rounded px-3 poppins-medium !text-[0.8vw]`} autocomplete="off" />
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="green" className={`size-4 absolute top-11.5 ${userInfo.isEmailVerified ? '' : `hidden`}  left-[90%]`}>
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                    <p className={`m-0 flex items-center text-red-500 !text-[13px] ${userInfo.isEmailVerified ? 'hidden' : ''} ${isEmailsent ? 'hidden' : ''}`}>The Emali is not verified</p>
                                    {
                                        isEmailsent ?
                                            <div>
                                                <Button color="error" variant="contained" onClick={validateOTP} className='rounded h-6 w-10 my-2'>Verify</Button>
                                                <Button color="success" variant="Text" onClick={sendOTP} className='rounded h-6 w-10 my-2 mx-2'>Resend</Button>
                                            </div> :
                                            <Button color="error" variant="contained" onClick={sendOTP} className={`rounded h-6 w-10 my-2 ${userInfo.isEmailVerified ? '!hidden' : ''}`}>Verify</Button>
                                    }
                                </div>

                                {/* Phone Field */}
                                <div className='w-[50%] px-2 relative'>
                                    <label htmlFor="phone" className='poppins-semibold text-sm my-2'>Phone Number</label>
                                    <input type="number" value={userInfo.phone}
                                        onChange={handleInputChange}
                                        disabled={!isEditing} id='phone' className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] ${!isEditing ? 'bg-zinc-100' : ''}`} autocomplete="off" />
                                    <label htmlFor="otp" className='poppins-semibold !hidden text-sm my-2'>OTP</label>
                                </div>

                                {/* Secondary Number */}
                                <div className='w-[50%] px-2'>
                                    <label htmlFor="secondary" className='poppins-semibold text-sm my-2'>Secondary Number</label>
                                    <input type="number" value={userInfo.secondary}
                                        onChange={handleInputChange}
                                        disabled={!isEditing} id='secondary' className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] ${!isEditing ? 'bg-zinc-100' : ''}`} autocomplete="off" />
                                </div>

                                {/* Website */}
                                <div className='w-[50%] px-2'>
                                    <label htmlFor="website" className='poppins-semibold text-sm my-2'>Website</label>
                                    <input type="input" value={userInfo.website}
                                        onChange={handleInputChange}
                                        disabled={!isEditing} id='website' className={`w-full h-9 border rounded px-3 poppins-medium !text-[13px] ${!isEditing ? 'bg-zinc-100' : ''}`} autocomplete="off" />
                                </div>
                            </div>
                            {/* Other profile and contact information UI... */}
                            {/* No changes needed here for responsiveness */}
                        </div>
                    </div>
                </div>
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
                            <h3 className="text-xl font-semibold mb-4 text-center">Select Image</h3>

                            <input type="file" accept="image/*" onChange={handleBrowseImage} className="mb-4 w-full text-blue-400" />

                            {previewImage && (
                                <div className="mb-4 flex justify-center">
                                    <img
                                        src={previewImage}
                                        alt="Preview"
                                        className="max-w-full max-h-48 rounded border"
                                    />
                                </div>
                            )}

                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={handleUpload}
                                    disabled={!previewImage}
                                    className={`px-4 py-2 rounded text-white mx-2 ${previewImage ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                                >
                                    Upload
                                </button>
                                <button
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <ToastContainer />
            </div>
            <style>
                {`
    @media (max-width: 768px) {
      .text-[0.8vw] {
        font-size: 3.5vw !important;
      }
    }
  `}
            </style>
        </>


    )
}

// const styles = {
//     modalOverlay: {
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         width: '100vw',
//         height: '100vh',
//         backgroundColor: 'rgba(0,0,0,0.4)',
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         zIndex: 999,
//     },
//     modalContent: {
//         backgroundColor: '#fff',
//         padding: '2rem',
//         borderRadius: '8px',
//         width: '90%',
//         maxWidth: '400px',
//         textAlign: 'center',
//     },
//     button: {
//         padding: '10px 15px',
//         border: 'none',
//         borderRadius: '5px',
//         backgroundColor: '#1976d2',
//         color: '#fff',
//         cursor: 'pointer',
//     },
// };
