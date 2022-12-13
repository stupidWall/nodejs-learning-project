const fs = require('fs');
const csv = require('csvtojson/v2');

const csvFilePath = './csv/nodejs-hw1-ex1.csv';
const jsonFilePath = './csv/nodejs-hw1-ex2.txt';

const csvToJson = (csvFilePath, jsonFilePath) => {
  const readableStream = fs.createReadStream(sour);
  const writableStream = fs.createWriteStream(dest);

  csv()
    .fromStream(readableStream)
    .pipe(writableStream)
    .on('done', error => {
      if (error) {
        console.error(error);
      } else {
        console.log('Conversion completed successfully');
      }
    });
}

csvToJson(csvFilePath, jsonFilePath);