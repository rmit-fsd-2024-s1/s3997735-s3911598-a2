import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';


// Define the types of shopping cart items

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

// Define the value type of the context
interface CartContextType {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
}

// Create Context
const CartContext = createContext<CartContextType | undefined>(undefined);


interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>(() => {
        // Attempt to retrieve shopping cart from localStorage, 
        // if not, initialize to an empty array
        const savedCartItems = localStorage.getItem('cartItems');
        return savedCartItems ? JSON.parse(savedCartItems) : [];
    });

    const addItem = (newItem: CartItem) => {
        setItems(prevItems => {
            const itemIndex = prevItems.findIndex(item => item.id === newItem.id);
            if (itemIndex > -1) {
                // if item already in shopping cart,update it
                const updatedItems = [...prevItems];
                updatedItems[itemIndex].quantity += newItem.quantity;
                return updatedItems;
            }
            // add new item to shopping cart
            return [...prevItems, newItem];
        });
    };

    const removeItem = (id: string) => {
        setItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    const updateQuantity = (id: string, quantity: number) => {
        setItems(prevItems => {
            return prevItems.map(item =>
                item.id === id ? { ...item, quantity: quantity } : item
            );
        });
    };

    const clearCart = () => {
        setItems([]);
        localStorage.removeItem('cartItems');
    };

    // Checking items changes
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(items));
    }, [items]);

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

// This custom hook useCart utilizes the useContext hook to allow components to access CartContext
export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export default CartProvider;

