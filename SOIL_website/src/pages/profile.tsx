import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    FormControl,
    FormLabel,
    Input,
    Button,
    useToast,
} from '@chakra-ui/react'

interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    joinDate: string;
}

const Profile: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [edit, setEdit] = useState<boolean>(false);
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const toast = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userId = localStorage.getItem('userId'); // userID  store in localstorage
                if (!userId) {
                    throw new Error("No user ID found in localStorage");
                }
                const response = await axios.get<User>(`/api/users/profile/${userId}`);
                setUser(response.data);
                setFirstName(response.data.first_name);
                setLastName(response.data.last_name);
                setEmail(response.data.email);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUser();
    }, []);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (firstName === user?.first_name && lastName === user?.last_name && email === user?.email) {
            toast({
                title: 'No changes detected.',
                description: "You did not change anything!",
                status: 'warning',
                duration: 2500,
                isClosable: true,
            });
            return;
        }

        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            toast({
                title: 'Invalid email address',
                description: 'Please enter a valid email address.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        try {
            const userId = localStorage.getItem('userId'); // get userID from localstorage
            await axios.put(`/api/users/profile/${userId}`, { first_name: firstName, last_name: lastName, email });
            toast({
                title: 'Update successful!',
                status: 'success',
                duration: 2500,
            });
            setUser({ ...user!, first_name: firstName, last_name: lastName, email });
            setEdit(false);
        } catch (error) {
            toast({
                title: 'Error updating profile',
                description: 'An error occurred while updating your profile. Please try again.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    {edit ? (
                        <>
                            <FormControl>
                                <FormLabel>First Name</FormLabel>
                                <Input type='text' value={firstName} onChange={e => setFirstName(e.target.value)} />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Last Name</FormLabel>
                                <Input type='text' value={lastName} onChange={e => setLastName(e.target.value)} />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Email address</FormLabel>
                                <Input type='email' value={email} onChange={e => setEmail(e.target.value)} />
                            </FormControl>
                            <div className='flex items-center gap-4'>
                                <Button type='submit' onClick={handleUpdate}>Update</Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <h1>First Name: {user?.first_name} </h1>
                            <h1>Last Name: {user?.last_name} </h1>
                            <h1>Email: {user?.email}</h1>
                            <h1>Join Date: {user?.joinDate ? new Date(user.joinDate).toISOString().split('T')[0] : 'Unavailable'}</h1>
                            <div className="flex gap-3">
                                <Button onClick={() => setEdit(true)}>Edit</Button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
