var fs = require('fs')
var builder = require('./lib/build.js').run
var args = process.argv.slice(2)
if(args.length) {
    if(args[0] === "watch") {
        watchChanges()
    }
}
builder()



function watchChanges() {
    fs.watch('./lib/jhcr.js', { encoding: 'buffer' }, (eventType, filename) => {
        builder()
    });
}