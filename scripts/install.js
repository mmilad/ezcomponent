#!/usr/bin/env node

var jcbPath = __dirname
var reader = require('./../lib/render/reader/read.js'),
    fs = require('fs')
console.log("start install")
var userPath = process.cwd()+"/../..";
userPackage = reader.json(userPath+"/package.json")
console.log(userPackage)
if(userPackage) {
    if(!userPackage.scripts) {userPackage.scripts = {}}
    if(!userPackage.scripts.jcb) {
        userPackage.scripts.jcb = __dirname+"/cli.js"
        // console.log(userPackage)
    } 
    fs.writeFile(userPath+"/package.json", JSON.stringify(userPackage, null, 4), function(err) {
        if(err) {
            return console.log(err);
        }
        var newPack = reader.json(userPath+"/package.json")
        // console.log(newPack)
        console.log("settings in package done!");
    }); 
} else {
    console.log("no package defined")
}