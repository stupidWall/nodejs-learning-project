
const csv = require('csvtojson/v2')
const fs = require('fs')

const csvFilePath = './csv/nodejs-hw1-ex1.csv';
const jsonFilePath = './csv/nodejs-hw1-ex2.txt';

const readStream = fs.createReadStream(csvFilePath);
const writeStream = fs.createWriteStream(jsonFilePath, 'utf-8');

const main = () => {
    const csvToJson = csv()
        .fromStream(readStream)
        .pipe(writeStream)
        .on('done', error => {
            if (error) {
                console.error(error);
            } else {
                console.log('Conversion completed successfully');
            }
        });
    return csvToJson
}

export default main