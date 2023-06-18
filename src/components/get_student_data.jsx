import { useEffect } from 'react';

const StudentDataLoader = ({ id, onDataLoaded }) => {
    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/student/${id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const studentData = await response.json();

                const facultyResponse = await fetch(`http://localhost:8080/api/faculty/${studentData.id_faculty}`);
                if (!facultyResponse.ok) {
                    throw new Error('Network response was not ok');
                }
                const facultyData = await facultyResponse.json();

                const universityResponse = await fetch(`http://localhost:8080/api/university/${facultyData.id_university}`);
                if (!universityResponse.ok) {
                    throw new Error('Network response was not ok');
                }
                const universityData = await universityResponse.json();

                onDataLoaded(studentData, universityData, facultyData);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchStudentData();
    }, [id]);

    return null;
};

export default StudentDataLoader;
