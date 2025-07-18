import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import UserDetails from './Profile/UserDetails'
import Affiliate from './Profile/Affiliate'
import Settings from './Profile/Settings'
import { Link } from 'react-router-dom';
import PrivateRoute from '../PrivateRoute';
import axios from 'axios';
import { ClimbingBoxLoader } from 'react-spinners';


// === Load server URL from environment ===
const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function Profile() {
    const [hiddenMenu, setHiddenMenu] = useState(false);
    const [active, setActive] = useState('');

    const handleChange = () => {
        setHiddenMenu(prev => !prev);
    };

    const [userInfo, setuseInfo] = useState([]);

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
                    setTimeout(() => {
                        setuseInfo(res.data.user);
                    }, 500);
                }
            } catch (err) {
                console.log(err?.response?.data?.message || "Not logged in");
            }
        };
        checkAuth();
    }, []);

    const handleLogout = () => {
        sessionStorage.clear();
        location.reload();
    }

    const activeNav = (menu) => {
        setActive(menu);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 767) {
                setHiddenMenu(true);
            } else {
                setHiddenMenu(false);
            }
        };

        // Set initial value
        handleResize();

        // Add event listener for window resize
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, [window.innerWidth]);

    if (userInfo.length === 0) {
        return (
            <div className='h-[calc(99.8vh-78.4px)] bg-[#f5f7fa] flex relative top-[78px] items-center justify-center'>
                <ClimbingBoxLoader />
            </div>
        )
    }

    return (
        <div className="h-[calc(99.8vh-78.4px)] bg-[#f5f7fa] flex relative top-[78px]">
            {/* Sidebar */}
            <nav
                className={`h-full absolute w-[50%] ${hiddenMenu ? 'md:w-0 hidden' : 'md:w-[20%] w-[50%] bg-mid md:!bg-[#f5f7fa]'} md:relative z-10 transition-all border-r border-[#d4d4d4] duration-300 ease-in-out`}
            >
                {!hiddenMenu && (
                    <>

                        <div className='w-full h-30 flex flex-col items-center justify-center'>
                            <div className='h-[50%] flex items-center justify-end w-full px-3'>
                                <button onClick={handleChange}>
                                    {/* Sidebar Toggle Icon */}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="black"
                                        className="size-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <div className='rounded w-[90%] h-[50%] bg-white border-[1px] border-[#d4d4d4] flex'>
                                <div className='w-2/10 flex items-center justify-center'>
                                    <img src={userInfo.profile} className='w-10 h-10 rounded' />
                                </div>
                                <div className='w-6/10 px-2 py-2'>
                                    <h6 className='m-0'>{userInfo.fullname?.charAt(0).toUpperCase() + userInfo.fullname?.slice(1)}</h6>
                                    <p className='m-0 poppoins-semibold text-[#828181] !text-[0.8vw]'>{userInfo.isAdmin ? 'Admin' : (userInfo.isAffiliate ? 'Affiliate' : 'User')}</p>
                                </div>
                                <div className='w-2/10 px-2 py-2 flex items-center justify-center'>
                                    <button onClick={handleLogout}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                        </div>
                        <div className='h-[calc(100%-120px)] py-10'>
                            <ul className='h-full w-full py-2'>
                                <Link to='/profile' className="!no-underline text-black text-sm">
                                    <li
                                        className={`h-10 flex items-center poppins-semibold !cursor-pointer 
                                        hover:border-l-[2px] hover:bg-zinc-200 border-black 
                                        ${active === 'user' ? 'border-black bg-zinc-200 border-l-[2px]' : ''}`}
                                        onClick={() => activeNav('user')}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mx-3 size-3">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                        </svg>
                                        User Details
                                    </li>
                                </Link>

                                <Link to='/profile/affiliate' className="!no-underline text-black text-sm">
                                    <li
                                        className={`h-10 flex items-center poppins-semibold !cursor-pointer 
                                        hover:border-l-[2px] hover:bg-zinc-200 border-black 
                                        ${active === 'affiliate' ? 'border-black bg-zinc-200 border-l-[2px]' : ''}`}
                                        onClick={() => activeNav('affiliate')}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="mx-3 size-3">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
                                        </svg>
                                        Affiliate
                                    </li>
                                </Link>

                                <Link to='/profile/setting' className="!no-underline text-black text-sm">
                                    <li
                                        className={`h-10 flex items-center poppins-semibold !cursor-pointer 
                                        hover:border-l-[2px] hover:bg-zinc-200 border-black 
                                        ${active === 'setting' ? 'border-black bg-zinc-200 border-l-[2px]' : ''}`}
                                        onClick={() => activeNav('setting')}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mx-3 size-3">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        </svg>
                                        Settings
                                    </li>
                                </Link>
                            </ul>

                        </div>
                    </>
                )}
            </nav>

            {/* Main content */}
            <div
                className={`h-full transition-all duration-300 ${hiddenMenu ? 'w-[100%]' : 'md:w-[80%] w-[100%]'} ease-in-out flex`}
            // style={{ width: hiddenMenu ? '100%' : '80%' }}
            >
                {hiddenMenu && (
                    <div className='w-10 h-full bg-mid text-white'>
                        <button className="absolute top-5 left-2" onClick={handleChange}>
                            {/* Reopen Sidebar Icon */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="size-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                                />
                            </svg>
                        </button>
                    </div>
                )}
                <Routes>
                    <Route element={<PrivateRoute />}>
                        <Route path='/' element={
                            <UserDetails />
                        } />
                        <Route path='affiliate' element={
                            <Affiliate />
                        } />
                        <Route path='setting' element={
                            <Settings />
                        } />
                    </Route>
                </Routes>
            </div>
        </div >
    );
}
