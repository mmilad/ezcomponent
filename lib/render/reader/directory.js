var fs = require('fs'),
    path = require('path'),
    ex = []
function buildItemArray(path, extensions) {
    if(typeof extensions === "string") {
        ex.push(extensions)
    } else {
        ex = extensions
    }
    var arr = []
    walkSync(path, function(e){arr.push(e)})
    return arr
}
function walkSync(currentDirPath, callback) {
    fs.readdirSync(currentDirPath).forEach(function (name) {
        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile()) {
            if(ex.indexOf(path.extname(filePath)) !== -1) {
                callback(filePath, stat);
            }
        } else if (stat.isDirectory()) {
            walkSync(filePath, callback);
        }
    });
}

exports.run = buildItemArray