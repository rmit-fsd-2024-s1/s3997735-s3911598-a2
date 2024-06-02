import React, {useEffect, useState} from 'react';
import client from "../apollo/client.js";
import gql from "graphql-tag";
import {getReview, deleteReview} from "../data/repository";
// import { useQuery, useMutation, gql, useSubscription } from '@apollo/client';
import {ListGroup, ListGroupItem, Button, Spinner, Container, Row, Col, Alert} from 'react-bootstrap';
import {Bar, Pie} from 'react-chartjs-2';
import {Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement} from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// GraphQL queries, mutations, and subscriptions


const REVIEW_SUBSCRIPTION = gql`
  subscription OnReviewAdded {
    reviewAdded {
      id
      content
      user {
        email
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
        email
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

    const [reviews, setReviews] = useState([]);
    const [reviewsFlag, setFlagReviews] = useState([]);
    // Load initial reviews data
    useEffect(() => {
        async function loadReviews() {
            const currentComments = await getReview();

            setReviews(currentComments.slice(0, 3));
        }

        loadReviews();
    }, []);


    // Setup subscription.
    useEffect(() => {
        // Subscripe to the GraphQL comment_added subscription.
        const subscription = client.subscribe({
            query: gql`
       subscription OnReviewAdded {
    reviewAdded {
      id
      content
      user {
        email
      }
      product {
        name
      }
     
      flagged
    }
  }`
        }).subscribe({
            next: (payload) => {
                console.log(payload.data);
                const newReview = payload.data.reviewAdded;

                setReviews(prevReviews => {
                    const review = [newReview, ...prevReviews];
                    return review.slice(0, 3);
                });


            },
            error: (error) => {


            }
        });

        // Unsubscripe from the subscription when the effect unmounts.
        return () => {
            subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        const flaggedSubscription = client.subscribe({
            query: gql`
  subscription OnReviewFlagged {
    reviewFlagged {
      id
      content
      user {
        email
      }
      product {
        name
      }
    
      flagged
    }
  }
`
        }).subscribe({
            next: (payload) => {
                // console.log(payload.data);
                const flaggedReview = payload.data.reviewFlagged;
                console.log(flaggedReview);
                setFlagReviews(prevFlagReviews => [flaggedReview, ...prevFlagReviews]);
            },
            error: (error) => {
                console.error("Subscription error:", error);
            }
        });

        return () => {
            flaggedSubscription.unsubscribe();
        };
    }, []);
    // Handle review deletion
    const handleDelete = async (id) => {
        try {
            await deleteReview(id);
            setFlagReviews(prevFlagReviews => prevFlagReviews.filter(review => review.id !== id));
        } catch (error) {
            console.error("Error deleting review:", error);
        }
    };

    // // Extract recent reviews and flagged reviews
    // const recentReviews = reviews.slice(0, 3);


    // Generate review statistics data
    const reviewStats = reviews.reduce((acc, review) => {
        const product = review.product.name;
        if (!acc[product]) {
            acc[product] = 1;
        } else {
            acc[product]++;
        }
        return acc;
    }, {});

    // Data for review statistics chart
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

    // Data for review length chart
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
            <Row>
                <Col md={6}>
                    <h3>New Reviews</h3>
                    <ListGroup>
                        {reviews.length > 0 ? reviews.map((review) => (
                            <ListGroupItem key={review.id} className="d-flex justify-content-between align-items-center">
                                <span>{review.isDeleted ? '[**** This review has been deleted by you ***]' : `${review.content} - ${review.user?.email} - ${review.product?.name}`}</span>
                                {/*{!review.isDeleted && <Button variant="danger" onClick={() => handleDelete(review.id)}>Delete</Button>}*/}
                            </ListGroupItem>
                        )) : <p>No new reviews</p>}
                    </ListGroup>
                    <h3>Flagged Reviews</h3>
                    <ListGroup>
                        {reviewsFlag.length > 0 ? reviewsFlag.map((review) => (
                            <ListGroupItem key={review.id} className="d-flex justify-content-between align-items-center">
                                <span>{`${review.content} - ${review.user?.email} - ${review.product?.name}`}</span>
                                {!review.isDeleted && <Button variant="danger" onClick={() => handleDelete(review.id)}>Delete</Button>}
                            </ListGroupItem>
                        )) : <p>No flagged reviews</p>}
                    </ListGroup>
                </Col>
                <Col md={6}>
                    <h3>Review Statistics</h3>
                    <Bar data={reviewStatsData} options={{ responsive: true }} />
                    <Pie data={reviewLengthData} options={{ responsive: true }} />
                </Col>
            </Row>
        </Container>
    );
};

export default ReviewModeration;
