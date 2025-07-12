import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    const location = useLocation();
   const isLoginPage = location.pathname === '/login' || location.pathname === '/signup';
    const isSearchPage = location.pathname === '/search';

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
                        <button className='w-24 md:w-32 h-10 bg-green-200 rounded text-white bg-mid poppins-semibold mr-2'>
                            Search
                        </button>
                    )}
                    {!isLoginPage && (
                        <Link to='/login' className="!no-underline ml-2">
                            <button className='w-24 md:w-32 h-10 bg-green-200 rounded text-white bg-primery poppins-semibold'>
                                Login/Signup
                            </button>
                        </Link>
                    )}
                </div>

                {/* Mobile buttons */}
                <div className='md:hidden flex items-center gap-3 justify-end'>
                    {!isSearchPage && (
                        <div
                            className='w-10 h-10 bg-gray-200 rounded-lg z-50 cursor-pointer flex items-center justify-center'
                            onClick={() => setSearchOpen(!searchOpen)}
                        >
                            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                            </svg>
                        </div>
                    )}
                    <div
                        className='w-10 h-10 bg-gray-200 rounded-lg z-50 cursor-pointer flex items-center justify-center'
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                            {mobileMenuOpen ? (
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                            ) : (
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
                            )}
                        </svg>
                    </div>
                    {!isLoginPage && (
                        <Link to='/login' className="!no-underline">
                            <button className='w-24 h-10 bg-green-200 rounded text-white bg-primery poppins-semibold'>
                                Login/Signup
                            </button>
                        </Link>
                    )}
                </div>
            </div>

            {searchOpen && (
                <div className='md:hidden flex items-center z-50 absolute top-20 left-0 w-full bg-white p-4'>
                    <button className='w-24 h-10 mx-3 bg-green-200 rounded text-white bg-mid poppins-semibold'>
                        Search
                    </button>
                </div>
            )}
        </div>
    );
}
