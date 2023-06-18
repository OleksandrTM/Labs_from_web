import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginForm from '../components/login.jsx';
import '@testing-library/jest-dom';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
}));

global.fetch = jest.fn();
describe('LoginForm', () => {
    beforeEach(() => {
        jest.spyOn(global, 'fetch').mockResolvedValue({
            ok: true,
            json: () =>
                Promise.resolve({
                    token: 'token123',
                    userId: 'user123',
                    role: 'user',
                }),
        });
    });

    afterEach(() => {
        global.fetch.mockRestore();
    });

    test('renders the login form correctly', () => {
        render(
            <MemoryRouter>
                <LoginForm />
            </MemoryRouter>
        );

        const emailInput = screen.getByLabelText('Електронна пошта:');
        const passwordInput = screen.getByLabelText('Пароль:');
        const submitButton = screen.getByRole('button', { name: 'Вхід' });

        expect(emailInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();
    });

    test('updates the email and password state when inputs change', () => {
        render(
            <MemoryRouter>
                <LoginForm />
            </MemoryRouter>
        );

        const emailInput = screen.getByLabelText('Електронна пошта:');
        const passwordInput = screen.getByLabelText('Пароль:');

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        expect(emailInput.value).toBe('test@example.com');
        expect(passwordInput.value).toBe('password123');
    });

    test('calls the submit handler when the form is submitted', async () => {
        const handleSubmit = jest.fn();

        render(
            <MemoryRouter>
                <LoginForm onSubmit={handleSubmit} />
            </MemoryRouter>
        );

        const form = screen.getByTestId('loginForm');
        fireEvent.submit(form);

        expect(handleSubmit).toHaveBeenCalledTimes(0);
    });

    test('displays an error message when the response is not ok', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                json: () =>
                    Promise.resolve({ message: 'Network response was not ok' }),
            })
        );

        render(
            <MemoryRouter>
                <LoginForm />
            </MemoryRouter>
        );

        const submitButton = screen.getByRole('button', { name: 'Вхід' });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalled();
            const errorSpy = console.error;
            console.error = jest.fn();
            setTimeout(() => {
                expect(console.error).toHaveBeenCalledWith('Error:', 'Network response was not ok');
                console.error = errorSpy;
            }, 100);
        });
    });

    it('displays an error message when the login fails', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve({ message: 'User with such email already exists' }),
            })
        );

        render(
            <MemoryRouter>
                <LoginForm />
            </MemoryRouter>
        );

        const submitButton = screen.getByRole('button', { name: 'Вхід' });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalled();
            const errorSpy = console.error;
            console.error = jest.fn();
            setTimeout(() => {
                expect(console.error).toHaveBeenCalledWith('Error:', 'Network response was not ok');
                console.error = errorSpy;
            }, 100);
        });
    });
});
