import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import StudentRatingTable from '../components/lr_rating_table.jsx';
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
                <StudentRatingTable />
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
                <StudentRatingTable />
            </MemoryRouter>
        );

        const studentLinks = await screen.findAllByRole('link');
        const ratingCells = screen.getAllByRole('cell');

        expect(studentLinks[0]).toHaveTextContent('Doe John');
        expect(studentLinks[1]).toHaveTextContent('Smith Jane');
        expect(ratingCells[2]).toHaveTextContent('4.50');
        expect(ratingCells[5]).toHaveTextContent('3.80');
    });
});
