import React, { useState } from 'react';
import { verifyUser, getUser, removeUser } from '../utils/repository';

const SignIn = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [message, setMessage] = useState('');
    const [loggedInUser, setLoggedInUser] = useState(getUser());

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await verifyUser(formData.username, formData.password);
            if (user) {
                setLoggedInUser(user);
                setMessage(`Welcome ${user.username}`);
            } else {
                setMessage('Invalid username or password');
            }
        } catch (error) {
            setMessage('Error logging in');
            console.error(error);
        }
    };

    const handleLogout = () => {
        removeUser();
        setLoggedInUser(null);
        setMessage('You have been logged out');
    };

    return (
        <div>
            {loggedInUser ? (
                <div>
                    <h1>Welcome {loggedInUser.username}</h1>
                    <button onClick={handleLogout}>Logout</button>
                    {message && <p>{message}</p>}
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                    <button type="submit">Sign In</button>
                    {message && <p>{message}</p>}
                </form>
            )}
        </div>
    );
};

export default SignIn;
