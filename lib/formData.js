function formData(model, obj) {
    var modelData = obj
    model.forEach(function(element) {
        if(element.tagName) {
            if(!modelData[element.tagName]) modelData[element.tagName] = {}
            modelData[element.tagName] = formData(element.children, modelData[element.tagName])
        } else if(element.type === "Text") {
            modelData = element.content
        }
    });
    // modelData = model
    return Object.keys(modelData).length > 0 ? modelData : ""
}


exports.run = formData