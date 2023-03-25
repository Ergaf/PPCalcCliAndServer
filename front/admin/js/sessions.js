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
    statisticsContainer.classList.add("d-none")
    tbodySessions.classList.remove("d-none")
    let data = {
        page: 0,
        inPageCount: 10
    }

    sendData("/getSessies", "POST", JSON.stringify(data)).then(e => {
        console.log(e);
        tbodySessions.innerHTML = ""
        if(e.status === "ok"){
            e.data.data.forEach(o => {
                let tr = document.createElement("tr");
                tr.classList.add("trSession");
                let innerHTML = `<td><div class="btn">${o.id}</div></td>
                            <td><div class="btn">${o.session}</div></td>
                            <td><div class="btn">${o.userAgent}</div></td>
                            <td><div class="btn">${o.ip}</div></td>
                            <td><div class="btn">${createTime(o.time)}</div></td>
                            <td><div class="btn">${o.userid}</div></td>
                            <td>
                                <button class="btn btn-danger" sesId="${o.id}" onclick=del(event.target)>close</button>
                            </td>         
                            `;
                tr.innerHTML = innerHTML;
                tbodySessions.append(tr);
            })
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
    sendData("/getSessies", "DELETE", JSON.stringify(target.getAttribute("sesId"))).then(e => {
        console.log(e);
        if(e.toString() === target.getAttribute("sesId").toString()){
            target.parentElement.parentElement.remove()
        }
    })
}