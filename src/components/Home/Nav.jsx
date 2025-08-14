import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Tooltip } from 'bootstrap';

const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [showLoginPage, setShowLoginPage] = useState(false);
    const [userInfo, setuseInfo] = useState([]);

    const location = useLocation();
    const isLoginPage = location.pathname === '/login' || location.pathname === '/signup';
    const isSearchPage = location.pathname === '/search';
    const isProfilePage = location.pathname.startsWith('/profile');
    const isVehicles = location.pathname === '/lineup' || location.pathname.startsWith('/car');

    // Get tokens form the local storage
    const accessToken = sessionStorage.getItem('accessToken');
    const deviceId = sessionStorage.getItem('deviceId');

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.get(`${serverUrl}`, {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Device-Id': deviceId
                    }
                });
                if (res.status === 200) {
                    setIsLogin(true);
                    setuseInfo(res.data.user);
                }
            } catch (err) {
                setIsLogin(false);
                console.log(err?.response?.data?.message || "Not logged in");
            }
        };
        checkAuth();
    }, [location]);

    useEffect(() => {
        if (isLoginPage || isLogin) {
            setShowLoginPage(true);
        } else {
            setShowLoginPage(false);
        }
    }, [isLoginPage, isLogin]);

    // ✅ Tooltip initialization and cleanup
    useEffect(() => {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        const tooltipInstances = [];

        tooltipTriggerList.forEach((tooltipTriggerEl) => {
            const instance = new Tooltip(tooltipTriggerEl);
            tooltipInstances.push(instance);
        });

        return () => {
            tooltipInstances.forEach((instance) => instance.dispose());
        };
    }, [isLogin, location.pathname]);



    return (
        <div className='Navbar px-4 w-full md:px-16 h-20 border-b-2 border-white flex items-center fixed top-0 justify-between md:justify-around shadow-sm bg-mid z-300'>
            <Link to='/' className='!no-underline'>
                <img src='/Home/2-removebg-preview.png' className='w-45 mx-2 md:mx-5 cursor-pointer' alt="car logo" />
            </Link>

            <ul className={` ${mobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row w-full md:w-50 justify-around items-center h-[130px] md:h-full absolute md:relative bg-mid md:bg-transparent top-20 left-0 my-0 md:top-auto md:left-auto z-40 pt-10 md:pt-0 overflow-x-hidden overflow-y-auto`}>
                <Link to='/' className="!no-underline">
                    <li className='text-black poppins-bold cursor-pointer text-white mx-1 py-2 md:py-0'>HOME</li>
                </Link>
                <Link to='/lineup' className="!no-underline">
                    <li className='text-black poppins-bold cursor-pointer text-white mx-1 py-2 md:py-0'>VEHICLES</li>
                </Link>
            </ul>

            <div className='flex items-center justify-end z-50'>
                {/* Desktop buttons */}
                <div className='hidden md:flex items-center'>
                    {!isSearchPage && !isVehicles && (

                        <Link to='/search' className="!no-underline ml-2">
                            <button className='w-24 md:w-32 h-10 bg-green-200 rounded text-white bg-mid poppins-semibold mr-2 flex items-center justify-center'>
                                <img src="/Search.png" className='w-4 h-4 mx-2 invert' />
                                Search
                            </button>
                        </Link>
                    )}
                    {!showLoginPage && (
                        <Link to='/login' className="!no-underline ml-2">
                            <button className='w-24 md:w-32 h-10 bg-green-200 rounded text-white bg-primery poppins-semibold flex justify-center items-center'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-user mx-1"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                Sign-in
                            </button>
                        </Link>
                    )}
                    {isLogin && !isProfilePage && (
                        <div
                            className='w-24 md:w-32 h-12 flex justify-center items-center gap-2'
                            data-bs-toggle="tooltip"
                            data-bs-placement="left"
                            data-bs-custom-class="custom-tooltip"
                            data-bs-title="Profile"
                        >
                            {userInfo.profile && userInfo.profile.length > 0 ? (
                                <div>
                                    <img
                                        src={userInfo?.profile}
                                        alt="Profile"
                                        className="w-10 h-10 rounded-[50%] border object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="h-full relative flex items-center justify-center">
                                    <img src="./boy.png" alt="Profile" className="w-10 rounded object-cover" />
                                </div>
                            )}

                            <Link to='/profile' className="!no-underline ml-2">
                                <button className='w-3 h-3 m-0'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="size-4">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5" />
                                    </svg>
                                </button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile buttons */}
                <div className='md:hidden flex items-center gap-3 justify-end'>
                    {/* Search Toggle Button */}
                    {!isSearchPage && !isVehicles && (
                        <div
                            className='w-10 h-10 bg-gray-200 rounded-lg z-50 cursor-pointer flex items-center justify-center'
                            onClick={() => {
                                setSearchOpen(!searchOpen);
                                setMobileMenuOpen(false);
                            }}
                        >
                            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                {searchOpen ? (
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                                ) : (
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                                )}
                            </svg>
                        </div>
                    )}

                    {/* Mobile Menu Toggle Button */}
                    <div
                        className='w-10 h-10 bg-gray-200 rounded-lg z-50 cursor-pointer flex items-center justify-center'
                        onClick={() => {
                            setMobileMenuOpen(!mobileMenuOpen);
                            setSearchOpen(false);
                        }}
                    >
                        <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            {mobileMenuOpen ? (
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                            ) : (
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
                            )}
                        </svg>
                    </div>

                    {/* Login/Signup Button */}
                    {!showLoginPage && (
                        <Link to='/login' className='!no-underline'>
                            <button className='w-24 md:w-32 h-10 bg-green-200 rounded text-white bg-primery poppins-semibold flex justify-center items-center'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-user mx-1"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                Sign-in
                            </button>
                        </Link>
                    )}

                    {/* Profile Button (avatar + dropdown) */}
                    {isLogin && !isProfilePage && (
                        <div className='w-24 md:w-32 h-12 flex justify-center items-center gap-2'>
                            <img src='./boy.png' className='w-10' alt='Profile' />
                            <Link to='/profile' className='!no-underline ml-2'>
                                <button className='w-3 h-3 m-0'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5" />
                                    </svg>

                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {searchOpen && (
                <div className='md:hidden flex items-center z-50 absolute top-20 left-0 w-full bg-white p-4'>
                    <Link to='/search' className="!no-underline ml-2">
                        <button className='w-28 h-10 mx-3 bg-green-200 rounded text-white bg-mid poppins-semibold flex items-center justify-center'>
                            <img src="/Search.png" className='w-4 h-4 mx-2 invert' />
                            Search
                        </button>
                    </Link>
                </div>
            )}
        </div>
    );
}
