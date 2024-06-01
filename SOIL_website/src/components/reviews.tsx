
import { Button, ButtonGroup, FormLabel, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, useDisclosure, useToast } from '@chakra-ui/react';
import TextField from '@mui/material/TextField';
import StarRatings from 'react-star-ratings';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { User, getCurrentUser } from '../data/repository';
import { comment } from 'postcss';
import { useNavigate } from 'react-router-dom';
import MuiltilayerReview from './muiltilayerReview';

interface Reply {
    id: string;
    userId: string;
    author: string;
    rating: number;
    content: string;
    createdAt: string;
    children: Reply[];
}

interface Review {
    id: string;
    userId: string;
    author: string;
    rating: number;
    content: string;
    createdAt: string;
    children: Reply[];
}

interface ReviewProps {
    follows: string[];
    review: Review;
    sendReview: (parent_id: string | null, rating: number, content: string) => void;
}

interface CommentProps {
    product_id: string;
}
export type { Review, Reply, CommentProps , ReviewProps};

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
    let follows: string[] = [];
    const checkFollow = async () => {
        try {
            const result = await axios.post("http://localhost:4000/api/follows/", {
                user_id: user?.id
            });
            if (result.status !== 200) {
                toast({
                    title: 'Check follow failed',
                    status: 'error',
                    duration: 2000,
                });
                return;
            }
            follows = result.data;
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }
    useEffect(() => {
        getReviews(product_id);
        checkFollow();
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
        if (words <= 100 || event.target.value.length <= 100) {
            setWords(words);
            setContent(event.target.value);
        } else {
            toast({
                title: 'Words limited to 100',
                status: 'error',
                duration: 2000,
            });
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
                        <MuiltilayerReview key={index} follows={follows} review={comment} sendReview={sendReview} />
                    ))}
                </div>
            </div>
        </>);
}
