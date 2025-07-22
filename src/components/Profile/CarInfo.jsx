import React from 'react'
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ListOfCars from './CarPages/ListOfCars';
import AddCars from './CarPages/AddCars';
import { Link, useLocation } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import PrivateRoute from '../../PrivateRoute';

export default function CarInfo() {
    const location = useLocation();
    const isAddOrEditCarPage = location.pathname.startsWith('/profile/carinfo/editcar') || location.pathname === '/profile/carinfo/addcars';
    return (
        <div className='w-full h-full flex items-center justify-center'>
            <div className='h-[95%] w-[96%] bg-white border rounded'>
                <header className='w-full h-[10%] border-b border-[#d4d4d4] flex items-center'>
                    <div className='flex items-center justify-between w-full flex-wrap'>
                        <section className='m-0 flex items-center'>
                            <div className='w-8 h-8 border flex items-center justify-center mx-3 rounded'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                </svg>
                            </div>
                            <h6 className='m-0 poppins-semibold'>Car Information</h6>
                        </section>

                        {
                            !isAddOrEditCarPage && (
                                <Link to='/profile/carinfo/addcars' className='!no-underline m-0'>
                                    <Stack className="md:mx-5 mx-2 flex !px-0" direction="row" spacing={2}>
                                        <Button variant="contained" color="success" className="flex items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                            </svg>
                                            <span className="hidden md:inline">Add Car</span>
                                        </Button>
                                    </Stack>
                                </Link>
                            )
                        }
                    </div>

                </header>
                <div className='h-[90%] flex '>
                    <Routes>
                        <Route element={<PrivateRoute />}>
                            <Route path='/' element={
                                <ListOfCars />
                            } />
                            <Route path='addcars' element={
                                <AddCars />
                            } />
                            <Route path='editcar/:id' element={
                                <AddCars />
                            } />
                        </Route>
                    </Routes>
                </div>
            </div>
        </div>
    )
}
