import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CartItem from '../components/CartItem';
import { useToast } from '@chakra-ui/react';
import { User, getCurrentUser } from '../data/repository';
import axios from 'axios';
import { CartItemModel } from '../data/repository';



const ShoppingCart = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const user: User | null = getCurrentUser();
    console.log("user", user);
    const [items, setItems] = React.useState<CartItemModel[]>([]);

    const [totalPrice, setTotalPrice] = React.useState(0);
    const fetchCartItems = async () => {
        try {
            const user_id = user?.id;
            const response = await axios.post('http://localhost:4000/api/shopping_cart',
                {
                    user_id: user_id
                }
            );
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    };
    useEffect(() => {
        fetchCartItems();
    }, []);
    useEffect(() => {
        const result = items.reduce((total, item) => total + item.price * item.quantity, 0);
        setTotalPrice(result);
    }, [items]);


    const clearCart = async () => {
        try {
            const user_id = user?.id;
            const response = await axios.delete('http://localhost:4000/api/shopping_cart/deleteAll',
                {
                    params: { user_id: user_id }
                }
            );
            fetchCartItems();
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    }

    const updateQuantity = async (id: string, quantity: number) => {
        try {
            const response = await axios.post('http://localhost:4000/api/shopping_cart/update',
                {
                    id: id,
                    quantity: quantity,

                }
            );
            fetchCartItems();
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    }

    const removeItem = async (id: string) => {
        try {
            const response = await axios.delete('http://localhost:4000/api/shopping_cart/delete',
                { params: { id: id } }
            );
            fetchCartItems();
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    }


    // Processing function when clicking checkout
    const handleCheckoutClick = () => {

        localStorage.setItem('cartItems', JSON.stringify(items));
        // Nav to checkout page
        navigate('/checkout');
    };




    return (
        <div className="container mx-auto p-6 bg-white shadow-md rounded">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">Shopping Cart</h1>

            <div className={items.length === 0 ? 'hidden' : ''}>
                {items.map(item => (
                    <CartItem
                        key={item.id}
                        item={item}
                        onRemove={removeItem}
                        onUpdateQuantity={(id, quantity) => {
                            // make sure quantity at least 1.
                            const newQuantity = quantity >= 1 ? quantity : 1;
                            updateQuantity(id, newQuantity);
                        }}
                    />
                ))}
            </div>

            {items.length === 0 ? <div className="text-center text-gray-500">Your cart is empty.</div> : (
                <>

                    <div className="flex justify-between items-center mt-8 font-bold text-xl">
                        <span>Total Price:</span>
                        <span>${totalPrice.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-end space-x-4 mt-6">
                        <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300" onClick={clearCart}>
                            Clear Cart
                        </button>
                        <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300" onClick={handleCheckoutClick}>
                            Checkout
                        </button>
                    </div>
                </>
            )}


        </div>
    );
};

export default ShoppingCart;






