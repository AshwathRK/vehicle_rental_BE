<div className='h-[calc(99.8vh-78.4px)] flex flex-col lg:flex-row relative top-[78px]'>
    <div className='lg:w-7/10 w-full overflow-y-auto hide-scrollbar'>
        {/* Vehicle details */}
        <div className='w-full gb-lower h-135 flex justify-center items-center'>
            <div className="relative w-230 h-125 my-4 overflow-hidden">
                <img
                    src={`data:${currentImage?.contentType};base64,${currentImage?.data}`}
                    alt={`Slide ${currentIndex}`}
                    className="w-full h-full object-contain"
                />

                {vehicleInfo?.images.length > 1 && (
                    <>
                        <button
                            onClick={goToPrev}
                            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white border-black border rounded bg-opacity-50 text-white p-1 "
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" class="size-5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" />
                            </svg>

                        </button>
                        <button
                            onClick={goToNext}
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 border border-black bg-white rounded bg-opacity-50 text-white p-1"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" class="size-5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
                            </svg>

                        </button>
                    </>
                )}
            </div>
        </div>
        <div className='w-full gb-lower px-4 lg:px-20 h-full flex flex-col'>
            {/* Vehicle info */}
            <div className='w-full h-[100px] flex border-b border-[#d4d4d4]'>
                {/* Host info */}
            </div>
            <div className='w-full h-20 border mt-2 rounded px-3 py-2'>
                {/* Car location */}
            </div>
            <h6 className='!text-[13px] mt-3 poppins-semibold mb-0'>Ratings & Review</h6>
            <div className='w-full h-62 border mt-2 rounded px-3 py-2'>
                {/* Ratings and reviews */}
            </div>
            <h6 className='!text-[13px] mt-3 poppins-semibold mb-2'>Similar Listings</h6>
            {/* Similar listings */}
        </div>
    </div>
    <div className='lg:w-3/10 w-full lg:sticky lg:top-20 lg:h-screen h-auto bg-[#f0eded] flex flex-col px-4'>
        {/* Features and pricing */}
        <h6 className='!text-[15px] my-4 poppins-semibold mid'>Features</h6>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 border-b border-[#d4d4d4]">
            {/* Features list */}
        </div>
        <h6 className='!text-[15px] my-4 poppins-semibold mid'>Pricing</h6>
        <div className='w-full h-[300px] flex flex-col items-end'>
            {/* Pricing details */}
        </div>
    </div>
</div>