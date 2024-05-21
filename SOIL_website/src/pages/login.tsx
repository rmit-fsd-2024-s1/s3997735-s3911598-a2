import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    Button,
} from '@chakra-ui/react'
import { useState } from 'react';
import { getCurrentUser, login } from '../data/repository';

import { useNavigate } from "react-router-dom";

export default function Login() {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const handleLogin = (e:React.FormEvent) => {
        e.preventDefault();
        const user = login(email, password);
        if (user) {
            navigate("/");
        } else {
            setError("Invalid email or password");
        }
    }

    return (
        <div className=" items-center w-1/2  p-24 border-2 rounded flex flex-col gap-3">

            <FormControl>
                <FormLabel>Email address</FormLabel>
                <Input type='email' value={email} onChange={e=> setEmail(e.target.value)}/>
            </FormControl>
            <FormControl>
                <FormLabel>Password</FormLabel>
                <Input type='password' value={password} onChange={e=> setPassword(e.target.value)}/>
            </FormControl>
            <div className='flex items-center'>
                <Button type='submit' onClick={e => handleLogin(e)} >Login</Button>
            </div>
            {error && <div className='text-red-500'>{error}</div>}
        </div>
    );
}