const table = document.querySelector("#pr_rating-table");

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

        number.textContent = i;
        i++;
        studentname.textContent = student.last_name + " " + student.first_name;
        rating.textContent = data[1][i - 2].avg.toFixed(2);

        row.appendChild(number);
        row.appendChild(studentname);
        row.appendChild(rating);

        table.appendChild(row);
    })
});

