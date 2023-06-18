import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import AddStudentForm from '../components/add_student.jsx';
import '@testing-library/jest-dom';

jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(),
}));

describe('AddStudentForm component', () => {
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
                    Promise.resolve([
                        { id_faculty: 1, name: 'Faculty 1', id_manager: 1 },
                        { id_faculty: 2, name: 'Faculty 2', id_manager: 2 },
                    ]),
            })
        );
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('renders AddStudentForm with initial values', async () => {
        const { getByLabelText } = render(<AddStudentForm />);
        await waitFor(() => {
            expect(getByLabelText("Ім'я:")).toHaveValue('');
            expect(getByLabelText('Прізвище:')).toHaveValue('');
            expect(getByLabelText('Факультет:')).toHaveValue('');
            expect(getByLabelText('Предмет:')).toHaveValue('');
            expect(getByLabelText('Оцінка:')).toHaveValue(null);
        });
    });

    test('updates form fields when input values change', async () => {
        const { getByLabelText } = render(<AddStudentForm />);
        const firstNameInput = getByLabelText("Ім'я:");
        const lastNameInput = getByLabelText('Прізвище:');

        await act(async () => {
            fireEvent.change(firstNameInput, { target: { value: 'John' } });
            fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
        });

        expect(firstNameInput).toHaveValue('John');
        expect(lastNameInput).toHaveValue('Doe');
    });

    test('fetches faculties and subjects on component mount', async () => {
        render(<AddStudentForm />);

        expect(global.fetch).toHaveBeenCalledTimes(2);
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/api/faculty/list');
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/api/estimate/list');
    });

    test('adds subject and rating when "Додати предмет" button is clicked', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve([
                        { id_estimate: 1, subject: 'Subject 1' },
                        { id_estimate: 2, subject: 'Subject 2' },
                    ]),
            })
        );

        const { getByText, getByLabelText } = render(<AddStudentForm />);
        const addSubjectButton = getByText('Додати предмет');
        const subjectInput = getByLabelText('Предмет:');
        const ratingInput = getByLabelText('Оцінка:');

        await act(async () => {
            fireEvent.change(subjectInput, { target: { value: 'Subject 1' } });
            fireEvent.change(ratingInput, { target: { value: '90' } });
            fireEvent.click(addSubjectButton);
        });

        const subjectItems = getByText(/Subject 1/);
        const ratingItems = getByLabelText('Оцінка:').value;

        expect(subjectItems).toBeInTheDocument();
        expect(ratingItems).toBe('90');
        expect(subjectInput).toHaveValue('');
        expect(ratingInput).toHaveValue(90);
    });
});
