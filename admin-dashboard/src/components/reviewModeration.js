import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, gql, useSubscription } from '@apollo/client';

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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const handleDelete = (id) => {
        deleteReview({ variables: { id } });
        setReviews(reviews.map((review) => (review.id === id ? { ...review, isDeleted: true } : review)));
    };

    return (
        <div>
            <h2>Review Moderation</h2>
            <ul>
                {reviews.map((review) => (
                    <li key={review.id}>
                        {review.isDeleted ? (
                            <p>[**** This review has been deleted by the admin ***]</p>
                        ) : (
                            <p>{review.content} - {review.user.username} - {review.product.name}</p>
                        )}
                        <button onClick={() => handleDelete(review.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ReviewModeration;
