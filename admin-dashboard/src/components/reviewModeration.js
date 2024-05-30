import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, gql, useSubscription } from '@apollo/client';
import { ListGroup, ListGroupItem, Button, Spinner, Container, Row, Col } from 'react-bootstrap';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);


const GET_REVIEWS = gql`
query Reviews {
    reviews {
        id
        content
        isDeleted
        flagged
        user {
            id
            email
            isBlocked
        }
        product {
            id
            name
            description
            price
            category
            originalPrice
            imageUrl
            validFrom
            validTo
        }
    }
}

`;

const DELETE_REVIEW = gql`
  mutation DeleteReview($id: ID!) {
    deleteReview(id: $id) {
      id
      isDeleted
    }
  }
`;

const REVIEW_SUBSCRIPTION = gql`
  subscription OnReviewAdded {
    reviewAdded {
      id
      content
      user {
        first_name
      }
      product {
        name
      }
      isDeleted
      flagged
    }
  }
`;

const FLAGGED_REVIEW_SUBSCRIPTION = gql`
  subscription OnReviewFlagged {
    reviewFlagged {
      id
      content
      user {
        first_name
      }
      product {
        name
      }
      isDeleted
      flagged
    }
  }
`;

const ReviewModeration = () => {
    const { data, loading, error, refetch } = useQuery(GET_REVIEWS);
    const [deleteReview] = useMutation(DELETE_REVIEW);
    const { data: subscriptionData } = useSubscription(REVIEW_SUBSCRIPTION);
    const { data: flaggedSubscriptionData } = useSubscription(FLAGGED_REVIEW_SUBSCRIPTION);

    const [reviews, setReviews] = useState([]);

    // update state when data changes
    useEffect(() => {
        if (data) {
            setReviews(data.reviews);
        }
    }, [data]);

    // Update state when new reviews are added
    useEffect(() => {
        if (subscriptionData) {
            setReviews((prevReviews) => [subscriptionData.reviewAdded, ...prevReviews].slice(0, 3));
        }
    }, [subscriptionData]);
    
    // Update state when reviews are flagged
    useEffect(() => {
        if (flaggedSubscriptionData) {
            setReviews((prevReviews) => {
                const newReview = flaggedSubscriptionData.reviewFlagged;
                const index = prevReviews.findIndex(review => review.id === newReview.id);
                if (index !== -1) {
                    prevReviews[index] = newReview;
                    return [...prevReviews];
                }
                return [newReview, ...prevReviews];
            });
        }
    }, [flaggedSubscriptionData]);
    

    if (loading) return <Spinner animation="border" />;
    if (error) return <p className="text-danger">Error: {error.message}</p>;

    // Handle review deletion
    const handleDelete = async (id) => {
        await deleteReview({ variables: { id } });
        
    };

    // Get the most recent 2 to 3 reviews
    const recentReviews = reviews.slice(0, 3);
    const flaggedReviews = reviews.filter(review => review.flagged && !review.isDeleted);

    // Calculate review statistics
    const reviewStats = reviews.reduce((acc, review) => {
        const product = review.product.name;
        if (!acc[product]) {
            acc[product] = 1;
        } else {
            acc[product]++;
        }
        return acc;
    }, {});

    const reviewStatsData = {
        labels: Object.keys(reviewStats),
        datasets: [
            {
                label: 'Number of Reviews',
                data: Object.values(reviewStats),
                backgroundColor: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'],
                borderColor: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'],
                borderWidth: 1,
            },
        ],
    };

    const reviewLengthData = {
        labels: ['Short', 'Medium', 'Long'],
        datasets: [
            {
                label: 'Review Lengths',
                data: [
                    reviews.filter((review) => review.content.length < 50).length,
                    reviews.filter((review) => review.content.length >= 50 && review.content.length < 200).length,
                    reviews.filter((review) => review.content.length >= 200).length,
                ],
                backgroundColor: ['rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)'],
            },
        ],
    };

    return (
        <Container>
            <h2 className="mb-4">Review Moderation</h2>
            <Button onClick={() => refetch()}>Refresh Reviews</Button>
            <Row>
                <Col md={6}>
                    <h3>New Reviews</h3>
                    <ListGroup>
                        {recentReviews.map((review) => (
                            <ListGroupItem key={review.id} className="d-flex justify-content-between align-items-center">
                                <span>{review.isDeleted ? '[**** This review has been deleted by the admin ***]' : `${review.content} - ${review.user.username} - ${review.product.name}`}</span>
                                {!review.isDeleted && <Button variant="danger" onClick={() => handleDelete(review.id)}>Delete</Button>}
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                    <h3 className="mt-4">Flagged Reviews</h3>
                    <ListGroup>
                        {flaggedReviews.map((review) => (
                            <ListGroupItem key={review.id} className="d-flex justify-content-between align-items-center">
                                <span>{`${review.content} - ${review.user.username} - ${review.product.name}`}</span>
                                {!review.isDeleted && <Button variant="danger" onClick={() => handleDelete(review.id)}>Delete</Button>}
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                </Col>
                <Col md={6}>
                    <h3>Review Statistics</h3>
                    <Bar data={reviewStatsData} options={{ responsive: true }} />
                    <Pie data={reviewStatsData} options={{ responsive: true }} />
                </Col>
            </Row>
        </Container>
    );
};

export default ReviewModeration;
