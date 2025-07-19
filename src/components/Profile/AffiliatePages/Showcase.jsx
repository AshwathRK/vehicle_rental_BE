import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ClimbingBoxLoader } from 'react-spinners';
import { toast, ToastContainer } from 'react-toastify';


// === Load server URL from environment ===
const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function Showcase() {

    const [userInfo, setuseInfo] = useState([]);
    const [loadder, setLoadder] = useState(false)
    const navigator = useNavigate()

    // Get tokens form the local storage
    const accessToken = sessionStorage.getItem('accessToken');
    const deviceId = sessionStorage.getItem('deviceId');

    useEffect(() => {
        const checkAuth = async () => {
            setLoadder(true)
            try {
                const res = await axios.get(`${serverUrl}`, {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Device-Id': deviceId
                    }
                });

                setuseInfo(res.data.user);
                setLoadder(false)
            } catch (err) {
                console.log(err?.response?.data?.message || "Not logged in");
                setLoadder(false)
            }
        };
        checkAuth();
    }, []);

    if (loadder) {
        return (
            <div className='w-full h-full flex items-center justify-center'>
                <ClimbingBoxLoader />
            </div>
        )
    }

    const CustomButton = styled(Button)({
        width: '200px',
        height: '50px',
        borderRadius: '5px',
        backgroundColor: '#6A1B9A',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#4A148C',
        },
    });

    const affiliateNav = () => {
        if (userInfo.isEmailVerified) {
            navigator(`/profile/affiliate/affiliateregister/${userInfo._id}`)
        } else {
            toast.error('Please verify your email address')
            setTimeout(() => {
                navigator('/profile')
            }, 3000);
        }
    }

    return (
        <div className="w-full h-full bg-lower flex items-center justify-center flex-col px-4 py-8 text-center">
            <h4 className="poppins-bold text-xl mid md:text-2xl lg:text-3xl mb-4">
                Turn your vehicle into income — host with us today!
            </h4>
            <CustomButton
                variant="contained"
                className="text-sm md:text-base px-6 py-2"
                onClick={affiliateNav}
            >
                Become an Affiliate
            </CustomButton>
            <ToastContainer/>
        </div>

    )
}
