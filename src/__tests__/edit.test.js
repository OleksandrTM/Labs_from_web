import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import EditProfile from '../components/edit.jsx';
import '@testing-library/jest-dom';

jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(),
}));

describe('EditProfile component', () => {
    let originalFetch;

    beforeAll(() => {
        originalFetch = global.fetch;
    });

    afterAll(() => {
        global.fetch = originalFetch;
    });

    beforeEach(() => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve({}),
            })
        );
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('renders EditProfile form with initial values', async () => {
        const { getByLabelText } = render(<EditProfile />);
        await waitFor(() => {
            expect(getByLabelText('Ім\'я:')).toHaveValue('');
            expect(getByLabelText('Прізвище:')).toHaveValue('');
        });
    });

    test('updates form fields when input values change', async () => {
        const { getByLabelText } = render(<EditProfile />);
        const firstNameInput = getByLabelText('Ім\'я:');
        const lastNameInput = getByLabelText('Прізвище:');
        const passwordInput = getByLabelText('Пароль:');

        await act(async () => {
            fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
            fireEvent.change(lastNameInput, { target: { value: 'Smith' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
        });

        await waitFor(() => {
            expect(firstNameInput).toHaveValue('Jane');
            expect(lastNameInput).toHaveValue('Smith');
            expect(passwordInput).toHaveValue('password123');
        });
    });

    test('submits form with updated values and navigates on successful update', async () => {
        const mockNavigate = jest.fn();
        useNavigate.mockReturnValue(mockNavigate);

        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(),
            })
        );

        const { getByText, getByLabelText } = render(<EditProfile />);
        const saveButton = getByText('Зберегти зміни');
        const firstNameInput = getByLabelText('Ім\'я:');
        const lastNameInput = getByLabelText('Прізвище:');
        const passwordInput = getByLabelText('Пароль:');

        await act(async () => {
            fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
            fireEvent.change(lastNameInput, { target: { value: 'Smith' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            fireEvent.click(saveButton);
        });

        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:8080/api/user/null',
            expect.objectContaining({
                method: 'PUT',
                headers: expect.objectContaining({
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer undefined',
                }),
                body: JSON.stringify({
                    first_name: 'Jane',
                    last_name: 'Smith',
                    password: 'password123',
                }),
            })
        );

        expect(mockNavigate).toHaveBeenCalledWith('/general/profile/undefined');
    });

    test('displays an error message when update fails', async () => {
        jest.spyOn(global, 'fetch').mockResolvedValue({
            ok: false,
            status: 500,
            json: () => Promise.resolve({ message: 'Server error' }),
        });
        const { getByText, getByLabelText } = render(<EditProfile />);
        const saveButton = getByText('Зберегти зміни');
        const firstNameInput = getByLabelText('Ім\'я:');
        const lastNameInput = getByLabelText('Прізвище:');
        const passwordInput = getByLabelText('Пароль:');
        await act(async () => {
            fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
            fireEvent.change(lastNameInput, { target: { value: 'Smith' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            fireEvent.click(saveButton);
        });

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

    test('navigates to profile page when "Відмінити" button is clicked', () => {
        const mockNavigate = jest.fn();
        useNavigate.mockReturnValue(mockNavigate);

        const { getByText } = render(<EditProfile />);
        const cancelButton = getByText('Відмінити');

        fireEvent.click(cancelButton);

        expect(mockNavigate).toHaveBeenCalledWith('/general/profile/undefined');
    });
});
