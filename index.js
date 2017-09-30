var himalaya = require('himalaya'),
    fs = require('fs'),
    formData = require('./lib/formData.js').formData

var component = {}
var currentComponent = ""
function compileHtml(file) {
var html = fs.readFileSync(file , { encoding: 'utf8' })
    html = html.replace(/\n/g, '');
    html = html.replace(/\r/g, '');
    html = html.replace(/\t/g, '');
    html = html.replace(/  /g, '');
    
    var json = himalaya.parse(html)
 
    if(json[0].tagName === "component") {
        currentComponent = json[0].attributes.name
        if(json[0].attributes) {
            if(!component[currentComponent]) {
                component[currentComponent] = {}
            }
            component[currentComponent].tpl = []
            if(json[0].children) {
                json[0].children.forEach(e => {
                    formatToConfig(e, component[currentComponent].tpl)
                })
            }

            saveConfig(component)
        }
    }
}

compileHtml('./test.html')
function formatToConfig(node, parent) {
    if(node.tagName === "data-model") {
        var x = formData(node.children, {})
        console.dir(x, { depth: null })
        component[currentComponent].data = formData(node.children, {})
        return
    }

    var config = {
        attributes: {},
        children: []
    }

    if(node.attributes) {
        for(let a in node.attributes) {
            if(a === "dataset") {
                for(let d in node.attributes[a]) {
                    config.attributes["data-"+d] = node.attributes[a][d]
                }
            } else {
                config.attributes[a] = node.attributes[a]
            }
        }
    }

    if (node.tagName) {
        config.tag = node.tagName;
    }

    if(node.children) {
        node.children.forEach(e => {
            formatToConfig(e, config.children)
        });
    }

    parent.push(config)
}

function saveConfig (str) {
    var build = fs.readFileSync('./lib/jhcr.js' , { encoding: 'utf8' })
    build += "J.html.registry = " + JSON.stringify(str)
    fs.writeFile("./renderedConfig.js", build, function(err) {
        if(err) {
            return console.log(err);
        }
    
        console.log("The file was saved!");
    }); 
}