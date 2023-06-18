import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RatingTable from '../components/rating_table.jsx';
import '@testing-library/jest-dom';

describe('StudentRatingTable', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders the student rating table correctly', async () => {
        const mockRatingData = [
            [
                { id_student: 1, last_name: 'Doe', first_name: 'John' },
                { id_student: 2, last_name: 'Smith', first_name: 'Jane' },
            ],
            [
                { avg: 4.5 },
                { avg: 3.8 },
            ],
        ];

        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockRatingData),
            })
        );

        render(
            <MemoryRouter>
                <RatingTable />
            </MemoryRouter>
        );

        const ratingTable = await screen.findByRole('table');

        expect(ratingTable).toBeInTheDocument();
    });

    test('displays the student names and ratings correctly', async () => {
        const mockRatingData = [
            [
                { id_student: 1, last_name: 'Doe', first_name: 'John' },
                { id_student: 2, last_name: 'Smith', first_name: 'Jane' },
            ],
            [
                { avg: 4.5 },
                { avg: 3.8 },
            ],
        ];

        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockRatingData),
            })
        );

        render(
            <MemoryRouter>
                <RatingTable />
            </MemoryRouter>
        );

        await screen.findByText('Doe John');
        await screen.findByText('Smith Jane');
        await screen.findByText('4.50');
        await screen.findByText('3.80');

        expect(screen.getByText('Doe John')).toBeInTheDocument();
        expect(screen.getByText('Smith Jane')).toBeInTheDocument();
        expect(screen.getByText('4.50')).toBeInTheDocument();
        expect(screen.getByText('3.80')).toBeInTheDocument();
    });
});
