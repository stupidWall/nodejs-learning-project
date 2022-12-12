
var csv = require('csvtojson/v2')
var fs = require('fs')
var writeStream = fs.createWriteStream('./csv/nodejs-hw1-ex2.txt', 'utf-8')
var readline = require('readline')

var main = function() {
    try {
        csv({ignoreEmpty: true})
            .fromStream(fs.createReadStream("./csv/nodejs-hw1-ex1.csv"))
            .pipe(writeStream)
            .on('error', (error) => console.error(error.message))
    } catch (error) {
        console.log(error)
    }
}

var main2 = function() {
    var rl = readline.createInterface({
        input: fs.createReadStream("./csv/nodejs-hw1-ex1.csv"),
        crlfDelay: Infinity
    });
    rl.on('line', (line) => {
        // handle on demand 
        console.log('line: ', line)
    });
    rl.on('error', (error) => console.error(error.message));
    rl.on('close', () => {
        console.log('Reading complete')
    })
}

main()
// main2()