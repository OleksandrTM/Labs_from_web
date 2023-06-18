import React from 'react';
import { render, waitFor, act } from '@testing-library/react';
import StudentDataLoader from '../components/get_student_data.jsx';
import '@testing-library/jest-dom';

describe('StudentDataLoader component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('fetches student data and calls onDataLoaded with the correct data', async () => {
        const studentId = 1;
        const studentData = {
            id: studentId,
            name: 'John Doe',
            id_faculty: 1,
        };
        const facultyData = {
            id_faculty: 1,
            name: 'Faculty 1',
            id_university: 1,
        };
        const universityData = {
            id_university: 1,
            name: 'University 1',
        };

        global.fetch = jest.fn().mockImplementation((url) => {
            if (url.endsWith(`/api/student/${studentId}`)) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(studentData),
                });
            }
            if (url.endsWith(`/api/faculty/${facultyData.id_faculty}`)) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(facultyData),
                });
            }
            if (url.endsWith(`/api/university/${universityData.id_university}`)) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(universityData),
                });
            }
            return Promise.resolve({ ok: false });
        });

        const onDataLoaded = jest.fn();
        render(<StudentDataLoader id={studentId} onDataLoaded={onDataLoaded} />);

        await act(async () => {
            await waitFor(() => {
                expect(global.fetch).toHaveBeenCalledTimes(3);
                expect(global.fetch).toHaveBeenCalledWith(`http://localhost:8080/api/student/${studentId}`);
                expect(global.fetch).toHaveBeenCalledWith(`http://localhost:8080/api/faculty/${facultyData.id_faculty}`);
                expect(global.fetch).toHaveBeenCalledWith(`http://localhost:8080/api/university/${universityData.id_university}`);
            });
        });

        await act(async () => { });

        expect(onDataLoaded).toHaveBeenCalledTimes(1);
        expect(onDataLoaded).toHaveBeenCalledWith(studentData, universityData, facultyData);
    });

    test('handles network errors and logs the error', async () => {
        const studentId = 1;

        global.fetch = jest.fn().mockResolvedValue({ ok: false });

        const consoleErrorSpy = jest.spyOn(console, 'error');
        consoleErrorSpy.mockImplementation(() => { });

        const onDataLoaded = jest.fn();
        render(<StudentDataLoader id={studentId} onDataLoaded={onDataLoaded} />);

        await act(async () => {
            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(global.fetch).toHaveBeenCalledWith(`http://localhost:8080/api/student/${studentId}`);
        });

        await act(async () => { });

        expect(onDataLoaded).not.toHaveBeenCalled();
        expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error:', expect.any(Error));

        consoleErrorSpy.mockRestore();
    });

    test('handles network errors and logs the error for faculty data', async () => {
        const studentId = 1;
        const facultyId = 1;

        global.fetch = jest.fn().mockImplementation((url) => {
            if (url.endsWith(`/api/student/${studentId}`)) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ id: studentId }),
                });
            }
            if (url.endsWith(`/api/faculty/${facultyId}`)) {
                return Promise.resolve({ ok: false });
            }
            return Promise.resolve({ ok: true });
        });

        const consoleErrorSpy = jest.spyOn(console, 'error');
        consoleErrorSpy.mockImplementation(() => { });

        const onDataLoaded = jest.fn();
        render(<StudentDataLoader id={studentId} onDataLoaded={onDataLoaded} />);

        await act(async () => { });

        expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error:', expect.any(Error));
        expect(onDataLoaded).not.toHaveBeenCalled();

        consoleErrorSpy.mockRestore();
    });

    test('handles network errors and logs the error for university data', async () => {
        const studentId = 1;
        const facultyId = 1;
        const universityId = 1;

        global.fetch = jest.fn().mockImplementation((url) => {
            if (url.endsWith(`/api/student/${studentId}`)) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ id: studentId }),
                });
            }
            if (url.endsWith(`/api/faculty/${facultyId}`)) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ id: facultyId, id_university: universityId }),
                });
            }
            if (url.endsWith(`/api/university/${universityId}`)) {
                return Promise.resolve({ ok: false });
            }
            return Promise.resolve({ ok: true });
        });

        const consoleErrorSpy = jest.spyOn(console, 'error');
        consoleErrorSpy.mockImplementation(() => { });

        const onDataLoaded = jest.fn();
        render(<StudentDataLoader id={studentId} onDataLoaded={onDataLoaded} />);

        await act(async () => { });

        expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error:', expect.any(Error));
        expect(onDataLoaded).not.toHaveBeenCalled();

        consoleErrorSpy.mockRestore();
    });
});
