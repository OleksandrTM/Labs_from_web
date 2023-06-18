import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StudentDataLoader from './get_student_data.jsx';

const StudentEditForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [studentData, setStudentData] = useState(null);

    const handleDataLoaded = (student) => {
        setStudentData(student);
    };

    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [estimates, setEstimates] = useState([]);
    const [ratings, setRating] = useState([]);

    useEffect(() => {
        if (studentData) {
            setEstimates(studentData.estimates);
            setRating(studentData.raiting_student);
            setFirstName(studentData.first_name);
            setLastName(studentData.last_name);
        }
    }, [studentData]);

    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedRating, setSelectedRating] = useState('');

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/estimate/list');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setSubjects(data);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchSubjects();
    }, []);

    const handleAddSubject = () => {
        if (selectedSubject && selectedRating) {
            const newEstimate = subjects.find((subject) => subject.subject === selectedSubject);
            console.log(newEstimate);
            const newRating = { id_estimate: newEstimate.id_estimate, rating: selectedRating };
            setEstimates([...estimates, newEstimate]);
            setRating([...ratings, newRating]);
            setSelectedSubject('');
            setSelectedRating('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = [
                {
                    first_name: firstName,
                    last_name: lastName,
                    id_faculty: studentData.id_faculty,
                },
                ratings.map((rating) => ({
                    id_estimate: rating.id_estimate,
                    rating: rating.rating,
                })),
            ];
            const response = await fetch(`http://localhost:8080/api/student/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.accessToken}`,
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            } else {
                navigate(`/general/student/${id}`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <main>
            <h1 className='ESinf'>Редагування інформації про студента</h1>
            <StudentDataLoader id={id} onDataLoaded={handleDataLoaded} />
            {studentData && (
                <form className='ESform' onSubmit={handleSubmit}>
                    <div>
                        <label className='ESlabel' htmlFor="first_name">Ім'я:</label>
                        <input
                            className='ESinput'
                            type="text"
                            id="first_name"
                            name="first_name"
                            defaultValue={studentData.first_name}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className='ESlabel' htmlFor="last_name">Прізвище:</label>
                        <input
                            className='ESinput'
                            type="text"
                            id="last_name"
                            name="last_name"
                            defaultValue={studentData.last_name}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>

                    <h2>Оцінки:</h2>
                    {estimates.map((estimate, index) => {
                        const { rating } = ratings.find(
                            (item) => item.id_estimate === estimate.id_estimate,
                        );

                        const handleRatingChange = (e) => {
                            const updatedRatings = [...ratings];
                            const indexToUpdate = updatedRatings.findIndex(
                                (item) => item.id_estimate === estimate.id_estimate,
                            );
                            updatedRatings[indexToUpdate].rating = parseInt(e.target.value, 10);
                            setRating(updatedRatings);
                            console.log(ratings);
                        };

                        const handleRemoveSubject = (subject) => {
                            const updatedRatings = ratings.filter(
                                (item) => item.id_estimate !== subject,
                            );
                            const updatedEstimates = estimates.filter(
                                (item) => item.id_estimate !== subject,
                            );
                            setRating(updatedRatings);
                            setEstimates(updatedEstimates);
                        };

                        return (
                            <div key={index}>
                                <label className='ESlabel' htmlFor={`subject-${index}`}>{estimate.subject}:</label>
                                <input
                                    className='ESinput'
                                    type="number"
                                    id={`subject-${index}`}
                                    name={`subject-${index}`}
                                    value={rating}
                                    onChange={handleRatingChange}
                                />
                                <button className='ESbutton' id='ESdel' type="button" onClick={() => handleRemoveSubject(estimate.id_estimate)}>
                                    Видалити
                                </button>
                            </div>
                        );
                    })}

                    <div>
                        <label className='ESlabel' htmlFor="subject">Новий предмет:</label>
                        <select className='ESinput' id="subject" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                            <option value="">Виберіть предмет</option>
                            {subjects.map((subject) => {
                                const isSubjectExists = estimates.some(
                                    (estimate) => estimate.subject === subject.subject,
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
                        <label className='ESlabel' htmlFor="rating">Оцінка:</label>
                        <input
                            className='ESinput'
                            type="number"
                            id="rating"
                            min="0"
                            max="100"
                            step="1"
                            placeholder="Введіть оцінку студента"
                            value={selectedRating}
                            onChange={(e) => setSelectedRating(parseInt(e.target.value, 10))}
                        />
                        <button className='ESbutton' id='ESadd' type="button" onClick={handleAddSubject}>
                            Додати предмет
                        </button>
                    </div>

                    <button className='ESbutton' id='ESsave' type="submit">Зберегти зміни</button>
                </form>
            )}
        </main>
    );
};

export default StudentEditForm;
