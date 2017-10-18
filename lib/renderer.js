var render = {
    attributes: require('./render/attributes.js').run,
    interface: require('./render/data/dataInterface.js').run,
    directives: require('./render/directives.js').run
}
var directiveList = render.directives.listOfDirectives
function renderElement(element, parentsChildList, component, inFor) {

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


        for(let a in element.attributes) {
            if(directiveList.indexOf(a) !== -1) {
                render.directives[a](element.attributes[a], config)
                placeHolder = true
            }
        }
        if(placeHolder) {
            parentsChildList.push({ tag: "placeHolder", tpl: config, html: "plazehodler" })
        } else {
            parentsChildList.push(config)
        }
        
        element.children.forEach(e => {
            renderElement(e, config.children, component, (config.for ? config.for.alias : false))
        });
    } else if (element.type === "Text") {

        let content = element.content.split(/(\{\{[^}]+}})/).filter(Boolean);
        content.forEach(e => {
            let str = e, textNode = {
                tag: "textNode"
            }
            if(str.match(/{{(.*?)}}/)) {
                str = str.replace(/{{|}}|\s/g, "")
                // if(inFor && str.substring(0, inFor.length) === inFor) {
                //     textNode.forBinds = [{
                //         property: "nodeValue",
                //         data: str.replace(inFor + ".", "")
                //     }]
                // } else {
                    textNode.binds = [{
                        property: "nodeValue",
                        value: str
                    }]
                // }
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