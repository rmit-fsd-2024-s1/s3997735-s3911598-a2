import React from 'react';
import Specials from '../components/goods';
import Reviews from '../components/reviews';
import { Special } from '../components/goods';
import { useParams } from 'react-router-dom';

export default function ProductDetail() {
    const { id } = useParams();
    // const [special, setSpecial] = React.useState<Special>();
    const special = {
        id: 1,
        name: 'organic Apple',
        price: 2.99,
        originalPrice: 3.99,
        imageUrl: 'https://www.greenlandsgrocer.com.au/wp-content/uploads/2020/09/1423565369.jpg',
        validFrom: '2024-04-20',
        validTo: '2024-05-05',
    }
    // Format the date
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        if (isNaN(date.valueOf())) {
            return 'Invalid date';
        }
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="flex">
            <div className="m-6 border-gray-200 ">
                <div key={special.id} className="special-item border rounded-lg overflow-hidden shadow-md p-4">
                    <div className="w-full h-40 mb-4 flex justify-center items-center">
                        <img src={special.imageUrl} alt={special.name} className="object-contain max-h-full mx-auto" />
                    </div>
                    <div className="text-left">
                        <h3 className="text-lg font-bold">{special.name}</h3>
                        <p className="text-xl font-bold">${special.price.toFixed(2)} kg</p>
                        <p className="text-sm text-gray-500">Save
                            ${(special.originalPrice - special.price).toFixed(2)} kg</p>
                        <p className="text-sm text-gray-600 mb-4">Offer
                            valid {formatDate(special.validFrom)} - {formatDate(special.validTo)}</p>

                    </div>
                </div>
            </div>
            <div>
                <Reviews />
            </div>
        </div>
    );
}


