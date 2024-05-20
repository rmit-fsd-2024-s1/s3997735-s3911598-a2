
import React, { useState } from 'react';
import { createUser } from '../data/repository';

const SignUp = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: ''
    });

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await createUser(formData);
            setMessage(`User created successfully: ${user.username}`);
        } catch (error) {
            setMessage('Error creating user');
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
            <input type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} required />
            <input type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} required />
            <button type="submit">Sign Up</button>
            {message && <p>{message}</p>}
        </form>
    );
};

export default SignUp;
