import React, { useEffect, useState } from 'react';

const UserTable = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/user/list', {
            method: 'GET',
            headers: { Authorization: `Bearer ${localStorage.accessToken}` },
        })
            .then((response) => response.json())
            .then((data) => {
                setUsers(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, []);

    return (
        <>
            <h2>Список користувачів</h2>
            <table id="users_t">
                <thead>
                    <tr>
                        <th>Користувач</th>
                        <th>Роль</th>
                        <th>Електронна пошта</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={index}>
                            <td>{`${user.last_name} ${user.first_name}`}</td>
                            <td>{user.role === 'Roles.admin' ? 'Адміністратор' : 'Менеджер'}</td>
                            <td>{user.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default UserTable;
