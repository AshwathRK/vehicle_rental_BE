import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';


const serverUrl = import.meta.env.VITE_SERVER_URL;
const secretKey = import.meta.env.VITE_SECRET_KEY;

gsap.registerPlugin(ScrollTrigger);

export default function Category() {
    const [categories, setCategories] = useState([]);
    const categorySectionRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getCategories = async () => {
            try {
                const response = await axios.get(`${serverUrl}/categories`);
                setCategories(response.data.responce);
            } catch (error) {
                console.log(error.message);
            }
        };
        getCategories();
    }, []);

    useEffect(() => {
        if (categories.length > 0 && categorySectionRef.current) {
            const items = gsap.utils.toArray('.category');

            gsap.fromTo(
                items,
                {
                    clipPath: 'polygon(0 100%, 0% 100%, 0% 0%, 0% 0%)',
                    opacity: 0,
                    y: 100,
                },
                {
                    clipPath: 'polygon(0 100%, 100% 100%, 100% 0%, 0% 0%)',
                    opacity: 1,
                    y: 0,
                    stagger: 0.1,
                    duration: 1,
                    ease: 'power4.out',
                    scrollTrigger: {
                        trigger: categorySectionRef.current,
                        start: 'top 80%',
                    },
                }
            );
        }
    }, [categories]);

    const navigateById = (id) => {
        const encrypted = CryptoJS.AES.encrypt(id, secretKey).toString();
        navigate(`/lineup?token=${encodeURIComponent(encrypted)}`);
    };

    return (
        <div
            ref={categorySectionRef}
            className='bg-mid px-4 md:px-16 py-8 border-2 border-white rounded'
        >
            <div className='flex justify-center items-end mb-6'>
                <h2 className='poppins-extrabold text-white text-[clamp(1.75rem,2.5vw,4rem)]'>
                    Vehicle Categories
                </h2>
            </div>

            <div className='flex flex-wrap gap-4 justify-center'>
                {categories.map((cat, idx) => (
                    <div
                        key={idx}
                        className='category bg-white h-36 w-full sm:w-[48%] md:w-[22%] lg:w-[15%] rounded hover:!border-[1px] hover:!border-[bg-zinc-500] flex flex-col items-center justify-center p-2 cursor-pointer'
                        onClick={() => navigateById(cat._id)}
                    >
                        <img src={cat.images[0]} alt={cat.category} className='h-20 w-20 object-contain' />
                        <p>{cat.category}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
