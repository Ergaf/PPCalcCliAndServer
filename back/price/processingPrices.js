module.exports = {
    processingPricesInTableToPrices: function (table){
        let x = 1
        let data = [];
        table.forEach(e => {
            if (e[0] === '' || e[0] === null) {
                x = 1
            } else {
                if (x === 1) {
                    data.push({
                        name: e[0],
                        variants: []
                    })
                    x = 0
                } else {
                    data[data.length - 1].variants.push(e)
                }
            }
        })
        return data
    },
    countPrice: function (){

    }
}