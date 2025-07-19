//priority: 1000

global.recipeHelper = {}

global.recipeHelper.itemIngredient = (id) => {
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

global.recipeHelper.itemIngredientArray = (idArray) => {
    return idArray.map(global.recipeHelper.itemIngredient)
}

global.recipeHelper.itemResult = (id) => {
    return {
        "id": id
    }
}

global.recipeHelper.itemResultArray = (idArray) => {
    return idArray.map(global.recipeHelper.itemResult)
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