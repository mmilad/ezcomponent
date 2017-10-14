var fs = require('fs')
var builder = require('./lib/build.js').run
var args = process.argv.slice(2)
if(args.length) {
    if(args[0] === "watch") {
        watchChanges()
    }
    if(args[0] === "jhcr") {
        watchChanges()
        watchJhcrChanges()
    }
}
builder()



function watchChanges() {
    fs.watch('./lib/jhcr.js', { encoding: 'buffer' }, (eventType, filename) => {
        builder()
    });
}

function watchJhcrChanges() {
    fs.watch('./jhcrts/dist/jhcr.js', { encoding: 'buffer' }, (eventType, filename) => {
        fs.createReadStream('./jhcrts/dist/jhcr.js').pipe(fs.createWriteStream('./lib/jhcr.js'));
    });
}