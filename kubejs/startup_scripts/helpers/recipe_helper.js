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

global.recipeHelper.result = (id) => {
    return {
        "id": id
    }
}

global.recipeHelper.resultArray = (idArray) => {
    return idArray.map(global.recipeHelper.result)
}

global.recipeHelper.fluidIngredient = (ingredient) => {
    if (ingredient[0].startsWith("#")) {
        return {
            "type": "fluid_tag",
            "amount": ingredient[1],
            "fluid_tag": ingredient[0]
        }
    } else {
        return {
            "type": "fluid_stack",
            "amount": ingredient[1],
            "fluid": ingredient[0]
        }
    }
}

global.recipeHelper.fluidIngredientArray = (ingredientArray) => {
    return ingredientArray.map(global.recipeHelper.fluidIngredient)
}

global.recipeHelper.fluidResult = (result) => {
    return {
        "amount": result[1],
        "id": result[0]
    }
}

global.recipeHelper.fluidResultArray = (resultArray) => {
    return resultArray.map(global.recipeHelper.fluidResult)
}