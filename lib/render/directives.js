var directives = {
    for: require('./directives/for.js').run,
    if: require('./directives/if.js').run
}
directives.listOfDirectives = Object.keys(directives)
exports.run = directives