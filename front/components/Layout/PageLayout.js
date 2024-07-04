import ProtectedRoute from '@/context/Auth/ProtectedRoute';
import React from 'react';
import Header from '../Header/Header';

const PageLayout = ({ children }) => {
  return (
    <ProtectedRoute>
      <Header />
      {children}
    </ProtectedRoute>
  );
};

export default PageLayout;
