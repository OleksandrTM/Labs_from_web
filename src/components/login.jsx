import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        const authHeader = `Basic ${btoa(`${email}:${password}`)}`;

        fetch('http://localhost:8080/api/login', {
            method: 'POST',
            headers: {
                Authorization: authHeader,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                if (data.token !== undefined) {
                    const { token } = data;
                    const { userId } = data;
                    const userRole = data.role;
                    const timestamp = Date.now();
                    localStorage.setItem('accessToken', token);
                    localStorage.setItem('userId', userId);
                    localStorage.setItem('userRole', userRole);
                    localStorage.setItem('tokenTimestamp', timestamp);
                    navigate('/general');
                    alert('Ви успішно увійшли.');
                } else {
                    alert(data.message);
                    throw new Error('User with such email already exists');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    return (
        <div className="login-wrapper">
            <form id="loginForm" data-testid="loginForm" onSubmit={handleSubmit}>
                <h1 id='loginH1'>Вхід</h1>

                <label className='loginLabel' htmlFor="email">Електронна пошта:</label>
                <input
                    className='loginInput'
                    type="text"
                    id="email"
                    placeholder="Введіть пошту"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label className='loginLabel' htmlFor="password">Пароль:</label>
                <input
                    className='loginInput'
                    type="password"
                    id="password"
                    placeholder="Введіть пароль"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit" className="button-style">Вхід</button>
            </form>
            <h6 id='loginH6'>Ще не маєте акаунту? <Link to="/registration" className="link-style">Реєструйтеся!</Link></h6>
        </div>
    );
};

export default LoginForm;
