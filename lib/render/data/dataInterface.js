var x = 0
function dataInterface(data, component) {
    let dif = {}
    data.forEach(i => {
        setInterfaceOf[getTypeOf[i.type.toLowerCase()](i)](i, dif)    
    });
    component.interface = dif.item
    return dif.item
}


var getTypeOf = {
    element: (i) => {
        if(i.attributes.type) {
            return i.attributes.type
        } else {
            return "object"
        }
    },
    text: (i) => {
        return "text"
    },
}

var setInterfaceOf = {
    array: (data, mod) => {
        mod.item = mod.item ? mod.item : {}
        mod.item[data.tagName] = {
            type: "array"
        }
        data.children.forEach( i => {
            setInterfaceOf[getTypeOf[i.type.toLowerCase()](i)](i, mod.item[data.tagName])   
        })
    },
    object: (data, mod) => {
        mod.item = mod.item ? mod.item : {}
        mod.item[data.tagName] = {
            type: "object"
        }
        data.children.forEach( i => {
            setInterfaceOf[getTypeOf[i.type.toLowerCase()](i)](i, mod.item[data.tagName])   
        })
    },
    text: (data, mod) => {
        mod.type = "string"
        mod.item = data.content
    }
}

exports.run = dataInterface