import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Route, useLocation, Routes } from 'react-router-dom';
import PrivateRoute from '../components/private_route.jsx';
import '@testing-library/jest-dom';

const TestComponent = () => {
    const location = useLocation();

    return (
        <div data-testid="pathname">
            <span>{location.pathname}</span>
        </div>
    );
};

describe('PrivateRoute', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders children when user is authenticated', () => {
        localStorage.setItem('accessToken', 'testToken');
        const { getByText } = render(
            <BrowserRouter>
                <PrivateRoute>
                    <div>Test Children</div>
                </PrivateRoute>
            </BrowserRouter>
        );

        const childrenElement = getByText('Test Children');
        expect(childrenElement).toBeInTheDocument();
    });

    test('redirects to login page when user is not authenticated', () => {
        localStorage.accessToken = 1;
        localStorage.tokenTimestamp = 1;
        render(
            <MemoryRouter initialEntries={['/private']}>
                <Routes>
                    <Route path="/private" element={<PrivateRoute><TestComponent /></PrivateRoute>}></Route>
                </Routes>
            </MemoryRouter>
        );

        const pathElement = screen.queryByText('/private');
        expect(pathElement).not.toBeInTheDocument();
        localStorage.clear();
    });
});

