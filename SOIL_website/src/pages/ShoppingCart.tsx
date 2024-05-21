import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import CartItem from '../components/CartItem';
import { useToast } from '@chakra-ui/react';
import { useShoppingCart } from '../hooks/useShoppingCart';



const ShoppingCart = () => {
    const navigate = useNavigate();
    const {
        cartItems,
        removeFromCart,
        changeQuantity,
        emptyCart,
        cartTotalPrice,
    } = useShoppingCart();
    const toast = useToast();

    const [items, setItems] = React.useState(cartItems());
    const [totalPrice, setTotalPrice] = React.useState(cartTotalPrice());

    const clearCart = () => {
        emptyCart();
        setItems([]);
        setTotalPrice(0);
    }

    const updateQuantity = (id: string, quantity: number) => {
        changeQuantity(id, quantity);
        setItems(cartItems());
        setTotalPrice(cartTotalPrice());
    }

    const removeItem = (id: string) => { 
        removeFromCart(id);
        setItems(cartItems());
        setTotalPrice(cartTotalPrice());
    }


    // Processing function when clicking checkout
    const handleCheckoutClick = () => {

        localStorage.setItem('cartItems', JSON.stringify(items));
        // Nav to checkout page
        navigate('/checkout');
    };

    
    if (items.length === 0) {
        return <div>Your shopping cart is empty.</div>;
    }


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

            {items.length === 0 && (
                <div className="text-center text-gray-500">Your cart is empty.</div>
            )}

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
        </div>
    );
};

export default ShoppingCart;






