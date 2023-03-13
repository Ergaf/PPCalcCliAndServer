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
                            <td>${o.session}</td>
                            <td>${o.userAgent}</td>
                            <td>${o.ip}</td>
                            <td>${o.ip2}</td>
                            <td>${o.userid}</td>
                            <td>
                                <button class="btn btn-danger" sesId="${o.id}" onclick=del(event.target)>close</button>
                            </td>         
`;
            tr.innerHTML = innerHTML;
            tbodySessions.append(tr);
        })
    })
})

function del(target) {
    // console.log(target.getAttribute("sesId"));
    sendData("/getSessies", "DELETE", JSON.stringify(target.getAttribute("sesId"))).then(e => {
        console.log(e);
        if(e.toString() === target.getAttribute("sesId").toString()){
            target.parentElement.parentElement.remove()
        }
    })
}