import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, gql, useSubscription } from '@apollo/client';
import { ListGroup, ListGroupItem, Button, Spinner, Container } from 'react-bootstrap';

const GET_REVIEWS = gql`
  query GetReviews {
    reviews {
      id
      content
      user {
        username
      }
      product {
        name
      }
      isDeleted
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
        username
      }
      product {
        name
      }
      isDeleted
    }
  }
`;

const ReviewModeration = () => {
    const { data, loading, error } = useQuery(GET_REVIEWS);
    const [deleteReview] = useMutation(DELETE_REVIEW);
    const { data: subscriptionData } = useSubscription(REVIEW_SUBSCRIPTION);

    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        if (data) {
            setReviews(data.reviews);
        }
    }, [data]);

    useEffect(() => {
        if (subscriptionData) {
            setReviews((prevReviews) => [subscriptionData.reviewAdded, ...prevReviews]);
        }
    }, [subscriptionData]);

    if (loading) return <Spinner animation="border" />;
    if (error) return <p className="text-danger">Error: {error.message}</p>;

    const handleDelete = (id) => {
        deleteReview({ variables: { id } });
        setReviews(reviews.map((review) => (review.id === id ? { ...review, isDeleted: true } : review)));
    };

    return (
        <Container>
            <h2 className="mb-4">Review Moderation</h2>
            <ListGroup>
                {reviews.map((review) => (
                    <ListGroupItem key={review.id} className="d-flex justify-content-between align-items-center">
                        <span>
                            {review.isDeleted ? (
                                <em className="text-muted">[**** This review has been deleted by the admin ***]</em>
                            ) : (
                                <span>{review.content} - {review.user.username} - {review.product.name}</span>
                            )}
                        </span>
                        {!review.isDeleted && (
                            <Button variant="danger" onClick={() => handleDelete(review.id)}>Delete</Button>
                        )}
                    </ListGroupItem>
                ))}
            </ListGroup>
        </Container>
    );
};

export default ReviewModeration;
