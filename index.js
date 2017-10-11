#!/usr/bin/env node

var userPath = process.cwd();
const { exec } = require('child_process');

var himalaya = require('himalaya'),
    fs = require('fs'),
    render = require('./lib/renderer.js').run,
    reader = require('./lib/render/reader/read.js')

var config = reader.json(userPath+"/jcb.json")
var userPackage = reader.json(userPath+"/package.json")
console.log(userPackage)
var templateDir = userPath+"/"+config.templates

var jhcrPath = __dirname+"/lib/"
console.log(jhcrPath)
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
        if(!currentComponent) return
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
        }
    }
}
function initBuild() {
    var templates = reader.dir(templateDir, '.html')
    templates.forEach(compileHtml)
    saveConfig(component)

}
initBuild()
function formatToConfig(node, parent) {
    render(node, parent, component[currentComponent])
}

function saveConfig (str) {
    var dest = userPath+"/dist",
        build = fs.readFileSync(jhcrPath+'jhcr.js' , { encoding: 'utf8' })
    build += "jhcr.html.register(" + JSON.stringify(str, null, 4) +")"
    // build += "jhcr.html.register(" + JSON.stringify(str) +")".replace(/(\r\n|\n|\r)/gm,"")
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest,'0777', true);
    }
    fs.writeFile(dest+"/build.js", build, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("done!");
    }); 
}

function watchChanges() {
    fs.watch(jhcrPath, { encoding: 'buffer' }, (eventType, filename) => {
        compileHtml('./test.html')
    });
}