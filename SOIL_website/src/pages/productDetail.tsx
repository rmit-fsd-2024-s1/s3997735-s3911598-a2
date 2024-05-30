import React, { useEffect } from 'react';
import Reviews from '../components/reviews';
import { Special } from '../components/goods';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import StarRatings from 'react-star-ratings';

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = React.useState<Special>();
    const [rating, setRating] = React.useState<number>(0);
    const getProudct = async () => {
        try {
            const product = await axios.post("http://localhost:4000/api/products/one", {
                product_id: id
            });
            setProduct(product.data);
            const result = await axios.get("http://localhost:4000/api/reviews/getTotalRating", {
                params: { product_id: id }
            });
            if (result.data[0].totalRating === null) {
                setRating(0);
                return;
            }
            var rating = result.data[0].totalRating as string;
            console.log(result.data[0].totalRating);
            setRating(parseFloat(rating));
        } catch (error) {
            console.error('Error fetching products:', error);
        }


    }
    useEffect(() => {
        getProudct();
    }, []);
    // Format the date
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        if (isNaN(date.valueOf())) {
            return 'Invalid date';
        }
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };
    if (!id) {
        return <div>Invalid product ID</div>;
    }

    return (
        <div className="flex w-full">
            <div className="m-6 border-gray-200 ">
                <div key={product?.id} className="special-item border rounded-lg overflow-hidden shadow-md p-4">
                    <div className="w-full h-40 mb-4 flex justify-center items-center">
                        <img src={product?.imageUrl} alt={product?.name} className="object-contain max-h-full mx-auto" />
                    </div>
                    <div className="text-left">
                        <h3 className="text-lg font-bold">{product?.name}</h3>
                        <p className="text-xl font-bold">${product?.price.toFixed(2)} /kg</p>
                        {product && <><p className="text-sm text-gray-500">Save
                            ${(product.originalPrice - product?.price).toFixed(2)} /kg</p>
                            <p className="text-sm text-gray-600 mb-4">Offer
                                valid {formatDate(product.validFrom)} - {formatDate(product.validTo)}</p></>}
                        <StarRatings
                            rating={rating}
                            starDimension="10px"
                            starSpacing="3px"
                        />
                    </div>
                </div>
            </div>
            <div className='grow'>
                <Reviews product_id={id} />
            </div>
        </div>
    );
}


