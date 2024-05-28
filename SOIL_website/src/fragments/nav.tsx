import { Button, IconButton } from '@chakra-ui/react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { User } from '../data/repository';
import { useEffect, useState } from 'react';
import { getCurrentUser } from '../data/repository';
import { logout } from '../data/repository';
import { useNavigate } from "react-router-dom";


export default function Header() {
    let user: User | null = getCurrentUser();

    const [username, setUsername] = useState<string | null>(user == null ? null : user.name);
    const navigate = useNavigate();
    useEffect(() => {
        const storageListener = () => {
            let user: User | null = getCurrentUser();
            navigate('/');
            setUsername(user == null ? null : user.name);
            console.log('storage event');
        };
        // Listen for changes to the storage event, because localStorage is shared across the whole domain
        window.addEventListener('myStorageEvent', storageListener);
        return () => {
            window.removeEventListener('myStorageEvent', storageListener);
        };
    }, []);
    return (
        <div className="m-4 p-4 " >
            {username == null ?
                <div className='flex text-center justify-end items-center gap-3'>
                    <Button className='flex-initial ' colorScheme='teal' variant='outline' onClick={e => navigate("/")}>
                        Home
                    </Button>
                    <Button className='flex-initial ' colorScheme='teal' variant='outline' onClick={e => navigate("/products")}>
                        Products
                    </Button>
                    <Button className='flex-initial ' colorScheme='teal' variant='outline' onClick={e => navigate("/signup")}>
                        Sign Up
                    </Button>
                    <Button className='flex-initial ' colorScheme='teal' variant='outline' onClick={e => navigate("/login")}>
                        Login
                    </Button></div>
                :
                <div className='flex text-center justify-end items-center gap-3'>
                    <Button className='flex-initial ' colorScheme='teal' variant='outline' onClick={e => navigate("/")}>
                        Home
                    </Button>
                    <Button className='flex-initial ' colorScheme='teal' variant='outline' onClick={e => navigate("/products")}>
                        Products
                    </Button>
                    <Button className='flex-initial ' colorScheme='teal' variant='outline' onClick={e => navigate("/profile")}>
                        Profiles
                    </Button><Button className='flex-initial ' colorScheme='teal' variant='outline' onClick={e => navigate("/recipes")}>
                        Personal Recipes
                    </Button><Button className='flex-initial ' colorScheme='teal' variant='outline' onClick={e => navigate("/shopping-cart")}>
                        Cart
                    </Button><Button className='flex-initial ' colorScheme='teal' variant='outline' onClick={e => { logout() }}>
                        Log Out
                    </Button>
                    <AccountCircleIcon />
                    <h1>{username}</h1>
                </div>
            }
        </div>
    );
}