import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    Button,
    useToast,
} from '@chakra-ui/react'
import { useState } from 'react';
import { getCurrentUser,checkUserExists, signup } from '../data/repository';

import { useNavigate } from "react-router-dom";



export default function Sign() {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const navigate = useNavigate();
    const toast = useToast();
    

    function signUpValidation(username: string, email: string, password: string): boolean {
        if (!(username && email && password)) {
            toast({
                title: 'username, email and password are required',
                status: 'error',
                duration: 2500,
            })
            return false;
        }
        // get this regex from https://chat.openai.com/
        var emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            toast({
                title: 'Invalid email address',
                status: 'error',
                duration: 2000,
            })
            return false;
        }
        // at least one lowercase letter, one uppercase letter, one number, one special character, and at least 8 characters
        // get this regex from https://chat.openai.com/
        var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            toast({
                title: 'Invalid password',
                description: 'Password must contain at least one lowercase letter, one uppercase letter, one number, one special character, and at least 8 characters',
                status: 'error',
                duration: 2000,
            })
            return false;
        }

        if (checkUserExists(email)) {
            toast({
                title: 'Account already exists',
                status: 'error',
                duration: 2000,
            });
            return false;
        }
        
        return true;


    }

    return (
        <div className=" items-center w-1/2  p-24 border-2 rounded flex flex-col gap-3">

            <FormControl>
                <FormLabel>Username</FormLabel>
                <Input type='text' value={username} onChange={e => setUsername(e.target.value)} />
            </FormControl>
            <FormControl>
                <FormLabel>Email address</FormLabel>
                <Input type='email' value={email} onChange={e => setEmail(e.target.value)} />
            </FormControl>
            <FormControl>
                <FormLabel>Password</FormLabel>
                <Input type='password' value={password} onChange={e => setPassword(e.target.value)} />
            </FormControl>
            <div className='flex items-center'>
                <Button type='submit' onClick={e => {
                    e.preventDefault();
                    if (signUpValidation(username, email, password)) {
                        signup(username, email, password);
                        navigate("/");
                        toast({
                            title: 'Sign up successful!',
                            status: 'success',
                            duration: 2500,
                        })
                    }
                }} >Sign Up</Button>
            </div>
        </div>
    );
}