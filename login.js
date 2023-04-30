const loginform = document.querySelector("#login");

loginform.addEventListener("submit", (event) => {
    event.preventDefault();

    const emailinput = document.querySelector("#email");
    const passwordinput = document.querySelector("#password");
    const username = emailinput.value;
    const password = passwordinput.value;
    const authHeader = "Basic " + btoa(`${username}:${password}`);

    fetch("http://localhost:8080/api/login",
        {
            method: 'POST',
            headers: {
                Authorization: authHeader
            }
        }).then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            if (data.token !== undefined) {
                const token = data.token;
                localStorage.setItem("accessToken", token);
                location.pathname = "successful_lr.html";
                alert("Successful login");
            } else {
                alert(data.message);
                throw new Error("User with such email already exists");
            }
        })
        .catch((error) => {
            console.error("Error:", error);
    });
});
