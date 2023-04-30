const table = document.querySelector("#users_t");

fetch("http://localhost:8080/api/user/list", {
    method: 'GET',
    headers: { Authorization: `Bearer ${localStorage.accessToken}` }})
.then(response => response.json())
.then(data => {
    console.log(data);
    data.forEach(user => {
        const row = document.createElement('tr');
        const username = document.createElement('td')
        const role = document.createElement('td');
        const email = document.createElement('td');

        username.textContent = user.last_name + " " + user.first_name;
        if(user.role == "Roles.admin"){
            role.textContent = "Адміністратор";
        }
        else{
            role.textContent = "Менеджер";
        }
        email.textContent = user.email

        row.appendChild(username);
        row.appendChild(role);
        row.appendChild(email);

        table.appendChild(row);
    })
});



const stable = document.querySelector("#s_rating-table");

fetch("http://localhost:8080/api/student/rating", {
    method: 'GET',
    headers: {}
}).then(response => response.json())
.then(data => {
    console.log(data);
    i = 1
    data[0].forEach(student => {
        const row = document.createElement('tr');
        const number = document.createElement('td')
        const studentname = document.createElement('td');
        const rating = document.createElement('td');
        const link = document.createElement('a');

        number.textContent = i;
        i++;
        link.textContent = student.last_name + " " + student.first_name;
        link.href = "details.html";
        rating.textContent = data[1][i - 2].avg.toFixed(2);
        
        studentname.appendChild(link);
        row.appendChild(number);
        row.appendChild(studentname);
        row.appendChild(rating);

        stable.appendChild(row);
    })
});