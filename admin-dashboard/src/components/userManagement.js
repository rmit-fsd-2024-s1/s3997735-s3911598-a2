import React from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { ListGroup, ListGroupItem, Button, Spinner, Container, Row, Col } from 'react-bootstrap';

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      email 
      isBlocked
    }
  }
`;

const TOGGLE_BLOCK_USER = gql`
  mutation ToggleBlockUser($id: ID!) {
    toggleBlockUser(id: $id) {
      id
      isBlocked
    }
  }
`;

const UserManagement = () => {
    const { data, loading, error } = useQuery(GET_USERS);
    const [toggleBlockUser] = useMutation(TOGGLE_BLOCK_USER);

    if (loading) return <Spinner animation="border" />;
    if (error) return <p className="text-danger">Error: {error.message}</p>;

    const handleToggleBlock = (id) => {
        console.log("Toggling block for user with ID:", id);
        toggleBlockUser({ variables: { id } })
            .then(response => {
                console.log("Toggle response:", response);
            })
            .catch(err => {
                console.error("Error toggling block:", err);
            });
    };

    return (
        <Container>
            <h2 className="mb-4">User Management</h2>
            <ListGroup>
                {data.users.map((user) => (
                    <ListGroupItem key={user.id} className="d-flex justify-content-between align-items-center">
                        <span>{user.email} - {user.isBlocked ? 'Blocked' : 'Active'}</span>
                        <Button variant={user.isBlocked ? 'success' : 'danger'} onClick={() => handleToggleBlock(user.id)}>
                            {user.isBlocked ? 'Unblock' : 'Block'}
                        </Button>
                    </ListGroupItem>
                ))}
            </ListGroup>
        </Container>
    );
};

export default UserManagement;
