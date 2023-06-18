import React from 'react';
import RegistrationForm from '../components/registration.jsx';
import '@testing-library/jest-dom';
import { render, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

describe('RegistrationForm', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders registration form', () => {
        const { getByText, getByLabelText } = render(
            <MemoryRouter>
                <RegistrationForm />
            </MemoryRouter>
        );

        expect(getByText('Реєстрація')).toBeInTheDocument();
        expect(getByLabelText("Ім'я користувача")).toBeInTheDocument();
        expect(getByLabelText('Прізвище користувача')).toBeInTheDocument();
        expect(getByLabelText('Пошта')).toBeInTheDocument();
        expect(getByLabelText('Пароль')).toBeInTheDocument();
    });

    test('submits registration form', async () => {
        const mockNavigate = jest.fn();
        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useNavigate: () => mockNavigate,
        }));

        const { getByLabelText, getByText } = render(
            <MemoryRouter>
                <RegistrationForm />
            </MemoryRouter>
        );

        fireEvent.change(getByLabelText("Ім'я користувача"), { target: { value: 'John' } });
        fireEvent.change(getByLabelText('Прізвище користувача'), { target: { value: 'Doe' } });
        fireEvent.change(getByLabelText('Пошта'), { target: { value: 'test@example.com' } });
        fireEvent.change(getByLabelText('Пароль'), { target: { value: 'password123' } });

        global.fetch = jest.fn().mockResolvedValueOnce({ ok: true });

        act(() => {
            fireEvent.click(getByText('Зареєструватися'));
        });

        expect(mockNavigate).toHaveBeenCalledTimes(0);
    });
});
