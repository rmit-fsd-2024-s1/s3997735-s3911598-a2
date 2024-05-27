
import { Button, ButtonGroup, FormLabel, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, useDisclosure, useToast } from '@chakra-ui/react';
import TextField from '@mui/material/TextField';
import StarRatings from 'react-star-ratings';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { User, getCurrentUser } from '../data/repository';
import { comment } from 'postcss';
import { useNavigate } from 'react-router-dom';

interface Reply {
    id: string;
    userId: string;
    author: string;
    rating: number;
    content: string;
    children: Reply[];
}

interface Review {
    id: string;
    userId: string;
    author: string;
    rating: number;
    content: string;
    children: Reply[];
}

interface ReviewProps {
    review: Review;
    sendReview: (parent_id: string | null, rating: number, content: string) => void;
}

interface CommentProps {
    product_id: string;
}

export default function Comment({ product_id }: CommentProps) {
    const user: User | null = getCurrentUser();
    const [comments, setComments] = useState<Review[]>([]);
    const [rating, setRating] = useState(0);
    const [content, setContent] = useState('');
    const toast = useToast();
    const [words, setWords] = useState(0);
    const getReviews = async (id: string) => {
        // fetch reviews from the backend
        try {
            const product = await axios.post("http://localhost:4000/api/reviews", {
                product_id: id
            });
            console.log(product.data);
            setComments(product.data.result);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }
    useEffect(() => {
        getReviews(product_id);
    }, []);

    const sendReview = async (parent_id: string | null, rating: number, content: string) => {

        // send review to the backend
        try {
            const result = await axios.put("http://localhost:4000/api/reviews/add", {
                product_id: product_id,
                rating: rating,
                content: content,
                user_id: user?.id,
                parent_id: parent_id
            });
            if (result.status !== 200) {
                toast({
                    title: 'Review not sent',
                    status: 'error',
                    duration: 2000,
                });
                return;
            }
            console.log(result.data);
            toast({
                title: 'Review sent',
                status: 'success',
                duration: 2000,
            });
            getReviews(product_id);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }
    const wordsHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const words = event.target.value.trim().split(/\s+/).filter(Boolean).length;
        if (words <= 100) {
            setWords(words);
            setContent(event.target.value);
        }


    }

    return (
        <>
            <div className='p-4'>
                <div className='text-left'>REVIEWS: </div>
                <hr />
                <br />
                <div className=' p-4 flex justify-center items-center gap-3'>
                    <p>{user?.name}</p>
                    <TextField inputProps={{ maxLength: 100 }} value={content} onChange={wordsHandler} className='grow' id="outlined-basic" label="input comments" variant="outlined" size='small' />
                    <p>{words} / 100 words</p>
                    <FormLabel >rating:</FormLabel>

                    <NumberInput className='w-16' value={rating} onChange={(valueAsString, valueAsNumber) => setRating(valueAsNumber)} min={0} max={5}>
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                    <Button colorScheme="teal" variant="solid" onClick={e => sendReview(null, rating, content)}>send</Button>
                </div>
                <div className='p-4'>
                    {comments?.map((comment, index) => (
                        <MuiltilayerReview key={index} review={comment} sendReview={sendReview} />
                    ))}
                </div>
            </div>
        </>);
}

const MuiltilayerReview = ({ review, sendReview }: ReviewProps) => {
    const user: User | null = getCurrentUser();
    const toast = useToast();
    const navigate = useNavigate();
    const { id, userId, author, rating, content, children } = review;
    const [replyRateing, setReplyRating] = useState(0);
    const [replyContent, setReplyContent] = useState('');
    const [updateRating, setUpdateRating] = useState(rating);
    const [updateContent, setUpdateContent] = useState(content);
    const { isOpen, onToggle, onClose } = useDisclosure();
    const { isOpen: isEditOpen, onToggle: onEditToggle, onClose: onEditClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onToggle: onDeleteToggle, onClose: onDeleteClose } = useDisclosure();
    const replyHandler = () => {
        sendReview(id, replyRateing, replyContent);
        onClose();
    }
    const updateHandler = async () => {
        try {
            const result = await axios.post("http://localhost:4000/api/reviews/update", {
                id: id,
                rating: updateRating,
                content: updateContent,
            });
            if (result.status !== 200) {
                toast({
                    title: 'Review not updated',
                    status: 'error',
                    duration: 2000,
                });
                return;
            }
            console.log(result.data);
            toast({
                title: 'Review updated',
                status: 'success',
                duration: 2000,
            });
            onEditClose();
            navigate(0);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }
    const deleteHandler = async () => {
        try {
            const result = await axios.delete("http://localhost:4000/api/reviews/delete", {
                params: { id: id }
            });
            if (result.status !== 200) {
                toast({
                    title: 'Review not deleted',
                    status: 'error',
                    duration: 2000,
                });
                return;
            }
            console.log(result.data);
            toast({
                title: 'Review deleted',
                status: 'success',
                duration: 2000,
            });
            onDeleteClose();
            navigate(0);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }
    return (
        <>
            <hr />
            <div className='flex flex-col justify-center items-start w-full '>

                <div className='grow-0'>
                    {author}: {content}
                </div>
                <div className='grow text-left  break-words whitespace-normal'>

                    <div className='flex gap-2'>
                        <StarRatings
                            rating={rating}
                            starDimension="10px"
                            starSpacing="3px"
                        />
                        {(user?.id) === Number(userId) && <>
                            <Popover
                                returnFocusOnClose={false}
                                isOpen={isEditOpen}
                                onClose={onEditClose}
                                placement='right'
                                closeOnBlur={false}
                            >
                                <PopoverTrigger>
                                    <Button onClick={onEditToggle} variant='link'>edit</Button>
                                </PopoverTrigger>
                                <PopoverContent width="450px">
                                    <PopoverHeader fontWeight='semibold'>EDIT</PopoverHeader>
                                    <PopoverArrow />
                                    <PopoverCloseButton />
                                    <PopoverBody>
                                        <TextField inputProps={{ maxLength: 100 }} value={updateContent} onChange={e => setUpdateContent(e.target.value)} className='w-full' id="outlined-basic" label="input reviews" variant="outlined" size='small' />
                                        <div className='mt-2 w-full flex justify-start items-center gap-3'>
                                            <FormLabel >rating:</FormLabel>

                                            <NumberInput className='w-16' value={updateRating} onChange={(valueAsString, valueAsNumber) => setUpdateRating(valueAsNumber)} min={0} max={5}>
                                                <NumberInputField />
                                                <NumberInputStepper>
                                                    <NumberIncrementStepper />
                                                    <NumberDecrementStepper />
                                                </NumberInputStepper>
                                            </NumberInput>
                                            <Button className='ml-auto' colorScheme="teal" variant="solid" onClick={updateHandler}>send</Button>
                                        </div>
                                    </PopoverBody>
                                </PopoverContent>
                            </Popover>
                            <Popover
                                returnFocusOnClose={false}
                                isOpen={isDeleteOpen}
                                onClose={onDeleteClose}
                                placement='right'
                                closeOnBlur={false}
                            >
                                <PopoverTrigger>
                                    <Button onClick={onDeleteToggle} variant='link'>delete</Button>
                                </PopoverTrigger>
                                <PopoverContent width="350px">
                                    <PopoverHeader fontWeight='semibold'>Confirmation</PopoverHeader>
                                    <PopoverArrow />
                                    <PopoverCloseButton />
                                    <PopoverBody>
                                        Are you sure you want to delete your review?
                                    </PopoverBody>
                                    <PopoverFooter display='flex' justifyContent='flex-end'>
                                        <ButtonGroup size='sm'>
                                            <Button variant='outline' onClick={onDeleteClose}>Cancel</Button>
                                            <Button colorScheme='red' onClick={deleteHandler}>Delete</Button>
                                        </ButtonGroup>
                                    </PopoverFooter>
                                </PopoverContent>
                            </Popover>
                        </>}
                        {/* Code modified based on the example at: https://chakra-ui.com/docs/components/popover/usage#controlled-usage */}
                        <Popover
                            returnFocusOnClose={false}
                            isOpen={isOpen}
                            onClose={onClose}
                            placement='right'
                            closeOnBlur={false}
                        >
                            <PopoverTrigger>
                                <Button onClick={onToggle} variant='link'>reply</Button>
                            </PopoverTrigger>
                            <PopoverContent width="450px">
                                <PopoverHeader fontWeight='semibold'>REPLY</PopoverHeader>
                                <PopoverArrow />
                                <PopoverCloseButton />
                                <PopoverBody>
                                    <TextField inputProps={{ maxLength: 100 }} value={replyContent} onChange={e => setReplyContent(e.target.value)} className='w-full' id="outlined-basic" label="input reviews" variant="outlined" size='small' />
                                    <div className='mt-2 w-full flex justify-start items-center gap-3'>
                                        <FormLabel >rating:</FormLabel>

                                        <NumberInput className='w-16' value={replyRateing} onChange={(valueAsString, valueAsNumber) => setReplyRating(valueAsNumber)} min={0} max={5}>
                                            <NumberInputField />
                                            <NumberInputStepper>
                                                <NumberIncrementStepper />
                                                <NumberDecrementStepper />
                                            </NumberInputStepper>
                                        </NumberInput>
                                        <Button className='ml-auto' colorScheme="teal" variant="solid" onClick={replyHandler}>send</Button>
                                    </div>
                                </PopoverBody>
                            </PopoverContent>
                        </Popover>

                    </div>

                </div>

            </div>
            <div className='pl-4'>
                {children && children.map((reply, index) => (
                    <MuiltilayerReview key={index} review={reply} sendReview={sendReview} />
                ))}
            </div>
        </>
    );
};