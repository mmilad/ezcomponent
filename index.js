var builder = require('./lib/build.js').run
var args = process.argv.slice(2)
console.log(args)
builder()