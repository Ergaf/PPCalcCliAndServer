// const libre = require('libreoffice-convert');
// const path = require('path');
// const fs = require('fs');
// const converter = require('docx-pdf');
//
// converter('test.docx', 'output.pdf', function(err, result) {
//     if (err) {
//         console.log("Converting Doc to PDF  failed", err);
//     }
//     console.log("Converting Doc to PDF succesfull", result);
// });

// 'use strict';

const path = require('path');
const fs = require('fs').promises;

const libre = require('libreoffice-convert');
libre.convertAsync = require('util').promisify(libre.convert);

async function main() {
    const ext = '.pdf'
    const inputPath = path.join(__dirname, '/111.pptx');
    const outputPath = path.join(__dirname, `/112${ext}`);

    // Read file
    const docxBuf = await fs.readFile(inputPath);

    // Convert it to pdf format with undefined filter (see Libreoffice docs about filter)
    let pdfBuf = await libre.convertAsync(docxBuf, ext, undefined);

    // Here in done you have pdf file which you can save or transfer in another stream
    await fs.writeFile(outputPath, pdfBuf);
}

main().catch(function (err) {
    console.log(`Error converting file: ${err}`);
});