import React from 'react';
import UserManagement from './components/userManagement';
import ProductManagement from './components/productManagement';
import ReviewModeration from './components/reviewModeration';

const App = () => {
  return (
      <div>
        <h1>Admin Dashboard</h1>
        <UserManagement />
        <ProductManagement />
        <ReviewModeration />
      </div>
  );
};

export default App;
