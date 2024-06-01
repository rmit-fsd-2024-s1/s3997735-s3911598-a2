import { getCurrentUser, logout, setCurrentUser } from "../data/repository";
import { User } from "../data/repository";
import { useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { log } from "console";

export default function Home() {
    const currentUser: User | null = getCurrentUser();
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [edit, setEdit] = useState<boolean>(false);
    const [first_name, setFirst_name] = useState<string>(user?.first_name || '');
    const [last_name, setLast_name] = useState<string>(user?.last_name || '');
    const [address, setAddress] = useState<string>(user?.address || '');
    const { isOpen, onToggle, onClose } = useDisclosure()
    const toast = useToast()
    const getUserProfile = async () => {
        try {
            const res = await axios.post("http://localhost:4000/api/users/profile/get", {
                id: currentUser?.id
            });
            setUser(res.data);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    }

    useEffect(() => {
        getUserProfile();
    }, []);
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check if the values have changed
        if (first_name === user?.first_name && last_name === user?.last_name) {
            toast({
                title: 'No changes detected.',
                description: "You did not change anything!",
                status: 'warning',
                duration: 2500,
                isClosable: true,
            });
            return; // Exit the function if no changes
        }

        // Continue with the update if there are changes
        if (first_name && last_name) {
            const res = await axios.post("http://localhost:4000/api/users/profile/update", {
                id: user?.id,
                first_name,
                last_name,
                address
            });
            if (res.data) {
                setCurrentUser(res.data);
                toast({
                    title: 'Update successful!',
                    status: 'success',
                    duration: 2500,
                });
                // Refresh user data
                getUserProfile();

            }
        }
        setEdit(false);
    }
    const deleteUser = async () => {
        try {
            const res = await axios.delete("http://localhost:4000/api/users/delete", {
                params: {id: user?.id}
            });
            if (res.status === 200) {
                toast({
                    title: 'Account deleted!',
                    status: 'success',
                    duration: 2500,
                });
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
        navigate('/');
        logout();
    }


    return (
        <div className=" items-center w-full  p-24 border-2 rounded flex flex-col gap-3">
            {edit ? <>
                <FormControl>
                    <FormLabel>First name</FormLabel>
                    <Input type='text' value={first_name} onChange={e => setFirst_name(e.target.value)} />
                </FormControl>
                <FormControl>
                    <FormLabel>Last name</FormLabel>
                    <Input type='text' value={last_name} onChange={e => setLast_name(e.target.value)} />
                </FormControl>
                <FormControl>
                    <FormLabel>Address</FormLabel>
                    <Input type='text' value={address} onChange={e => setAddress(e.target.value)} />
                </FormControl>
                <div className='flex items-center gap-4'>
                    <Button onClick={e => setEdit(false)}>Cancel</Button>
                    <Button type='submit' onClick={e => { handleUpdate(e) }} >Update</Button>
                </div>
            </> : <>
                <h1>first name: {user?.first_name} </h1>
                <h1>last name: {user?.last_name} </h1>
                <h1>address: {user?.address?user.address:'Not filled in yet'} </h1>
                <h1>email: {user?.email}</h1>
                <h1>join date: {user?.createdAt ? user.createdAt : 'Unavailable'}</h1>
                <div className="flex gap-3">
                    <Button onClick={e => setEdit(true)}>Edit</Button>
                    {/* Code modified based on the example at: https://chakra-ui.com/docs/components/popover/usage#controlled-usage */}
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
                                    <Button colorScheme='red' onClick={deleteUser}>Delete</Button>
                                </ButtonGroup>
                            </PopoverFooter>
                        </PopoverContent>
                    </Popover>
                </div>
            </>}

        </div>
    );
}