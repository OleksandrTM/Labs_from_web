import UserTable from '../components/user_table.jsx';
import '@testing-library/jest-dom';
import React, { useState, useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useEffect: jest.fn(),
    useState: jest.fn(),
}));

const mockUsers = [
    { id: 1, first_name: 'John', last_name: 'Doe', role: 'Roles.admin', email: 'john@example.com' },
    { id: 2, first_name: 'Jane', last_name: 'Smith', role: 'Roles.manager', email: 'jane@example.com' },
];

describe('UserTable', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('fetches and displays the list of users', async () => {
        useState.mockReturnValueOnce([mockUsers, jest.fn()]);

        render(<UserTable />);

        expect(screen.getByText('Список користувачів')).toBeInTheDocument();

        await act(async () => {
            await Promise.resolve();
        });

        expect(screen.getByText('Doe John')).toBeInTheDocument();
        expect(screen.getByText('Адміністратор')).toBeInTheDocument();
        expect(screen.getByText('john@example.com')).toBeInTheDocument();

        expect(screen.getByText('Smith Jane')).toBeInTheDocument();
        expect(screen.getByText('Менеджер')).toBeInTheDocument();
        expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    });
});
