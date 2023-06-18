import { useState } from 'react';
import { useParams } from 'react-router-dom';
import StudentDataLoader from './get_student_data.jsx';

const StudentInfo = () => {
    const { id } = useParams();
    const [studentData, setStudentData] = useState(null);
    const [facultyData, setFacultyData] = useState(null);
    const [universityData, setUniversityData] = useState(null);

    const handleDataLoaded = (student, university, faculty) => {
        setStudentData(student);
        setUniversityData(university);
        setFacultyData(faculty);
    };

    return (
        <main>
            <StudentDataLoader id={id} onDataLoaded={handleDataLoaded} />
            <table>
                <tbody>
                    <tr>
                        <th>Прізвище та ім'я</th>
                        <td colSpan="2">{studentData && `${studentData.last_name} ${studentData.first_name}`}</td>
                    </tr>
                    <tr>
                        <th>Університет</th>
                        <td colSpan="2">{universityData && universityData.name}</td>
                    </tr>
                    <tr>
                        <th>Факультет</th>
                        <td colSpan="2">{facultyData && facultyData.name}</td>
                    </tr>
                    <tr>
                        <th>Предмети</th>
                        <th>Бали</th>
                        <th>Коефіцієнти</th>
                    </tr>
                    {studentData
                        && studentData.estimates.map((estimate) => (
                            <tr key={estimate.id_estimate}>
                                <td>{estimate.subject}</td>
                                <td>{studentData.raiting_student.find(
                                    (item) => item.id_estimate === estimate.id_estimate,
                                ).rating}</td>
                                <td>{estimate.coefficient}</td>
                            </tr>
                        ))}
                    <tr>
                        <th>Середній бал</th>
                        <td colSpan="2">
                            {studentData
                                && studentData.estimates.reduce(
                                    (total, estimate) => total + estimate.coefficient
                                        * studentData.raiting_student.find(
                                            (item) => item.id_estimate === estimate.id_estimate,
                                        ).rating,
                                    0,
                                )}
                        </td>
                    </tr>
                </tbody>
            </table>
        </main>
    );
};

export default StudentInfo;
