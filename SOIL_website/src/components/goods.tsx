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


type Special = {
    id: number;
    name: string;
    price: number;
    originalPrice: number;
    category?: string;
    imageUrl: string;
    validFrom: string;
    validTo: string;
};

export type { Special };

// Default specials data
const defaultSpecials: Special[] = [
    {
        id: 1,
        name: 'organic Apple',
        price: 2.99,
        originalPrice: 3.99,
        imageUrl: 'https://www.greenlandsgrocer.com.au/wp-content/uploads/2020/09/1423565369.jpg',
        validFrom: '2024-04-20',
        validTo: '2024-05-05',
    },

    {
        id: 2,
        name: 'organic Bananas',
        price: 3.79,
        originalPrice: 6.79,
        imageUrl: 'https://www.greenlandsgrocer.com.au/wp-content/uploads/2020/09/1388394418.jpg',
        validFrom: '2024-04-20',
        validTo: '2024-05-05',
    },

    {
        id: 3,
        name: 'organic Blueberries',
        price: 6.95,
        originalPrice: 8.95,
        imageUrl: 'https://www.greenlandsgrocer.com.au/wp-content/uploads/2020/09/1424074560.jpg',
        validFrom: '2024-04-20',
        validTo: '2024-05-05',
    },

    {
        id: 4,
        name: 'organic Strawberries',
        price: 5.95,
        originalPrice: 6.95,
        imageUrl: 'https://www.greenlandsgrocer.com.au/wp-content/uploads/2020/09/1445482087.jpg',
        validFrom: '2024-04-20',
        validTo: '2024-05-05',
    },

    {
        id: 5,
        name: 'organic Grapes Green',
        price: 5.95,
        originalPrice: 7.95,
        imageUrl: 'https://www.greenlandsgrocer.com.au/wp-content/uploads/2020/09/1388394873.jpg',
        validFrom: '2024-04-20',
        validTo: '2024-05-05',
    },

    {
        id: 6,
        name: 'organic Avocados',
        price: 1.25,
        originalPrice: 2.25,
        imageUrl: 'https://www.greenlandsgrocer.com.au/wp-content/uploads/2020/09/1444081936.jpg',
        validFrom: '2024-04-20',
        validTo: '2024-05-05',
    },

    {
        id: 7,
        name: 'organic Cabbage – Red Whole',
        price: 5.95,
        originalPrice: 6.95,
        imageUrl: 'https://www.greenlandsgrocer.com.au/wp-content/uploads/2020/09/1388394558.jpg',
        validFrom: '2024-04-20',
        validTo: '2024-05-05',
    },

    {
        id: 8,
        name: 'organic Chinese / Wombok',
        price: 7.95,
        originalPrice: 8.95,
        imageUrl: 'https://www.greenlandsgrocer.com.au/wp-content/uploads/2020/09/1444188751.jpg',
        validFrom: '2024-04-20',
        validTo: '2024-05-05',
    },

    {
        id: 9,
        name: 'organic Capsicum Red',
        price: 4.25,
        originalPrice: 5.25,
        imageUrl: 'https://www.greenlandsgrocer.com.au/wp-content/uploads/2020/09/1388394588.jpg',
        validFrom: '2024-04-20',
        validTo: '2024-05-05',
    },

    {
        id: 10,
        name: 'Eggs – Free Range',
        price: 9.99,
        originalPrice: 12.49,
        imageUrl: 'https://www.greenlandsgrocer.com.au/wp-content/uploads/2020/09/1388394783.jpg',
        validFrom: '2024-04-20',
        validTo: '2024-05-05',
    },

    {
        id: 11,
        name: 'organic Carrots med',
        price: 1.49,
        originalPrice: 2.49,
        imageUrl: 'https://www.greenlandsgrocer.com.au/wp-content/uploads/2020/09/1388394618.jpg',
        validFrom: '2024-04-20',
        validTo: '2024-05-05',
    },

    {
        id: 12,
        name: 'organic Turmeric Fresh',
        price: 9.49,
        originalPrice: 12.49,
        imageUrl: 'https://www.greenlandsgrocer.com.au/wp-content/uploads/2020/09/1388408648.jpg',
        validFrom: '2024-04-20',
        validTo: '2024-05-05',
    },

];
interface GoodsProps {
    category: string;
}
const Goods = ({ category }: GoodsProps) => {
    const [specials, setSpecials] = useState<Special[]>([]);
    useEffect(() => {
        refresh();
    }, []);

    const refresh = async () => {
        // Using Axios with async.
        try {
            const result = await axios.post("http://localhost:4000/api/products", {
                category: category
            });
            setSpecials((result.data) as Special[]);
        } catch (e) {
        } finally {
        }
    };
    // const { addItem } = useCart(); 
    const { addToCart } = useShoppingCart();
    const navigate = useNavigate();
    const [quantities, setQuantities] = useState<{ [key: number]: number }>(
        defaultSpecials.reduce((acc, special) => {
            acc[special.id] = 1; // inashouliz number to  1
            return acc;
        }, {} as { [key: number]: number }) // make sure key = { [key: number]: number }
    );


    // useEffect(() => {
    //     const savedSpecials = localStorage.getItem('specials');
    //     if (savedSpecials) {
    //         const specialsData: Special[] = JSON.parse(savedSpecials); //  data is typed as an array of Special
    //         // check is newest data or not
    //         if (specialsData && specialsData.length === defaultSpecials.length &&
    //             specialsData.every((item: Special, index: number) => item.validTo === defaultSpecials[index].validTo)) {
    //             setSpecials(specialsData);
    //         } else {
    //             // if not , update to the newest data.
    //             localStorage.setItem('specials', JSON.stringify(defaultSpecials));
    //             setSpecials(defaultSpecials);
    //         }
    //     } else {
    //         localStorage.setItem('specials', JSON.stringify(defaultSpecials));
    //         setSpecials(defaultSpecials);
    //     }
    // }, []);


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
            const newQuantity = (prevQuantities[id] || 0) + delta;
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

        const user: User | null = getCurrentUser();
        const cartItem = {
            ...special,
            id: special.id.toString(),
            quantity: quantities[special.id]
        };
        // addToCart(cartItem);
        try {
            var response = await axios.put('http://localhost:4000/api/shopping_cart/add',
                {
                    user_id: user?.id,
                    product_id: special.id,
                    quantity: quantities[special.id],
                }
            );
            if (response.status === 400||response.status === 200) {
                toast({
                    title: 'Added to cart',
                    status: 'success',
                    duration: 1500,
                });
            }
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
        navigate('/shopping-cart');
    };

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
                            <p className="text-sm text-gray-500">Save
                                ${(special.originalPrice - special.price).toFixed(2)} kg</p>
                            <p className="text-sm text-gray-600 mb-4">Offer
                                valid {formatDate(special.validFrom)} - {formatDate(special.validTo)}</p>
                            <div className="flex items-center">
                                <div className="flex border rounded overflow-hidden mr-2">
                                    <button onClick={() => handleQuantityChange(special.id, -1)}
                                        className="px-3 py-1 bg-gray-200 text-gray-600 hover:bg-gray-300 focus:outline-none">
                                        -
                                    </button>
                                    <span className="px-3 py-1 bg-white text-gray-700">{quantities[special.id]}</span>
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
                                <button onClick={() => {navigate(`/detail/${special.id}`);}} className='ml-auto'>
                                    reviews
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



