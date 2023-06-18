import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileInfo = () => {
    const [profileData, setProfileData] = useState(null);
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
                setProfileData(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, []);

    const handleEditProfile = () => {
        navigate(`/general/profile/edit/${localStorage.userId}`);
    };

    const handleDeleteProfile = () => {
        const userId = localStorage.getItem('userId');

        fetch(`http://localhost:8080/api/user/${userId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(() => {
                localStorage.clear();
                navigate('/');
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    return (
        <div className="profile">
            {profileData && (
                <>
                    <div className="profile-info">
                        <h2>{profileData.first_name} {profileData.last_name}</h2>
                        <p>Електронна пошта: {profileData.email}</p>
                        <p>Роль: {profileData.role === 'Roles.admin' ? 'Адміністратор' : 'Менеджер'}</p>
                    </div>
                    <div className="profile-buttons">
                        <button id='edit' onClick={handleEditProfile}>Редагувати профіль</button>
                        <button onClick={handleDeleteProfile}>Видалити профіль</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ProfileInfo;
