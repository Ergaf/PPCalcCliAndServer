function renderOptions(varOfServFromTable, thisFileProp, renderIn){
    let thisOpt = getVariantsFromNameInData(varOfServFromTable);
    if(thisOpt !== undefined){
        thisOpt.forEach(e => {
            if(e[0][0] !== "!"){
                let elem = document.createElement("div")
                elem.innerText = e[0]
                elem.setAttribute("toFile", e[0]);
                elem.classList.add("btn")
                elem.addEventListener("click", function () {
                    let data = {
                        id: thisFile._id,
                        parameter: thisFileProp,
                        value: elem.getAttribute("toFile")
                    }
                    sendData("/orders", "PUT", JSON.stringify(data)).then(o => {
                        if(o.status === "ok"){
                            Object.defineProperty(thisFile, thisFileProp, {
                                value: elem.getAttribute("toFile"),
                                writable: true
                            });
                            thisFile.price = o.price
                            thisFile.renderSettings()
                        } else {
                            showError(o)
                        }
                    })
                })
                if(e[0] === Object.getOwnPropertyDescriptor(thisFile, thisFileProp).value){
                    // elem.classList.add("btnm-act");
                    elem.style.background = "#ffffff";
                    elem.style.borderTop = "#d9d9d9 solid";
                    elem.style.borderBottom = "black solid";
                    elem.style.color = "#000000";
                }
                renderIn.appendChild(elem)
            }
        })
    }
}