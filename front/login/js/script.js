const submitButton = document.querySelector("#submit");
const floatingInput = document.querySelector("#floatingInput");
const floatingPassword = document.querySelector("#floatingPassword");
submitButton.addEventListener("click", function () {
    event.preventDefault();
    let data = {
        login: floatingInput.value,
        pass: floatingPassword.value
    }
    sendData("/login", "POST", JSON.stringify(data)).then(e => {
        console.log(e);
        if(e.err === "login"){
            floatingInput.classList.add("is-invalid")
            floatingPassword.classList.remove("is-invalid")
        } else if (e.err === "pass"){
            floatingInput.classList.remove("is-invalid")
            floatingPassword.classList.add("is-invalid")
        } else if (e.err === "no"){
            floatingInput.parentElement.classList.remove("is-invalid")
            floatingPassword.parentElement.classList.remove("is-invalid")
            document.location.href = '/admin'
        }
    })
})

async function sendData(url, method, data) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: method, // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/octate-stream'
            // 'Content-Type': 'multipart/form-data'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *client
        // body: JSON.stringify(data) // body data type must match "Content-Type" header
        body: data // body data type must match "Content-Type" header
    });
    let res = await response.json()
    return await res; // parses JSON response into native JavaScript objects
}