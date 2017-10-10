var render = {
    attributes: require('./render/attributes.js').run,
    interface: require('./render/data/dataInterface.js').run,
    directives: require('./render/directives.js').run
}
var directiveList = render.directives.listOfDirectives
function renderElement(element, parentsChildList, component) {

    if(element.tagName === "set-data") {
        render.interface(element.children, component)
        return
    }
    if(element.type === "Element") {
        let config = {
            attributes: {},
            children: []
        },
        placeHolder = false

        config.tag = element.tagName;
        render.attributes(element.attributes, config)

        element.children.forEach(e => {
            renderElement(e, config.children, component)
        });

        for(let a in element.attributes) {
            if(directiveList.indexOf(a) !== -1) {
                render.directives[a](element.attributes[a], config)
                placeHolder = true
            }
        }
        if(placeHolder) {
            parentsChildList.push({ tag: "placeHolder", tpl: config })
        } else {
            parentsChildList.push(config)
        }
    } else if (element.type === "Text") {

        let content = element.content.split(/(\{\{[^}]+}})/).filter(Boolean);
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
            parentsChildList.push(textNode)
        })
        
    }
}



function init() {

}

exports.run = renderElement