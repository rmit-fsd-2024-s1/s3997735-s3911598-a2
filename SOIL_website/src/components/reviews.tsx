
import { Button, ButtonGroup, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, useDisclosure } from '@chakra-ui/react';
import TextField from '@mui/material/TextField';
import StarRatings from 'react-star-ratings';

const commentsData: ReviewProps[] = [
    {
        author: 'User 1',
        content: 'This is a top-level comment.',
        replies: [
            {
                author: 'User 2',
                content: 'This is a reply to the top-level comment.',
                replies: [
                    {
                        author: 'User 1',
                        content: 'This is a reply to the reply.',
                        replies: []
                    }
                ]
            },
            {
                author: 'User 2',
                content: 'This is a reply to the top-level comment.',
                replies: []
            }
        ]
    },
    {
        author: 'User 3',
        content: 'Another top-level comment.',
        replies: []
    }
];
interface Reply {
    author: string;
    content: string;
    replies: Reply[];
}

interface ReviewProps {
    author: string;
    content: string;
    replies: Reply[];
}

export default function Comment() {
    return (
        <>
            <div className='p-4'>
                <div className='text-left'>comments: </div>
                <hr />
                <br />
                <div className=' p-4 flex justify-center items-center gap-3'>
                    <p>username</p>
                    <TextField className='grow' id="outlined-basic" label="input comments" variant="outlined" size='small' />
                    <Button colorScheme="teal" variant="solid">send</Button>
                </div>
                <div className='p-4'>
                    {commentsData.map((comment, index) => (
                        <MuiltilayerReview key={index} {...comment} />
                    ))}
                </div>
            </div>
        </>);
}

const MuiltilayerReview = ({ author, content, replies }: ReviewProps) => {
    const { isOpen, onToggle, onClose } = useDisclosure()
    return (
        <>
            <div className='flex justify-center items-start w-full gap-3'>
                <div className='grow-0'>
                    {author}:
                </div>
                <div className='grow text-left  break-words whitespace-normal'>
                    <p>{content}</p>
                    <div className='flex gap-2'>
                        <StarRatings
                            rating={2.403}
                            starDimension="10px"
                            starSpacing="3px"
                        />
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
                            <PopoverContent>
                                <PopoverHeader fontWeight='semibold'>REPLY</PopoverHeader>
                                <PopoverArrow />
                                <PopoverCloseButton />
                                <PopoverBody>
                                    <div className='flex justify-center items-center gap-3'>
                                        <TextField className='grow' id="outlined-basic" label="input reviews" variant="outlined" size='small' />
                                        <Button colorScheme="teal" variant="solid" onClick={onClose}>send</Button>
                                    </div>
                                </PopoverBody>
                            </PopoverContent>
                        </Popover>

                    </div>
                    <div className='pl-0'>
                        {replies && replies.map((reply, index) => (
                            <MuiltilayerReview key={index} author={reply.author} content={reply.content} replies={reply.replies} />
                        ))}
                    </div>
                </div>

            </div>
        </>
    );
};