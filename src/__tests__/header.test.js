import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route, matchPath } from 'react-router-dom';
import Header from '../components/header.jsx';
import '@testing-library/jest-dom';

describe('Header', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders the header with the correct title', () => {
        render(
            <MemoryRouter>
                <Header title="Test Title" />
            </MemoryRouter>
        );

        const headerTitle = screen.getByText('Test Title');
        expect(headerTitle).toBeInTheDocument();
    });

    test('renders the navigation links correctly when on the home page', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <Header title="Test Title" />
            </MemoryRouter>
        );

        const loginLink = screen.getByText('Вхід');
        const ratingLink = screen.getByText('Рейтинг');
        const aboutUsLink = screen.getByText('Про нас');
        expect(loginLink).toBeInTheDocument();
        expect(ratingLink).toBeInTheDocument();
        expect(aboutUsLink).toBeInTheDocument();
    });

    test('renders the navigation links correctly when on the general page', () => {
        render(
            <MemoryRouter initialEntries={['/general']}>
                <Header title="Test Title" />
            </MemoryRouter>
        );

        const logoutLink = screen.getByText('Вихід');
        const ratingLink = screen.getByText('Рейтинг');
        const aboutUsLink = screen.getByText('Про нас');
        const profileLink = screen.getByText('Профіль');
        expect(logoutLink).toBeInTheDocument();
        expect(ratingLink).toBeInTheDocument();
        expect(aboutUsLink).toBeInTheDocument();
        expect(profileLink).toBeInTheDocument();
    });

    test('renders the navigation links correctly when on the profile page', () => {
        const userId = 1;
        localStorage.userId = userId;
        render(
            <MemoryRouter initialEntries={[`/general/profile/${localStorage.userId}`]}>
                <Header title="Test Title" />
            </MemoryRouter>
        );

        const homeLink = screen.getByText('Головна');
        const logoutLink = screen.getByText('Вихід');
        expect(homeLink).toBeInTheDocument();
        expect(logoutLink).toBeInTheDocument();
        localStorage.clear();
    });

    test('renders the navigation links correctly when on the edit profile page', () => {
        const userId = 1;
        localStorage.userId = userId;
        render(
            <MemoryRouter initialEntries={[`/general/profile/edit/${localStorage.userId}`]}>
                <Header title="Test Title" />
            </MemoryRouter>
        );

        const homeLink = screen.getByText('Головна');
        const profileLink = screen.getByText('Профіль');
        expect(homeLink).toBeInTheDocument();
        expect(profileLink).toBeInTheDocument();
        localStorage.clear();
    });
});
