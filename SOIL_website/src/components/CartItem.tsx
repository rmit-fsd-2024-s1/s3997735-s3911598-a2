import React from 'react';
import { Product } from '../models/Product';
import { Category } from '@mui/icons-material';

interface CartItemProps {
    item: {
        id: string;
        product_id: string;
        name: string;
        price: number;
        quantity: number;
    };
    onRemove: (id: string) => void;
    onUpdateQuantity: (id: string, quantity: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onRemove, onUpdateQuantity }) => {

    return (
        <div className="flex  border-b p-4 gap-4">
            <div className="flex items-center flex-col justify-center w-1/4">
                <h4 className="font-bold text-lg">{item.name}</h4>
            </div>
            <div className='flex items-center justify-between w-3/4'>
                <div className="text-center">
                    <p className="text-sm text-gray-600">Price</p>
                    <p>${item.price.toFixed(2)}</p>
                </div>
                <div className="text-center">
                    <p className="text-sm text-gray-600">Quantity</p>
                    <div className="flex items-center justify-center">
                        <button
                            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="bg-gray-200 text-gray-800 px-3 py-1 mx-1 rounded-md focus:outline-none hover:bg-gray-300"
                        >
                            -
                        </button>
                        <span className="mx-2 text-lg">{item.quantity}</span>
                        <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="bg-gray-200 text-gray-800 px-3 py-1 mx-1 rounded-md focus:outline-none hover:bg-gray-300"
                        >
                            +
                        </button>
                    </div>
                </div>
                <div className="text-center">
                    <p className="text-sm text-gray-600">Subtotal</p>
                    <p>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <button
                    onClick={() => onRemove(item.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};


export default CartItem;
