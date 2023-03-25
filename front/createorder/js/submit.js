const submit = document.querySelector("#submit");
const firstName = document.querySelector("#firstName");
const email = document.querySelector("#email");
const phone = document.querySelector("#phone");
const messenger = document.querySelector("#messenger");

// submit.addEventListener("click", function (ev){
//     // ev.preventDefault()
//
//     // let data = {
//     //     name: firstName.value,
//     //     mail: email.value,
//     //     phone: phone.value,
//     //     messenger: messenger.value,
//     // }
//     // sendData("/createOrder", "POST", JSON.stringify(data)).then(e => {
//     //     console.log(e);
//     // })
// })

async function sendData(url, method, data) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: method, // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            'charset': 'utf-8',
            // 'Content-Type': 'application/octate-stream'
            // 'Content-Type': 'multipart/form-data'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *client
        // body: JSON.stringify(data) // body data type must match "Content-Type" header
        body: data // body data type must match "Content-Type" header
    });
    return await response.json(); // parses JSON response into native JavaScript objects
}