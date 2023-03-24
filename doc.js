const fs = require("fs");
const {promises: fsp} = require("fs");
const libre = require("libreoffice-convert");
libre.convertAsync = require('util').promisify(libre.convert);
const pdf = require("./pdf")
module.exports = {
    docToPdf: async function docToPdf(inputPath, cookies, filenameToNorm, res, id, calcType, configSQLConnection) {
        let folder = __dirname + `/files/${cookies}/${id}/pdf`
        try {
            if (!fs.existsSync(folder)) {
                await fs.mkdirSync(folder)
            }
        } catch (err) {
            console.error(err.message)
        }
        const ext = '.pdf'
        const outputPath = __dirname + `/files/${cookies}/${id}/pdf/file1.pdf`;
        // Read file
        const docxBuf = await fsp.readFile(inputPath);
        // Convert it to pdf format with undefined filter (see Libreoffice docs about filter)
        let pdfBuf = await libre.convertAsync(docxBuf, ext, undefined);
        // Here in done you have pdf file which you can save or transfer in another stream
        await fsp.writeFile(outputPath, pdfBuf);
        console.log("sucess in pdf!!!" + filenameToNorm);

        pdf.getInfoInPdf(inputPath, cookies, filenameToNorm, res, id, outputPath, calcType, configSQLConnection)

        // await toPng(outputPath, cookies, filenameToNorm, res, id)
    }
}