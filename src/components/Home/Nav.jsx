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

    const location = useLocation();
    const isLoginPage = location.pathname === '/login' || location.pathname === '/signup';
    const isSearchPage = location.pathname === '/search';
    const isProfilePage = location.pathname === '/profile';

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.get(`${serverUrl}`, {
                    withCredentials: true
                });
                if (res.status === 200) {
                    setIsLogin(true);
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
        <div className='Navbar px-4 md:px-16 h-20 border-b-2 border-white flex items-center justify-between md:justify-around shadow-sm relative'>
            <Link to='/' className='!no-underline'>
                <img src='/Home/Logo.png' className='w-10 mx-2 md:mx-5 navLogo cursor-pointer' alt="car logo" />
            </Link>

            <ul className={` ${mobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row w-full md:w-50 justify-around items-center h-[130px] md:h-full absolute md:relative bg-white md:bg-transparent top-20 left-0 my-0 md:top-auto md:left-auto z-40 pt-10 md:pt-0 overflow-x-hidden overflow-y-auto`}>
                <Link to='/' className="!no-underline">
                    <li className='text-black poppins-bold cursor-pointer mx-1 py-2 md:py-0'>HOME</li>
                </Link>
                <Link to='/lineup' className="!no-underline">
                    <li className='text-black poppins-bold cursor-pointer mx-1 py-2 md:py-0'>VEHICLES</li>
                </Link>
            </ul>

            <div className='flex items-center justify-end z-50'>
                {/* Desktop buttons */}
                <div className='hidden md:flex items-center'>
                    {!isSearchPage && (
                        <Link to='/search' className="!no-underline ml-2">
                            <button className='w-24 md:w-32 h-10 bg-green-200 rounded text-white bg-mid poppins-semibold mr-2'>
                                Search
                            </button>
                        </Link>
                    )}
                    {!showLoginPage && (
                        <Link to='/login' className="!no-underline ml-2">
                            <button className='w-24 md:w-32 h-10 bg-green-200 rounded text-white bg-primery poppins-semibold'>
                                Login/Signup
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
                            <img src="./boy.png" className='w-10' alt="Profile" />
                            <Link to='/profile' className="!no-underline ml-2">
                                <button className='w-3 h-3 m-0'>
                                    <img src="./arrow-down.png" className='w-5' alt="Arrow Down" />
                                </button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile buttons */}
                <div className='md:hidden flex items-center gap-3 justify-end'>
                    {/* Search Toggle Button */}
                    {!isSearchPage && (
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
                            <button className='w-30 h-10 bg-green-200 rounded text-white bg-primery poppins-semibold'>
                                Login/Signup
                            </button>
                        </Link>
                    )}

                    {/* Profile Button (avatar + dropdown) */}
                    {isLogin && !isProfilePage && (
                        <div className='w-24 md:w-32 h-12 flex justify-center items-center gap-2'>
                            <img src='./boy.png' className='w-10' alt='Profile' />
                            <Link to='/profile' className='!no-underline ml-2'>
                                <button className='w-3 h-3 m-0'>
                                    <img src='./arrow-down.png' className='w-5' alt='Arrow Down' />
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {searchOpen && (
                <div className='md:hidden flex items-center z-50 absolute top-20 left-0 w-full bg-white p-4'>
                    <Link to='/search' className="!no-underline ml-2">
                        <button className='w-24 h-10 mx-3 bg-green-200 rounded text-white bg-mid poppins-semibold'>
                            Search
                        </button>
                    </Link>
                </div>
            )}
        </div>
    );
}
