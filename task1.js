
// Write a program which reads a string from the standard input stdin, reverses it and then writes it to the standard output stdout.
process.stdin.on("data", function(data) {
    data = data.toString().split('').reverse().join('')
    process.stdout.write(data + "\n")
})