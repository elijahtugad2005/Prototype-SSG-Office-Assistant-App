// components/ProtectedRoute.jsx
// PURPOSE: Wrapper component that protects routes based on authentication and role
// USAGE: Wrap any component that requires authentication
// FEATURES:
//   - Blocks unauthenticated users (redirects to login)
//   - Blocks users without required role (shows access denied)
//   - Remembers intended destination for post-login redirect

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext/AuthContext.jsx'

function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, userRole } = useAuth();
  const location = useLocation();

  // ========================================
  // CHECK 1: Is user logged in?
  // If not, redirect to login page
  // ========================================
  if (!currentUser) {
    // Save the page they tried to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ========================================
  // CHECK 2: Does user have required role?
  // If allowedRoles is specified and user doesn't have it, show access denied
  // ========================================
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return (
      <div style={styles.accessDenied}>
        <h1 style={styles.deniedTitle}>🚫 Access Denied</h1>
        <p style={styles.deniedText}>
          You don't have permission to access this page.
        </p>
        <p style={styles.deniedRole}>
          Your role: <strong>{userRole}</strong>
        </p>
        <button 
          onClick={() => window.history.back()}
          style={styles.backButton}
        >
          ← Go Back
        </button>
      </div>
    );
  }

  // User is authenticated and has correct role
  return children;
}

// Inline styles for access denied page
const styles = {
  accessDenied: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4c1515',
    padding: '2rem',
    textAlign: 'center',
  },
  deniedTitle: {
    fontSize: '3rem',
    color: '#fe5c03',
    marginBottom: '1rem',
  },
  deniedText: {
    fontSize: '1.2rem',
    color: '#f1f1f1',
    marginBottom: '0.5rem',
  },
  deniedRole: {
    fontSize: '1rem',
    color: '#c0c0c0',
    marginBottom: '2rem',
  },
  backButton: {
    padding: '1rem 2rem',
    backgroundColor: '#fe5c03',
    color: '#000',
    border: 'none',
    borderRadius: '50px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};

export default ProtectedRoute;