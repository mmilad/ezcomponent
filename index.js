var himalaya = require('himalaya'),
    fs = require('fs'),
    // formData = require('./lib/formData.js').run,
    // interfacer = require('./lib/buildDataInterface.js').run,
    // renderFor = require('./lib/directives/for.js').run,
    // directives = require('./lib/directives.js').run,
    render = require('./lib/renderer.js').run
var jhcrPath = './jhcrts/dist/jhcr.js'
var args = process.argv.slice(2)
var component = {}
var currentComponent = ""
function compileHtml(file) {
var html = fs.readFileSync(file , { encoding: 'utf8' })
    html = html.replace(/\n/g, '');
    html = html.replace(/\r/g, '');
    html = html.replace(/\t/g, '');
    html = html.replace(/  /g, '');
    
    var json = himalaya.parse(html)

    // testSave ("var x =" + JSON.stringify(json, null, 4))
    // console.dir(json, {depth:null})
    if(json[0].tagName === "component") {
        currentComponent = json[0].attributes.name
        if(json[0].attributes) {
            if(!component[currentComponent]) {
                component[currentComponent] = {data:{}}
            }
            component[currentComponent].tpl = {children:[]}
            if(json[0].children) {
                json[0].children.forEach(e => {
                    formatToConfig(e, component[currentComponent].tpl.children)
                })
            }
            saveConfig(component)
        }
    }
}

function formatToConfig(node, parent) {
    render(node, parent, component[currentComponent])
}

function saveConfig (str) {
    var build = fs.readFileSync(jhcrPath , { encoding: 'utf8' })
    build += "jhcr.html.register(" + JSON.stringify(str, null, 4) +")"

    // build = JSON.stringify(str, null, 4)
    // build = JSON.stringify(str)
    fs.writeFile("./dist/build.js", build, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 
}

function testSave (str) {
    fs.writeFile("./dist/testSave.js", str, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 
}
// if(args.lastIndexOf)

function watchChanges() {
    fs.watch(jhcrPath, { encoding: 'buffer' }, (eventType, filename) => {
        compileHtml('./test.html')
    });
}
if(args.indexOf('--watch') !== -1) {
    watchChanges()
} else {
    compileHtml('./test.html')
}
console.log(args)