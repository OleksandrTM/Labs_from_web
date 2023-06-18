import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RegistrationForm = () => {
    const [username, setUsername] = useState('');
    const [usersurname, setUsersurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const userData = {
            role: 'manager',
            first_name: username,
            last_name: usersurname,
            email,
            password,
        };

        try {
            const response = await fetch('http://localhost:8080/api/user/list', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                navigate('/login');
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="containerR">
            <form onSubmit={handleSubmit}>
                <h1 className='regH1'>Реєстрація</h1>

                <label htmlFor="username" className='labelRegistr'>Ім'я користувача</label>
                <input type="text" className='regInput' placeholder="Введіть ім'я користувача" id='username' name="username" required value={username} onChange={(e) => setUsername(e.target.value)} />

                <label htmlFor="usersurname" className='labelRegistr'>Прізвище користувача</label>
                <input type="text" className='regInput' placeholder="Введіть прізвище користувача" id='usersurname' name="usersurname" required value={usersurname} onChange={(e) => setUsersurname(e.target.value)} />

                <label htmlFor="email" className='labelRegistr'>Пошта</label>
                <input type="email" className='regInput' placeholder="Введіть пошту" id='email' name="email" required value={email} onChange={(e) => setEmail(e.target.value)} />

                <label htmlFor="password" className='labelRegistr'>Пароль</label>
                <input type="password" className='regInput' placeholder="Введіть пароль" id='password' name="password" required value={password} onChange={(e) => setPassword(e.target.value)} />

                <div className="buttons">
                    <button type="submit" className="cancel-button" id='cancelButton'>Зареєструватися</button>
                    <button className="cancel-button" id='cancel-button'><Link to="/" className='regB'>Відмінити</Link></button>
                </div>
            </form>
        </div>
    );
};

export default RegistrationForm;
