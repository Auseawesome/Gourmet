//priority: 1000

global.recipeHelper = {}

global.recipeHelper.itemIngredient = (ingredient) => {
    if (ingredient.startsWith("#")) {
        return {
            "tag": ingredient.slice(1, ingredient.length)
        }
    } else {
        return {
            "item": ingredient
        }
    }
}

global.recipeHelper.itemIngredientArray = (ingredientArray) => {
    return ingredientArray.map(global.recipeHelper.itemIngredient)
}

global.recipeHelper.itemResult = (result) => {
    return {
        "id": result
    }
}

global.recipeHelper.itemResultArray = (resultArray) => {
    return resultArray.map(global.recipeHelper.itemResult)
}

global.recipeHelper.fluidIngredient = (ingredient) => {
    if (ingredient[0].startsWith("#")) {
        return {
            "type": "fluid_tag",
            "amount": ingredient[1],
            "fluid_tag": ingredient[0].slice(1, ingredient[0].length)
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