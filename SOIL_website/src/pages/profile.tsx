import { deleteUser, getCurrentUser, UpdateUser } from "../data/repository";
import { User } from "../data/repository";
import { useState } from "react";
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

export default function Home() {
    const user: User | null = getCurrentUser();
    const navigate = useNavigate();
    const [edit, setEdit] = useState<boolean>(false);
    const [username, setUsername] = useState<string>(user?.name || '');
    const [email, setEmail] = useState<string>(user?.email || '');
    const { isOpen, onToggle, onClose } = useDisclosure()
    const toast = useToast()
    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();

        // Check if the values have changed
        if (username === user?.name && email === user?.email) {
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
        if (username && email) {
            UpdateUser(username, email);
            toast({
                title: 'Update successful!',
                status: 'success',
                duration: 2500,
            });
            // Refresh user data
            let updatedUser = getCurrentUser();
            if (updatedUser) {
                setUsername(updatedUser.name);
                setEmail(updatedUser.email);
            }
        }
        setEdit(false);
    }


    return (
        <div className=" items-center w-1/2  p-24 border-2 rounded flex flex-col gap-3">
            {edit ? <>
                <FormControl>
                    <FormLabel>Username</FormLabel>
                    <Input type='text' value={username} onChange={e => setUsername(e.target.value)} />
                </FormControl>
                <FormControl>
                    <FormLabel>Email address</FormLabel>
                    <Input type='email' value={email} onChange={e => setEmail(e.target.value)} />
                </FormControl>
                <div className='flex items-center gap-4'>
                    <Button type='submit' onClick={e => {handleUpdate(e)}} >Update</Button>
                </div>
            </> : <>
                <h1>username: {user?.name} </h1>
                <h1>email: {user?.email}</h1>
                <h1>join date: {user?.date ? new Date(user.date).toISOString().split('T')[0] : 'Unavailable'}</h1>
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
                                    <Button colorScheme='red' onClick={e=>{deleteUser();navigate('/')}}>Delete</Button>
                                </ButtonGroup>
                            </PopoverFooter>
                        </PopoverContent>
                    </Popover>
                </div>
            </>}

        </div>
    );
}