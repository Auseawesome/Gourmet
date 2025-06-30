//priority: 1000

global.recipeHelper = {}

global.recipeHelper.itemOrTag = (id) => {
    if (id.startsWith("#")) {
        return {
            "tag": id.slice(1, id.length)
        }
    } else {
        return {
            "item": id
        }
    }
}

global.recipeHelper.itemOrTagArray = (idArray) => {
    return idArray.map(global.recipeHelper.itemOrTag)
}