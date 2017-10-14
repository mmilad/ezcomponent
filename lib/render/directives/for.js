function renderFor(condition, config) {
    var c = condition.split(" as ")

    config.for = {
        alias: condition[0],
        data: condition[1],
        in: false
    }
    console.log(config)
}
    
    
exports.run = renderFor