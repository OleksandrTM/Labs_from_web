import React, { useEffect, useState } from 'react';

const RatingTable = () => {
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
            <table id="pr_rating-table" className="rating-table">
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
                            <td>{`${student.last_name} ${student.first_name}`}</td>
                            <td>{ratingData[1]?.[index]?.avg.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default RatingTable;
