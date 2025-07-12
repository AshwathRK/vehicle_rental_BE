import React from 'react'

export default function Review() {
    return (
        <div className='bg-lower'>
            <div className='h-1/6 lg:h-2/6 w-full py-14 flex justify-center items-center'>
                <h2 className='poppins-bold text-lg lg:text-2xl'>Customer Review</h2>
            </div>
            <div className='flex flex-wrap justify-center gap-3 px-4 py-5 lg:h-4/6'>
                <div className='w-full lg:w-96 lg:h-86 bg-mid rounded-xl mb-4 lg:mb-0'>
                    <img src="./Experions.jpg" alt="Experions" className='rounded-t-xl w-full h-40 lg:h-6/10 object-cover' />
                    <div className='p-3'>
                        <h5 className='poppins-semibold text-white text-base lg:text-lg'>Best Car Rental Experions!</h5>
                        <p className='poppins-regular text-white text-sm my-0 lg:text-base'>Here what we satisfied customer say about us.</p>
                        <div className='w-full flex px-3 items-center'>
                            <img src="./1.jpg" className='w-8 h-8 lg:w-10 lg:h-9 rounded-[50%]' />
                            <p className='mx-3 my-0 flex items-center poppins-semibold text-white text-sm lg:text-base'>Jenifer besk</p>
                        </div>
                    </div>
                </div>
                <div className='w-full lg:w-96 lg:h-86 bg-mid rounded-xl mb-4 lg:mb-0'>
                    <img src="./Service.jpg" alt="Experions" className='rounded-t-xl w-full h-40 lg:h-6/10 object-cover' />
                    <div className='p-3'>
                        <h5 className='poppins-semibold text-white text-base lg:text-lg'>Unmatched Service!</h5>
                        <p className='poppins-regular text-white text-sm lg:text-base'>Our clients love the ease of booking.</p>
                        <div className='w-full flex px-3 items-center'>
                            <img src="./2.jpg" className='w-8 h-8 lg:w-10 lg:h-9 rounded-[50%]' />
                            <p className='mx-3 my-0 flex items-center poppins-semibold text-white text-sm lg:text-base'>Emma Willson</p>
                        </div>
                    </div>
                </div>
                <div className='w-full lg:w-96 lg:h-86 bg-mid rounded-xl mb-4 lg:mb-0'>
                    <img src="./Affordable.jpg" alt="Experions" className='rounded-t-xl w-full h-40 lg:h-6/10 object-cover' />
                    <div className='p-3'>
                        <h5 className='poppins-semibold text-white text-base lg:text-lg'>Reliable and Affordable</h5>
                        <p className='poppins-regular text-white text-sm lg:text-base'>Renting with us is a breeze.</p>
                        <div className='w-full flex px-3 items-center'>
                            <img src="./3.jpg" className='w-8 h-8 lg:w-10 lg:h-9 rounded-[50%]' />
                            <p className='mx-3 my-0 flex items-center poppins-semibold text-white text-sm lg:text-base'>Jhon Mike</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
