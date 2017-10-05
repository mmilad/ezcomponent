var himalaya = require('himalaya'),
    fs = require('fs'),
    formData = require('./lib/formData.js').run,
    interfacer = require('./lib/buildDataInterface.js').run

var component = {}
var currentComponent = ""
function compileHtml(file) {
var html = fs.readFileSync(file , { encoding: 'utf8' })
    html = html.replace(/\n/g, '');
    html = html.replace(/\r/g, '');
    html = html.replace(/\t/g, '');
    html = html.replace(/  /g, '');
    
    var json = himalaya.parse(html)
 
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

compileHtml('./test.html')
function formatToConfig(node, parent) {
    var config = {
        attributes: {},
        children: []
    }

    if(node.tagName === "set-data") {
        component[currentComponent].data = formData(node.children, {})
        component[currentComponent].interface = interfacer(node.children)
        return
    } else if(node.type === "Element") {
        if (node.tagName) {
            config.tag = node.tagName;
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
        }
        if(node.children) {
            node.children.forEach(e => {
                formatToConfig(e, config.children)
            });
        }

        parent.push(config)
    } else if (node.type === "Text") {
        config.tag = "textNode";
        config.html = node.content;
        let content = node.content.split(/(\{\{[^}]+}})/).filter(Boolean);
        content.forEach(e => {
            let str = e, textNode = {
                tag: "textNode"
            }
            if(str.match(/{{(.*?)}}/)) {
                str = str.replace(/{{|}}|\s/g, "")
                textNode.binds = [{
                    property: "nodeValue",
                    data: str
                }]
            } else {
                textNode.properties = {nodeValue: str}
            }
            parent.push(textNode)
        })

        // content.forEach((item, index) => {
        //     let str
        //     if(item.match(/{{(.*?)}}/)) {
        //         str = item.replace(/{{|}}|\s/g, "")
        //         let selectedData = that.getValueOf(str, dataModel)
        //         str = document.createTextNode(selectedData.value)
        //         selectedData.onSet.push(v => {str.nodeValue = v.value})
                
        //     } else {
        //         str = document.createTextNode(item)
        //     }
        //     if(index !== content.length) str.nodeValue += " " 
        //     elem.appendChild(str)
        // })

    }



}

function saveConfig (str) {
    var build = fs.readFileSync('./lib/jhcr.js' , { encoding: 'utf8' })
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