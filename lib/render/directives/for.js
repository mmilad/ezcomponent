function renderFor(condition, config) {
    var c = condition.split(" as ")
    config.for = {
        alias: c[0],
        data: c[1],
        in: false
    }
}
    
    
exports.run = renderFor