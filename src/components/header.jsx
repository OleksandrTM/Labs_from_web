import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import RatingImage from '../images/rating_img.jpg';

const Header = ({ title }) => {
    const location = useLocation();
    const { pathname } = location;
    const { id } = useParams();

    const deleteStudent = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/student/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.accessToken}`,
                },
            });
            if (response.ok) {
                alert('Студента успішно видалено.');
            } else {
                const data = await response.json();
                console.error(data.message);
            }
        } catch (error) {
            console.error('Сталася помилка при видаленні студента:', error);
        }
    };

    return (
        <header>
            <img src={RatingImage} alt='Рейтинг' />
            <h1>{title}</h1>
            <nav>
                <ul>
                    {pathname === '/' ? (
                        <>
                            <li><Link to='/login'>Вхід</Link></li>
                            <li><ScrollLink to='rating' smooth={true} duration={500}>Рейтинг</ScrollLink></li>
                            <li><ScrollLink to='about-us' smooth={true} duration={500}>Про нас</ScrollLink></li>
                        </>
                    ) : (
                        <li className='emptyList'></li>
                    )}
                    {pathname === '/general' ? (
                        <>
                            <li><Link to="/" onClick={() => localStorage.clear()}>Вихід</Link></li>
                            <li><ScrollLink to='rating' smooth={true} duration={500}>Рейтинг</ScrollLink></li>
                            <li><ScrollLink to='about-us' smooth={true} duration={500}>Про нас</ScrollLink></li>
                            <li><Link to={`/general/profile/${localStorage.userId}`}>Профіль</Link></li>
                        </>
                    ) : (
                        <li className='emptyList'></li>
                    )}
                    {pathname === `/general/profile/${localStorage.userId}` ? (
                        <>
                            <li><Link to='/general'>Головна</Link></li>
                            <li><Link to='/' onClick={() => localStorage.clear()}>Вихід</Link></li>
                        </>
                    ) : (
                        <li className='emptyList'></li>
                    )}
                    {pathname === `/general/profile/edit/${localStorage.userId}` ? (
                        <>
                            <li><Link to='/general'>Головна</Link></li>
                            <li><Link to={`/general/profile/${id}`}>Профіль</Link></li>
                        </>
                    ) : (
                        <li className='emptyList'></li>
                    )}
                    {pathname === `/general/student/${id}` ? (
                        <>
                            <li><Link to='/general'>Головна</Link></li>
                            {localStorage.userRole === 'manager' ? <li><Link to={`/general/student/edit/${id}`}>Редагувати</Link></li> : <></>}
                            {localStorage.userRole === 'manager' ? <li><Link to='/general' onClick={deleteStudent}>Видалити</Link></li> : <></>}
                        </>
                    ) : (
                        <li className='emptyList'></li>
                    )}
                    {pathname === `/general/student/edit/${id}` ? (
                        <>
                            <li><Link to='/general'>Головна</Link></li>
                            <li><Link to={`/general/student/${id}`}>Інформація про студента</Link></li>
                        </>
                    ) : (
                        <li className='emptyList'></li>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Header;
