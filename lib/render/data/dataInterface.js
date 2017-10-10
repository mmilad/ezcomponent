var lastConfig
function buildData(data, component) {
    data = cleanData(data)
    component.interface = dataInterface(data, component)
    
}

function cleanData(data) {
    let newData = data.filter( e => !!e.tagName)
    return newData.length ? newData : data
}
function dataInterface(data) {
    let dif = {}, type, item
    data.forEach(i => {
        type = getTypeOf[i.type.toLowerCase()](i)
        if((type === "object") || (type === "string") || (type === "array")) {
            lastConfig = dif[i.tagName] = {type: type}
            item = i.children.length ? dataInterface(i.children) : ''
            if(type === "array") {
                dif[i.tagName].item = item
                // dif[i.tagName].item.push(item)
            } else {
                dif[i.tagName].item = item
            }
        } else {
            dif = i.content
        }

        // dif[i.tagName] = {type: type, item: {}}
        // setInterfaceOf[type](i, dif[i.tagName])    
    });
    return dif
}


var getTypeOf = {
    element: (i) => {
        if(i.attributes.type) {
            return i.attributes.type
        } else if(i.children.filter( e => !!e.tagName).length) {
            return "object"
        } else {
            return "string"
        }
    },
    text: (i) => {
        return "text"
    },
}

var setInterfaceOf = {
    array: (data, mod) => {
        data.children.forEach( i => {
            setInterfaceOf[getTypeOf[i.type.toLowerCase()](i)](i, mod.item[data.tagName])   
        })
    },
    object: (data, mod) => {
        
        data.children.forEach( i => {
            setInterfaceOf[getTypeOf[i.type.toLowerCase()](i)](i, mod.item[data.tagName])   
        })
    },
    string: (data, mod) => {
        mod.type = "string"
        mod.item = data.content
    }
}

exports.run = buildData