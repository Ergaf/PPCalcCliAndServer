let allOrders = document.querySelector("#allOrders");
let countInPage = document.querySelector("#countInPage");
let paginationContainer = document.querySelector("#paginationContainer");
let currentPage = 1;

allOrders.addEventListener("click", function (e){
    listsContainer.classList.remove("d-none");
    filesContainer.classList.add("d-none")
    nameService.innerText = "Зробленні замовлення"
    tableTitle.innerHTML = `<th scope="col">Номер (id)</th>
                            <th scope="col">Ким (userId)</th>
                            <th scope="col">session</th>
                            <th scope="col">Прогресс</th>
                            <th scope="col">Виконавець (userId)</th>
                            <th scope="col">Коли замовили</th>
                            <th scope="col"></th>
                            <th scope="col"></th>`

    let data = {
        page: 1,
        inPageCount: 10
    }
    sendData("/getOrders", "POST", JSON.stringify(data)).then(res => {
        tableBody.innerHTML = ""
        console.log(res);
        if(res.status === "ok"){
            renderOrdersItem(res)
            renderPages(res)
        }
    })
})

function del(target) {
    // console.log(target.getAttribute("sesId"));
    // sendData("/getSessies", "DELETE", JSON.stringify(target.getAttribute("sesId"))).then(e => {
    //     console.log(e);
    //     if(e.toString() === target.getAttribute("sesId").toString()){
    //         target.parentElement.parentElement.remove()
    //     }
    // })
}

function showData(target) {
    // console.log(target.getAttribute("sesId"));
    // sendData("/getSessies", "DELETE", JSON.stringify(target.getAttribute("sesId"))).then(e => {
    //     console.log(e);
    //     if(e.toString() === target.getAttribute("sesId").toString()){
    //         target.parentElement.parentElement.remove()
    //     }
    // })
}

function doProcessing(target) {
    // console.log(target.getAttribute("sesId"));
    // sendData("/getSessies", "DELETE", JSON.stringify(target.getAttribute("sesId"))).then(e => {
    //     console.log(e);
    //     if(e.toString() === target.getAttribute("sesId").toString()){
    //         target.parentElement.parentElement.remove()
    //     }
    // })
}

countInPage.addEventListener("change", function (e){
    if(nameService.innerText === "Зробленні замовлення"){
        getData()
    }
})

function getData(){
    let data = {
        page: currentPage,
        inPageCount: parseInt(countInPage.value)
    }
    sendData("/getOrders", "POST", JSON.stringify(data)).then(res => {
        tableBody.innerHTML = ""
        console.log(res);
        if(res.status === "ok"){
            renderOrdersItem(res)
            renderPages(res)
        }
    })
}

function renderOrdersItem(res){
    res.data.data.forEach(o => {
        let tr = document.createElement("tr");
        tr.classList.add("trColumn");
        let innerHTML = `<td><div class="btn">${o.id}</div></td>
                            <td><div class="btn">${o.userid}</div></td>
                            <td><div class="btn">${o.session}</div></td>
                            <td><div class="btn">${o.status}</div></td>
                            <td><div class="btn">${o.executorId}</div></td>
                            <td><div class="btn">${createTime(o.timeCreate)}</div></td>
                            <td>
                                <button class="btn btn-secondary" itemId="${o.id}" onclick=showData(event.target)>Докладніше</button>
                            </td>
                            <td>
                                <button class="btn btn-secondary" itemId="${o.id}" onclick=doProcessing(event.target)>Виконувати</button>
                            </td>
                            <td>
                                <button class="btn btn-danger" itemId="${o.id}" onclick=del(event.target)>X</button>
                            </td>         
                            `;
        tr.innerHTML = innerHTML;
        tableBody.append(tr);
    });
}

function renderPages(res){
    let backButton = `<li class="page-item"><button toPage="${currentPage-1}" onclick=toPage(event.target) class="page-link">Назад</button></li>`
    let backButtonDisabled = `<li class="page-item disabled"><button class="page-link">Назад</button></li>`
    let nextButton = `<li class="page-item"><button toPage="${currentPage+1}" onclick=toPage(event.target) class="page-link" href="#">Далі</button></li>`
    let nextButtonDisabled = `<li class="page-item disabled"><button class="page-link" href="#">Далі</button></li>`
    let resultHtml = ""
    if(res.data.pageCount === 1 || res.data.pageCount === "1"){
        resultHtml = resultHtml+backButtonDisabled
        if(res.data.page === 1){
            resultHtml = resultHtml+`<li class="page-item active"><button class="page-link" toPage="1">1</button></li>`
        } else {
            resultHtml = resultHtml+`<li class="page-item"><button onclick=toPage(event.target) class="page-link" toPage="1">1</button></li>`
        }
        resultHtml = resultHtml+nextButtonDisabled
    } else if (res.data.pageCount > 1 && res.data.pageCount < 7){
        for (let i = 1; i < res.data.pageCount; i++){
            if(i === 1){
                if(res.data.page === 1){
                    resultHtml = resultHtml+backButtonDisabled
                } else {
                    resultHtml = resultHtml+backButton
                }
            }
            if(i === res.data.page){
                resultHtml = resultHtml+`<li class="page-item active"><button class="page-link" toPage="${i}">${i}</button></li>`

            } else {
                resultHtml = resultHtml+`<li class="page-item"><button class="page-link" onclick=toPage(event.target) toPage="${i}">${i}</button></li>`
            }
            if(i === res.data.pageCount-1){
                if(res.data.page >= res.data.pageCount-1){
                    resultHtml = resultHtml+nextButtonDisabled
                } else {
                    resultHtml = resultHtml+nextButton
                }
            }
        }
    } else {
        for (let i = res.data.page-3; i < res.data.page+4; i++){
            if(i === res.data.page-3){
                if(res.data.page === 1){
                    resultHtml = resultHtml+backButtonDisabled
                } else {
                    resultHtml = resultHtml+backButton
                }
            }
            if(i === res.data.page){
                resultHtml = resultHtml+`<li class="page-item active"><button class="page-link" toPage="${i}">${i}</button></li>`

            } else {
                if(i > 0 && i <= res.data.pageCount-3){
                    resultHtml = resultHtml+`<li class="page-item"><button class="page-link" onclick=toPage(event.target) toPage="${i}">${i}</button></li>`
                }
            }
            if(i === res.data.page+3){
                if(res.data.page >= res.data.pageCount-3){
                    resultHtml = resultHtml+nextButtonDisabled
                } else {
                    resultHtml = resultHtml+nextButton
                }
            }
        }
    }
    paginationContainer.innerHTML = resultHtml
}

function toPage(e){
    currentPage = parseInt(e.getAttribute("toPage"))
    getData()
}