import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    FormControl,
    FormLabel,
    Input,
    Button,
    Popover,
    useDisclosure,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverArrow,
    PopoverCloseButton,
    PopoverBody,
    PopoverFooter,
    ButtonGroup,
    useToast,
} from '@chakra-ui/react'

interface User {
    id: number;
    username: string;
    email: string;
    joinDate: string;
}

const Profile: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [edit, setEdit] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const { isOpen, onToggle, onClose } = useDisclosure();
    const toast = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get<User>('/api/user');
                setUser(response.data);
                setUsername(response.data.username);
                setEmail(response.data.email);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUser();
    }, []);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (username === user?.username && email === user?.email) {
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
            await axios.put('/api/user', { username, email });
            toast({
                title: 'Update successful!',
                status: 'success',
                duration: 2500,
            });
            setUser({ ...user!, username, email });
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

    const handleDelete = async () => {
        try {
            await axios.delete('/api/user');
            navigate('/');
        } catch (error) {
            toast({
                title: 'Error deleting account',
                description: 'An error occurred while deleting your account. Please try again.',
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
                                <FormLabel>Username</FormLabel>
                                <Input type='text' value={username} onChange={e => setUsername(e.target.value)} />
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
                            <h1>Username: {user?.username} </h1>
                            <h1>Email: {user?.email}</h1>
                            <h1>Join Date: {user?.joinDate ? new Date(user.joinDate).toISOString().split('T')[0] : 'Unavailable'}</h1>
                            <div className="flex gap-3">
                                <Button onClick={() => setEdit(true)}>Edit</Button>
                                <Popover
                                    returnFocusOnClose={false}
                                    isOpen={isOpen}
                                    onClose={onClose}
                                    placement='right'
                                    closeOnBlur={false}
                                >
                                    <PopoverTrigger>
                                        <Button onClick={onToggle}>Delete</Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <PopoverHeader fontWeight='semibold'>Confirmation</PopoverHeader>
                                        <PopoverArrow />
                                        <PopoverCloseButton />
                                        <PopoverBody>
                                            Are you sure you want to delete your account?
                                        </PopoverBody>
                                        <PopoverFooter display='flex' justifyContent='flex-end'>
                                            <ButtonGroup size='sm'>
                                                <Button variant='outline' onClick={onClose}>Cancel</Button>
                                                <Button colorScheme='red' onClick={handleDelete}>Delete</Button>
                                            </ButtonGroup>
                                        </PopoverFooter>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
