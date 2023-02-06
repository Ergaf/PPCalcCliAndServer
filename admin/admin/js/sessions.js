let sessions = document.querySelector("#sessions");
let sessionsContainer = document.querySelector("#sessionsContainer");
let tabl2 = document.querySelector("#tabl2");
let tabl1 = document.querySelector("#tabl1");
let tbodySessions = document.querySelector("#tbodySessions");

sessions.addEventListener("click", function (){
    filesContainer.classList.add("d-none")
    sessionsContainer.classList.remove("d-none")
    tabl2.classList.add("d-none")
    tabl1.classList.add("d-none")


    sendData("/getSessies", "GET").then(e => {
        console.log(e);
        tbodySessions.innerHTML = ""
        e.forEach(o => {
            let tr = document.createElement("tr");
            tr.classList.add("trSession")
            let innerHTML = `<td>${o.id}</td>
                            <td>${o.sessie}</td>
                            <td>${o.userAgent}</td>
                            <td>${o.ip}</td>
                            <td>${o.userid}</td>
                            <td>
                                <button class="btn btn-danger">close</button>
                            </td>         
`;
            tr.innerHTML = innerHTML;
            tbodySessions.append(tr);
        })
    })
})