let statisticsContainer = document.querySelector("#statisticsContainer");
let gr = document.querySelector("#gr");
let graphImage = document.querySelector("#graphImage");

statistics.addEventListener("click", function () {
    filesContainer.classList.add("d-none")
    listsContainer.classList.add("d-none")
    tabl2.classList.add("d-none")
    tabl1.classList.add("d-none")
    statisticsContainer.classList.remove("d-none")

    sendData("/getStatistics", "GET").then(e => {
        console.log(e);
        let start = `<svg width="1600" stroke="red" style="background-color: #87a865;" height="900">`
        let end = `</svg>`

        let resultStr = ""
        resultStr = resultStr+start

        let widthItem = 1200/e.length
        for (let i = 1; i < e.length; i++){
            let riznica = parseInt(e[i].time) - parseInt(e[i-1].time)

            let sdvX = 750;
            let sdvig = widthItem+i*3
            if(i % 40 === 0){
                let str = `<g>
                            <rect x="${riznica+sdvig}" y="${40+riznica}" stroke-width="${riznica/2}" stroke="red" width="${1}" height="${riznica/5}"></rect>
                            <text x="${sdvig-6}" y="30">${createOnlyTime(e[i].time)}</text>
                            <text x="10" y="${sdvig+i}">${i/40}</text>
                        </g>`
                resultStr = resultStr+str
            } else if (i % 2 === 0){
                let str = `<g>
                            <rect x="${riznica+sdvig}" y="${40+riznica}" stroke-width="${riznica/2}" stroke="blue" width="${1}" height="${riznica/5}"></rect>
                        </g>`
                resultStr = resultStr+str
            }
        }
        let poly = `<polygon points="300,110 350,290 160,610" style="fill:lime;stroke:purple;stroke-width:1" />`
        let lol = `<rect x="555" y="111" width="90" height="60">
    <animate id="a1" attributeName="fill" from="red" to="blue" dur="3s" fill="freeze" />
  </rect>
  <rect x="555" y="222" width="90" height="60">
    <animate id="a2" attributeName="fill" from="blue" to="yellow" begin="a1.end" dur="3s" fill="freeze" />
  </rect>
  <rect x="777" y="233" width="90" height="60">
    <animate id="a3" attributeName="fill" from="yellow" to="green" begin="a2.end" dur="3s" fill="freeze" />
  </rect>`
        // resultStr = resultStr+poly
        // resultStr = resultStr+lol
        resultStr = resultStr+end

        statisticsContainer.innerHTML = resultStr

    //     statisticsContainer.innerHTML = `<svg width="900" height="700">
    //     <g>
    //         <rect x="0" y="0" width="100" height="120"></rect>
    //         <text x="50" y="140">Январь</text>
    //     </g>
    // </svg>`


    })
})