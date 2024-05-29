import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { User, getCurrentUser } from '../data/repository';
import axios from 'axios';

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

interface PaymentInfo {
    cardNumber: string;
    expiryDate: string;
}

const OrderSummary = () => {
    const navigate = useNavigate();
    const user: User | null = getCurrentUser();

    // get the order summary from localStorage 
    const cartItems: CartItem[] = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const paymentInfo: PaymentInfo = JSON.parse(localStorage.getItem('paymentInfo') || '{}');

    useEffect(() => {
        if (cartItems.length === 0 || !paymentInfo.cardNumber) {
            alert("No order information found.");
            navigate('/');
            return;
        }
    }, [navigate]);

    if (cartItems.length === 0 || !paymentInfo.cardNumber) {
        // When the data is incomplete, return null directly to prevent component rendering
        return null;
    }

    // calculate the total price
    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const handleContinueShopping = async () => {
        // clear localStorage 
        localStorage.removeItem('cartItems');
        localStorage.removeItem('paymentInfo');
        try {
            const user_id = user?.id;
            const response = await axios.delete('http://localhost:4000/api/shopping_cart/deleteAll',
                {
                    params: { user_id: user_id }
                }
            );
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
        navigate('/'); // nav to home page
    };

    
    //use CSS library: Tailwind 

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Order Summary</h1>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden p-6">
                <h2 className="text-2xl mb-6 text-gray-700">Purchase Items:</h2>
                <ul className="list-disc list-inside space-y-2">
                    {cartItems.map(item => (
                        <li key={item.id} className="text-gray-600">
                            {item.name} - {item.quantity} x <span className="font-semibold">${item.price.toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
                <p className="text-xl font-semibold mt-8 text-gray-800">Total Price: <span className="text-green-500">${totalPrice.toFixed(2)}</span></p>
            </div>
            <div className="mt-8 bg-white shadow-lg rounded-lg overflow-hidden px-6 py-6">
                <h2 className="text-2xl mb-6 text-gray-700">Payment Info:</h2>
                <p className="text-gray-600">Card Number: <span className="font-semibold">**** **** **** {paymentInfo.cardNumber.slice(-4)}</span></p>
                <p className="text-gray-600">Expiry Date: <span className="font-semibold">{paymentInfo.expiryDate}</span></p>
                <p className="mt-8 text-gray-600">Thank you for your purchase!</p>
                <button onClick={handleContinueShopping}
                        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:shadow-outline">
                    Continue Shopping
                </button>
            </div>
        </div>
    );
    
};

export default OrderSummary;

