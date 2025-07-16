import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function PrivateRoute() {
    const accessToken = sessionStorage.getItem('accessToken');
    const deviceId = sessionStorage.getItem('deviceId');

    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const verifyUserAuthentication = async () => {
            try {
                const response = await axios.get(`${serverUrl}`, {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Device-Id': deviceId
                    }
                });

                if (response.status === 200 && response.data) {
                    setIsAuthenticated(true);
                } else {
                    sessionStorage.clear();
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Authentication Failed:', error);
                sessionStorage.clear();
                setIsAuthenticated(false);
            }
        };

        verifyUserAuthentication();
    }, []);

    if (isAuthenticated === null) return <div>Loading...</div>;

    return isAuthenticated ? <Outlet /> : <Navigate to="/login?expired=true" />;
}
