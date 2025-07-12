import React from 'react'

export default function Footer() {
    return (
        <div className='h-auto lg:h-[15vw] flex flex-col lg:flex-row bg-mid px-4 lg:px-20 py-8 lg:py-0'>
            <div className='w-full lg:w-2/5 mb-8 lg:mb-0'>
                <h3 className='poppins-semibold py-4 m-0 text-white'>Support</h3>
                <div className='w-40 flex justify-around ml-2'>
                    <a href="">
                        <img src="./linkedin.png" className='w-6 invert' />
                    </a>
                    <a href="">
                        <img src="./instagram.png" className='w-6 invert' />
                    </a>
                    <a href="">
                        <img src="./youtube.png" className='w-6 invert' />
                    </a>
                    <a href="">
                        <img src="./twitter.png" className='w-6 invert' />
                    </a>
                </div>
            </div>
            <div className='w-full lg:w-3/5 flex flex-col lg:flex-row px-0 my-5 lg:px-20'>
                <div className='w-full lg:w-1/3 h-full mb-8 lg:mb-0'>
                    <h5 className='py-4 text-white poppins-bold m-0'>Help</h5>
                    <ul className='p-0'>
                        <li className='text-white poppins-semibold cursor-pointer py-1'>FAQ</li>
                        <li className='text-white poppins-semibold cursor-pointer py-1'>Customer Service</li>
                        <li className='text-white poppins-semibold cursor-pointer py-1'>How to guides</li>
                    </ul>
                </div>
                <div className='w-full lg:w-1/3 h-full mb-8 lg:mb-0'>
                    <h5 className='py-4 text-white poppins-bold m-0'>Other</h5>
                    <ul className='p-0'>
                        <li className='text-white poppins-semibold cursor-pointer py-1'>Privacy Policy</li>
                        <li className='text-white poppins-semibold cursor-pointer py-1'>Sitemap</li>
                        <li className='text-white poppins-semibold cursor-pointer py-1'>Subscription</li>
                    </ul>
                </div>
                <div className='w-full lg:w-1/3 h-full'>
                    <h5 className='py-4 text-white poppins-bold m-0'>Contact us</h5>
                    <ul className='p-0'>
                        <a className='text-white poppins-semibold cursor-pointer py-1'>rentalcars@renzzi.com</a>
                        <li className='text-white poppins-semibold cursor-pointer py-1'>+91-9715087010</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
