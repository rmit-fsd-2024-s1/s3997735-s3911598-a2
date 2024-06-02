import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { FaCartPlus } from 'react-icons/fa';
import { User, getCurrentUser, isLoggedIn } from '../data/repository';
import { useToast } from '@chakra-ui/react';
import { useShoppingCart } from '../hooks/useShoppingCart';
import axios from "axios";
import { data } from 'autoprefixer';
import { Category } from '@mui/icons-material';
import StarRatings from 'react-star-ratings';


type Special = {
    id: number;
    name: string;
    price: number;
    originalPrice: number;
    category?: string;
    imageUrl: string;
    validFrom: string;
    validTo: string;
    rating: string;
};

export type { Special };
interface GoodsProps {
    category: string;
}
const Goods = ({ category }: GoodsProps) => {
    const [specials, setSpecials] = useState<Special[]>([]);
    const user: User | null = getCurrentUser();
    useEffect(() => {
        refresh();
    }, []);

    const refresh = async () => {
        // Using Axios with async.
        try {
            const result = await axios.post("http://localhost:4000/api/products", {
                category: category
            });
            let data = result.data as Special[];
            const promises = data.map(async (item) => {
                try {
                    const rating = await getRatings(item.id);
                    item.rating = rating;
                } catch (error) {
                    console.error(error);
                    item.rating = '0';
                }
            });
    
            // Wait for all promises to resolve
            await Promise.all(promises);
    
            setSpecials(data);
        } catch (e) {
            console.error(e);
        }
    };
    // const { addItem } = useCart(); 
    const { addToCart } = useShoppingCart();
    const navigate = useNavigate();
    const [quantities, setQuantities] = useState<{ [key: number]: number }>([]);


    // Format the date
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        if (isNaN(date.valueOf())) {
            return 'Invalid date';
        }
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // handle the quantity change
    const handleQuantityChange = (id: number, delta: number) => {
        setQuantities((prevQuantities) => {
            const newQuantity = (prevQuantities[id] || 1) + delta;
            return { ...prevQuantities, [id]: newQuantity < 1 ? 1 : newQuantity }; // start with  1
        });
    };

    const toast = useToast();

    // handle the change of shopping cart
    const handleAddToCart = async (special: Special) => {
        // Check if user is logged in
        if (!isLoggedIn()) {
            toast({
                title: 'Please log in first',
                status: 'error',
                duration: 2000,
            });
            // Navigate to login page
            navigate('/login');
            return;
        }

        try {
            var response = await axios.put('http://localhost:4000/api/shopping_cart/add',
                {
                    user_id: user?.id,
                    product_id: special.id,
                    quantity: quantities[special.id] ? quantities[special.id] : 1,
                }
            );
            if (response.status === 400 || response.status === 200) {
                toast({
                    title: 'Added to cart',
                    status: 'success',
                    duration: 1500,
                });
            }
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    };

    const getRatings = async (id: number) => {
        try {
            const result = await axios.get("http://localhost:4000/api/reviews/getTotalRating", {
                params: { product_id: id }
            });
            if (result.data[0].totalRating === null) {
                return '0';
            }
            return result.data[0].totalRating as string;
        } catch (error) {
            console.error('Error fetching products:', error);
            return '0';
        }
    }

    return (
        <div className="specials-container mx-auto mt-4 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {specials.map((special) => (
                    <div key={special.id} className="special-item border rounded-lg overflow-hidden shadow-md p-4">
                        <div className="w-full h-40 mb-4 flex justify-center items-center">
                            <img src={special.imageUrl} alt={special.name} className="object-contain max-h-full mx-auto" />
                        </div>
                        <div className="text-left">
                            <h3 className="text-lg font-bold">{special.name}</h3>
                            <p className="text-xl font-bold">${special.price.toFixed(2)} kg</p>
                            {special.category === 'special' && <>
                                <p className="text-sm text-gray-500">Save
                                    ${(special.originalPrice - special.price).toFixed(2)} kg</p>
                                <p className="text-sm text-gray-600 mb-4">Offer
                                    valid {formatDate(special.validFrom)} - {formatDate(special.validTo)}</p></>}
                            <div className="flex items-center">
                                <div className="flex border rounded overflow-hidden mr-2">
                                    <button onClick={() => handleQuantityChange(special.id, -1)}
                                        className="px-3 py-1 bg-gray-200 text-gray-600 hover:bg-gray-300 focus:outline-none">
                                        -
                                    </button>
                                    <span className="px-3 py-1 bg-white text-gray-700">{quantities[special.id] ? quantities[special.id] : 1}</span>
                                    <button onClick={() => handleQuantityChange(special.id, 1)}
                                        className="px-3 py-1 bg-gray-200 text-gray-600 hover:bg-gray-300 focus:outline-none">
                                        +
                                    </button>
                                </div>
                                <button
                                    onClick={() => handleAddToCart(special)}
                                    className="p-2 bg-green-500 hover:bg-green-700 text-white font-bold rounded focus:outline-none focus:shadow-outline flex items-center justify-center"
                                >
                                    <FaCartPlus size={20} />
                                </button>
                                <button onClick={() => { navigate(`/detail/${special.id}`); }} className='ml-auto'>
                                    <StarRatings
                                        rating={special.rating ? parseFloat(special.rating) : 0}
                                        starDimension="10px"
                                        starSpacing="3px"
                                    />
                                </button>

                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

};

export default Goods;



