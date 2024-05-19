import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { validateCreditCardNumber, validateExpiryDate } from '../utils/validators';

const CheckoutForm: React.FC = () => {
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const navigate = useNavigate(); 

    // handle submit
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        // simply validation
        if (!validateCreditCardNumber(cardNumber) || !validateExpiryDate(expiryDate)) {
            alert('Please input valid card number and expiry date.');
            return;
        }
        
        //save credit card info to localStorage
        //why ? because we need to show it in order summary
        const paymentInfo = { cardNumber, expiryDate };
        localStorage.setItem('paymentInfo', JSON.stringify(paymentInfo));
        

        // if checkout successful
        console.log('Credit card is valid. Navigating to order summary.');
        navigate('/order-summary'); // Navigate to order-summary page
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-6">
                <label htmlFor="cardNumber" className="block text-gray-700 text-sm font-bold mb-2">
                    Card Number:
                </label>
                <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    placeholder="1234 1234 1234 1234"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                />
            </div>
            <div className="mb-6">
                <label htmlFor="expiryDate" className="block text-gray-700 text-sm font-bold mb-2">
                    Expiry Date:
                </label>
                <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    value={expiryDate}
                    onChange={e => setExpiryDate(e.target.value)}
                    placeholder="MM/YY"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                />
            </div>
            <div className="flex items-center justify-between">
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                >
                    Checkout
                </button>
            </div>
        </form>
    );
};

export default CheckoutForm;


