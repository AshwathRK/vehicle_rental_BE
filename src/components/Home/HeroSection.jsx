import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function HeroSection() {
    const titleRef = useRef(null);
    const imageRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power4.inOut', duration: 2 } });

        tl.to(titleRef.current, {
            clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)',
            opacity: 1,
            y: 0,
            duration: 2
        })

            .to(imageRef.current, {
                clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)',
                opacity: 1,
                y: 0,
            }, '-=2.2')
    }, []);

    return (
        <div className='hero-container min-h-[calc(100vh-80px)] md:h-[calc(90vh-80px)] bg-lower md:px-16 px-5 flex flex-col md:flex-row'>
            <div ref={titleRef} className='hero-content h-full md:w-1/2 flex flex-col justify-around md:items-start items-center py-12 md:py-40'>
                <div>
                    <h1
                        // ref={titleRef}
                        className='hero-title poppins-bold !text-[clamp(2.25rem,4.5vw,5rem)] mid'
                    >
                        Book. <span className='primary'>Drive.</span> Explore
                    </h1>
                    <h2
                        // ref={subtitleRef}
                        className='hero-subtitle poppins-bold !text-[clamp(1.75rem,3vw,4rem)]'
                    >
                        - Car Rentals Made Simple.
                    </h2>
                </div>
                <h3
                    // ref={descRef}
                    className='hero-description poppins-bold !text-gray-500 !text-[clamp(1.125rem,1.5vw,1.75rem)]'
                >
                    Affordable rentals, wide selection, easy booking.
                </h3>
                <div className='w-full flex justify-center'>
                    <button
                    // ref={bookNowRef}
                    className='hero-button w-40 md:w-60 h-10 md:h-15 text-white poppins-semibold text-[clamp(1rem,3vw,1.5rem)] bg-primery rounded'>
                    Book Now
                </button>
                </div>
            </div>
            <div ref={imageRef} className='hero-image-container h-full md:w-1/2 flex justify-center items-center'>
                <img className='hero-image w-full md:w-176 rounded' src='./Home/Home.png' alt='Car Rental' />
            </div>
        </div>
    );
}
