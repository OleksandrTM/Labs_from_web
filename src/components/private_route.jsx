import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    let isAuthenticated = !!localStorage.accessToken;
    const currentTime = Date.now();
    const tokenExpirationTime = 60 * 60 * 1000;

    if (isAuthenticated) {
        const timeDifference = currentTime - localStorage.tokenTimestamp;

        if (timeDifference >= tokenExpirationTime) {
            localStorage.clear();
            isAuthenticated = false;
        }
    }

    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;
