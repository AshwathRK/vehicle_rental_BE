import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const serverUrl = import.meta.env.VITE_SERVER_URL;

gsap.registerPlugin(ScrollTrigger);

export default function Category() {
  const [categories, setCategories] = useState([]);
  const categorySectionRef = useRef(null);

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
            className='category bg-white h-36 w-full sm:w-[48%] md:w-[22%] lg:w-[15%] rounded shadow flex flex-col items-center justify-center p-2 cursor-pointer hover:opacity-60'
          >
            <img
              src={cat.images[0]}
              alt={cat.category}
              className='h-16 w-30 object-cover mb-2'
            />
            <h4 className='text-sm poppins-semibold text-center'>
              {cat.category}
            </h4>
          </div>
        ))}
      </div>
    </div>
  );
}
