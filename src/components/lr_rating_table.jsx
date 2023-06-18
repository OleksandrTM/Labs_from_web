import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const StudentRatingTable = () => {
    const [ratingData, setRatingData] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/student/rating')
            .then((response) => response.json())
            .then((data) => {
                setRatingData(data);
            });
    }, []);

    return (
        <>
            <h2 id="rating">Рейтинг студентів</h2>
            <table id="s_rating-table" className="rating-table">
                <thead>
                    <tr>
                        <th>№</th>
                        <th>Студент</th>
                        <th>Рейтинговий бал</th>
                    </tr>
                </thead>
                <tbody>
                    {ratingData[0]?.map((student, index) => (
                        <tr key={`${student.id_student}-${index}`}>
                            <td>{index + 1}</td>
                            <td>
                                <Link to={`/general/student/${student.id_student}`}>{`${student.last_name} ${student.first_name}`}</Link>
                            </td>
                            <td>{ratingData[1]?.[index]?.avg.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default StudentRatingTable;
