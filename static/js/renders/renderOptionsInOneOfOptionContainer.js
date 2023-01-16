function renderOptions(varOfServFromTable, thisFileProp, renderIn){
    let thisOpt = getVariantsFromNameInData(varOfServFromTable);
    if(thisOpt !== undefined){
        thisOpt.forEach(e => {
            if(e[0][0] !== "!"){
                let elem = document.createElement("div")
                elem.innerText = e[0]
                elem.classList.add("btn")
                elem.addEventListener("click", function () {
                    Object.defineProperty(thisFile, thisFileProp, {
                        value: elem.innerText,
                        writable: true
                    });
                    thisFile.renderSettings()
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