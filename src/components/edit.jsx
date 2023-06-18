import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('userId');

        fetch(`http://localhost:8080/api/user/${userId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.accessToken}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setFirstName(data.first_name);
                setLastName(data.last_name);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, []);

    const handleCancel = () => {
        navigate(`/general/profile/${localStorage.userId}`);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const userId = localStorage.getItem('userId');
        const userData = {
            first_name: firstName,
            last_name: lastName,
            password,
        };

        fetch(`http://localhost:8080/api/user/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.accessToken}`,
            },
            body: JSON.stringify(userData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(() => {
                handleCancel();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    return (
        <>
            <h1 className='EH1'>Редагування профілю</h1>
            <form className='EForm' onSubmit={handleSubmit}>
                <div>
                    <label className='ELab' htmlFor="first_name">Ім'я:</label>
                    <input className='Einp' type="text" id="first_name" name="first_name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div>
                    <label className='ELab' htmlFor="last_name">Прізвище:</label>
                    <input className='Einp' type="text" id="last_name" name="last_name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
                <div>
                    <label className='ELab' htmlFor="password">Пароль:</label>
                    <input className='Einp' type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button className='Ebut' id='Ebut1' type="submit">Зберегти зміни</button>
                    <button className='Ebut' id='Ebut2' type="button" onClick={handleCancel}>Відмінити</button>
                </div>
            </form>
        </>
    );
};

export default EditProfile;
