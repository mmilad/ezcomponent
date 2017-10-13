var directiveList = require('./directives.js').run.listOfDirectives
var specialHandlers = {
    classname: function(a, b) {
        a.class = b
    }
}
function renderAttributes(attributes, config) {
    for(let a in attributes) {
        if(directiveList.indexOf(a) === -1) {
            if(a === "dataset") {
                for(let d in attributes[a]) {
                    config.attributes["data-"+d] = attributes[a][d]
                }
            } else {
                if(specialHandlers[a.toLowerCase()]) {
                    specialHandlers[a.toLowerCase()](config.attributes, attributes[a])
                } else {
                    config.attributes[a] = attributes[a]
                }
            }
        }
    }
}


exports.run = renderAttributes