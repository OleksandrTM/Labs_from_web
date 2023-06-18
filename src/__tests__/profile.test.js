import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProfileInfo from '../components/profile.jsx';
import '@testing-library/jest-dom';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

describe('ProfileInfo', () => {
    afterEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    test('displays profile information correctly', async () => {
        const profileData = {
            first_name: 'John',
            last_name: 'Doe',
            email: 'johndoe@example.com',
            role: 'Roles.admin',
        };

        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce(profileData),
        });

        render(
            <BrowserRouter>
                <ProfileInfo />
            </BrowserRouter>
        );

        expect(screen.queryByText('John Doe')).toBeNull(); // Profile data should not be displayed initially

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('Електронна пошта: johndoe@example.com')).toBeInTheDocument();
            expect(screen.getByText('Роль: Адміністратор')).toBeInTheDocument();
        });
    });

    test('navigates to the edit profile page when the "Редагувати профіль" button is clicked', async () => {
        const mockNavigate = jest.fn();
        jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);

        const profileData = {
            first_name: 'John',
            last_name: 'Doe',
            email: 'johndoe@example.com',
            role: 'Roles.admin',
        };

        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce(profileData),
        });

        render(
            <BrowserRouter>
                <ProfileInfo />
            </BrowserRouter>
        );

        localStorage.setItem('userId', '1');
        localStorage.setItem('accessToken', '12345');

        await waitFor(() => {
            fireEvent.click(screen.getByText('Редагувати профіль'));
        });

        expect(mockNavigate).toHaveBeenCalledWith('/general/profile/edit/1');
    });

    test('deletes the profile and navigates to the home page when the "Видалити профіль" button is clicked', async () => {
        const mockNavigate = jest.fn();
        jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);

        const profileData = {
            first_name: 'John',
            last_name: 'Doe',
            email: 'johndoe@example.com',
            role: 'Roles.admin',
        };

        global.fetch = jest.fn()
            .mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValueOnce(profileData),
            })
            .mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValueOnce(mockNavigate),
            });

        render(
            <BrowserRouter>
                <ProfileInfo />
            </BrowserRouter>
        );

        localStorage.setItem('userId', '1');
        localStorage.setItem('accessToken', '12345');

        await waitFor(() => {
            const deleteButton = screen.getByRole('button', { name: 'Видалити профіль' })
            fireEvent.click(deleteButton);
        });
        
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/');
            expect(localStorage.getItem('userId')).toBeNull();
            expect(localStorage.getItem('accessToken')).toBeNull();
        });
    });
});
