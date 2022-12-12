
const csv = require('csvtojson/v2')
const fs = require('fs')
const writeStream = fs.createWriteStream('./csv/nodejs-hw1-ex2.txt', 'utf-8')

const main = () => {
    try {
        csv({ignoreEmpty: true})
            .fromStream(fs.createReadStream("./csv/nodejs-hw1-ex1.csv"))
            .pipe(writeStream)
            .on('error', (error) => console.error(error.message))
    } catch (error) {
        console.log(error)
    }
}

export default main