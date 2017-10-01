var x = 0
function buildDataInterface(data) {
    let dif = {}
    data.forEach(i => {
        setInterfaceOf[getTypeOf[i.type.toLowerCase()](i)](i, dif)    
    });
    return dif.items
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
        mod.items = {}
        mod.items[data.tagName] = {
            type: "array"
        }
        data.children.forEach( i => {
            setInterfaceOf[getTypeOf[i.type.toLowerCase()](i)](i, mod.items[data.tagName])   
        })
    },
    object: (data, mod) => {
        mod.items = {}
        mod.items[data.tagName] = {
            type: "object"
        }
        data.children.forEach( i => {
            setInterfaceOf[getTypeOf[i.type.toLowerCase()](i)](i, mod.items[data.tagName])   
        })
    },
    text: (data, mod) => {
        mod.type = "string"
        mod.value = data.content
        // console.log(data, mod, "now")
    }
}

exports.run = buildDataInterface