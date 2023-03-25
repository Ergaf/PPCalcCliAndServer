let sessions = document.querySelector("#sessions");
let listsContainer = document.querySelector("#listsContainer");
let tabl2 = document.querySelector("#tabl2");
let tabl1 = document.querySelector("#tabl1");
let tableBody = document.querySelector("#tableBody");
let nameService = document.querySelector("#nameService");
let tableTitle = document.querySelector("#tableTitle");

sessions.addEventListener("click", function (){
    filesContainer.classList.add("d-none")
    listsContainer.classList.remove("d-none")
    tabl2.classList.add("d-none")
    tabl1.classList.add("d-none")
    statisticsContainer.classList.add("d-none")
    tableBody.classList.remove("d-none")
    nameService.innerText = "Активні сессії"
    tableTitle.innerHTML = `<th scope="col">increment</th>
                            <th scope="col">sesson ID</th>
                            <th scope="col">userAgent</th>
                            <th scope="col">ip</th>
                            <th scope="col">time</th>
                            <th scope="col">user ID</th>
                            <th scope="col">del</th>`
    let data = {
        page: 0,
        inPageCount: 10
    }

    sendData("/getSessies", "POST", JSON.stringify(data)).then(e => {
        console.log(e);
        tableBody.innerHTML = ""
        if(e.status === "ok"){
            renderSessionsItem(e)
            renderPages(e)
        } else {
            showError(e)
        }
    })
})
function createTime(timeStr){
    let thisTime = new Date(parseInt(timeStr));
    let timeHours = add0ToTime(thisTime.getHours().toString())
    let timeMinutes = add0ToTime(thisTime.getMinutes().toString())
    let timeSeconds = add0ToTime(thisTime.getSeconds().toString())
    let realMoth = thisTime.getMonth()+1
    let timeMonth = add0ToTime(realMoth.toString())
    let timeString = `${thisTime.getDate()}.${timeMonth}.${thisTime.getFullYear()}, ${timeHours}:${timeMinutes}:${timeSeconds}`
    return timeString
}
function add0ToTime(str){
    if(str.length < 2){
        return `0${str}`
    } else {
        return str
    }
}

function del(target) {
    // console.log(target.getAttribute("sesId"));
    sendData("/getSessies", "DELETE", JSON.stringify(target.getAttribute("itemId"))).then(e => {
        console.log(e);
        if(e.toString() === target.getAttribute("sesId").toString()){
            target.parentElement.parentElement.remove()
        }
    })
}

function renderSessionsItem(e){
    e.data.data.forEach(o => {
        let tr = document.createElement("tr");
        tr.classList.add("trColumn");
        let innerHTML = `<td><div class="btn">${o.id}</div></td>
                            <td><div class="btn">${o.session}</div></td>
                            <td><div class="btn">${o.userAgent}</div></td>
                            <td><div class="btn">${o.ip}</div></td>
                            <td><div class="btn">${createTime(o.time)}</div></td>
                            <td><div class="btn">${o.userid}</div></td>
                            <td>
                                <button class="btn btn-danger" itemId="${o.id}" onclick=del(event.target)>close</button>
                            </td>         
                            `;
        tr.innerHTML = innerHTML;
        tableBody.append(tr);
    })
}