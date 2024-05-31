import React, { useState, useEffect } from 'react';
import './App.css';
import Headers from './fragments/nav';
import Footers from './fragments/footer';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { CartProvider } from './contexts/CartContext';
import Signup from './pages/signup';
import Home from './pages/home';
import Login from './pages/login';
import Profile from './pages/profile';
import Recipes from './pages/recipes';
import ShoppingCart from './pages/ShoppingCart';
import OrderSummary from './pages/OrderSummary';
import CheckoutForm from "./components/CheckoutForm";
import Detail from './pages/productDetail';
import Products from './pages/products';

interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
}

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);

    const loginUser = (user: User) => {
        setUser(user);
    };




    return (
        <div className="App">
            <Router>
                <CartProvider> {/* Wrap your routes with CartProvider */}
                    <Headers />
                    <div className='flex-grow flex flex-col items-center justify-center text-center'>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/signup" element={<Signup loginUser={loginUser} />} />
                            <Route path="/login" element={<Login loginUser={loginUser} />} />
                            <Route path="/shopping-cart" element={<ShoppingCart />} />
                            <Route path="/checkout" element={<CheckoutForm />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/order-summary" element={<OrderSummary />} />
                            <Route path="/recipes" element={<Recipes />} />
                            <Route path="/detail/:id" element={<Detail />} />
                            <Route path="/products" element={<Products />} />
                        </Routes>
                    </div>
                    <hr />
                    <Footers />
                </CartProvider>

            </Router>
        </div>
    );
}

export default App;



