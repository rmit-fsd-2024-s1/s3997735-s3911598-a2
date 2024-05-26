import {
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getCartItems
} from '../data/repository';
import { CartItemModel } from '../data/repository';


export const useShoppingCart = () => {
    
        const addToCart = (product: CartItemModel) => {
            addItem(product);
        };
    
        const removeFromCart = (id: string) => {
            removeItem(id);
        };
    
        const changeQuantity = (id: string, quantity: number) => {
            updateQuantity(id, quantity >= 1 ? quantity : 1);
        };
    
        const emptyCart = () => {
            clearCart();
        };

        const cartTotalPrice = () => { 
            return getTotalPrice();
        };

        const cartItems = (): CartItemModel[] => {
            return getCartItems();



        }



    return {
        cartItems,
        addToCart,
        removeFromCart,
        changeQuantity,
        emptyCart,
        cartTotalPrice,
    };
};
