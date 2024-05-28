import React from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const handleToggleBlock = (id) => {
        toggleBlockUser({ variables: { id } });
    };

    return (
        <div>
            <h2>User Management</h2>
            <ul>
                {data.users.map((user) => (
                    <li key={user.id}>
                        {user.username} - {user.isBlocked ? 'Blocked' : 'Active'}
                        <button onClick={() => handleToggleBlock(user.id)}>
                            {user.isBlocked ? 'Unblock' : 'Block'}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserManagement;
