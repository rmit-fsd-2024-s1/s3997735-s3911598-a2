import React from 'react';
import Specials from '../components/goods';
import GardeningTips from '../components/GardeningTips';

export default function Home() {
    return (
        <div className="home-container mx-auto">
            {/* Header with background image and centered text */}
            <div className="flex items-center justify-center text-white text-center"
                style={{
                    backgroundImage: 'url(https://fmtmagazine.in/wp-content/uploads/2021/02/Organic-Food.jpg)',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center center',
                    height: '90vh'
                }}>
                <div className="flex flex-col justify-center items-center h-full w-full">
                    <h1 className="text-5xl font-bold">Welcome to soil online shop.</h1>
                </div>
            </div>

            {/* Content */}
            <div className="content-container p-24 border-t-2 border-gray-200">
                <h2 className="text-3xl font-bold mb-8">Weekly Specials</h2>
                <hr className="mb-8" />
                <Specials category='special'/>
            </div>
        </div>
    );
}


