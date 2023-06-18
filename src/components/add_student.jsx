import React, { useState, useEffect } from 'react';

function AddStudentForm() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const [faculties, setFaculties] = useState([]);
    const [subjects, setSubjects] = useState([]);

    const [selectedFaculty, setSelectedFaculty] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedRating, setSelectedRating] = useState('');
    const [ratings, setRating] = useState([]);

    const fetchFaculties = () => {
        fetch('http://localhost:8080/api/faculty/list')
            .then((response) => response.json())
            .then((data) => {
                setFaculties(data);
            })
            .catch((error) => {
                console.error('Error fetching faculties:', error);
            });
    };

    const fetchSubjects = () => {
        fetch('http://localhost:8080/api/estimate/list')
            .then((response) => response.json())
            .then((data) => {
                setSubjects(data);
            })
            .catch((error) => {
                console.error('Error fetching subjects:', error);
            });
    };

    useEffect(() => {
        fetchFaculties();
        fetchSubjects();
    }, []);

    const handleAddSubject = () => {
        if (selectedSubject && selectedRating) {
            const newEstimate = subjects.find((subject) => subject.subject === selectedSubject);
            const newRating = { id_estimate: newEstimate.id_estimate, rating: selectedRating };
            setRating([...ratings, newRating]);
            setSelectedSubject('');
            setSelectedRating('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const studentData = {
            first_name: firstName,
            last_name: lastName,
            id_faculty: parseInt(selectedFaculty, 10),
        };
        const ratingData = ratings.map((rating) => ({
            id_estimate: rating.id_estimate,
            rating: rating.rating,
        }));
        const userId = parseInt(localStorage.userId, 10);
        const selectedF = parseInt(selectedFaculty, 10);
        const idManager = parseInt(faculties.find(
            (item) => item.id_faculty === selectedF,
        ).id_manager, 10);
        if (userId === idManager) {
            fetch('http://localhost:8080/api/student/list', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.accessToken}`,
                },
                body: JSON.stringify([studentData, ratingData]),
            })
                .then((response) => response.json())
                .then(() => {
                    alert('Студента успішно створено. Щоб побачити його у таблиці перезапустіть сторінку.');
                })
                .catch((error) => {
                    console.error('Error submitting data:', error);
                });
        } else {
            alert('Це не ваш факультет.');
        }
    };

    return (
        <div>
            <h2>Додати студента</h2>
            <form className='AddSt' onSubmit={handleSubmit}>
                <label className='AddLabel' htmlFor="first_name">Ім'я:</label>
                <input className='AddStInp' type="text" id="first_name" placeholder="Введіть ім'я студента" name="first_name" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />

                <label className='AddLabel' htmlFor="last_name">Прізвище:</label>
                <input className='AddStInp' type="text" id="last_name" placeholder="Введіть прізвище студента" name="last_name" required value={lastName} onChange={(e) => setLastName(e.target.value)} />

                <label className='AddLabel' htmlFor="faculty">Факультет:</label>
                <select className='AddStInp' id="faculty" name="faculty" value={selectedFaculty} onChange={(e) => setSelectedFaculty(e.target.value)} required>
                    <option value="">Виберіть факультет</option>
                    {faculties.map((faculty) => (
                        <option key={faculty.id_faculty} value={faculty.id_faculty}>
                            {faculty.name}
                        </option>
                    ))}
                </select>

                {ratings && (
                    <div>
                        <h2>Оцінки:</h2>
                        {ratings.map((rating, index) => {
                            const { subject } = subjects.find(
                                (item) => item.id_estimate === rating.id_estimate,
                            );

                            return (
                                <div key={index} className="subject-item">
                                    <div className="subject-name">{subject}:</div>
                                    <div className="subject-rating">{rating.rating}</div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div>
                    <label className='AddLabel' htmlFor="subject">Предмет:</label>
                    <select className='AddStInp' id="subject" name="subject" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                        <option value="">Виберіть предмет</option>
                        {subjects.map((subject) => {
                            const isSubjectExists = ratings.some(
                                (rating) => rating.id_estimate === subject.id_estimate,
                            );
                            if (!isSubjectExists) {
                                return (
                                    <option key={subject.id_estimate} value={subject.subject}>
                                        {subject.subject}
                                    </option>
                                );
                            }
                            return null;
                        })}
                    </select>
                    <label className='AddLabel' htmlFor="rating">Оцінка:</label>
                    <input
                        className='AddStInp'
                        type="number"
                        id="rating"
                        min="0"
                        max="100"
                        step="1"
                        placeholder="Введіть оцінку студента"
                        value={selectedRating}
                        onChange={(e) => setSelectedRating(parseInt(e.target.value, 10))}
                    />
                    <button className='SubmSt' type="button" onClick={handleAddSubject}>
                        Додати предмет
                    </button>
                </div>

                <button className='SubmSt' type="submit">Додати студента</button>
            </form>
        </div>
    );
}

export default AddStudentForm;
