//priority: 100

global.queueRecipe.compacting = (recipe) => {
    let recipeObject = {
        "type": "create:compacting",
        "ingredients": [],
        "results": []
    }
    let recipeKeys = Object.keys(recipe)
    let recipeId
    if (recipeKeys.includes("id")) {
        recipeId = recipe.id
    } else {
        recipeId = `kubejs:compacting_${stringHelper.removeNamespace(recipe.result)}`
    }
    if (recipeKeys.includes("heatRequirement")) {
        recipeObject.heat_requirement = recipe.heatRequirement
    }
    if (recipeKeys.includes("ingredients")) {
        recipeObject.ingredients = recipeObject.ingredients.concat(recipeHelper.itemIngredientArray(recipe.ingredients))
    }
    if (recipeKeys.includes("fluidIngredients")) {
        recipeObject.ingredients = recipeObject.ingredients.concat(recipeHelper.fluidIngredientArray(recipe.fluidIngredients))
    }
    if (recipeKeys.includes("results")) {
        recipeObject.results = recipeObject.results.concat(recipeHelper.itemResultArray(recipe.results))
    }
    if (recipeKeys.includes("fluidResults")) {
        recipeObject.results = recipeObject.results.concat(recipeHelper.fluidResultArray(recipe.fluidResults))
    }
    global.queueRecipe.custom(recipeObject, recipeId)
}

global.queueRecipe.deploying = (recipe) => {
    let recipeKeys = Object.keys(recipe)
    let recipeId
    let recipeObject = {
        "type": "create:deploying",
        "ingredients": [
            recipeHelper.itemIngredient(recipe.ingredient),
            recipeHelper.itemIngredient(recipe.tool)
        ],
        "results": [
            recipeHelper.itemResult(recipe.result)
        ]
    }
    if (recipeKeys.includes("id")) {
        recipeId = recipe.id
    } else {
        recipeId = `kubejs:deploying_${stringHelper.removeNamespace(recipe.result)}_from_${stringHelper.removeNamespace(recipe.ingredient)}_using_${stringHelper.removeNamespace(recipe.tool)}`
    }
    if (recipeKeys.includes("keepHelpItem")) {
        recipeObject.keep_help_item = recipe.keepHeldItem
    }
    global.queueRecipe.custom(recipeObject, recipeId)
}

global.queueRecipe.filling = (recipe) => {
    let recipeKeys = Object.keys(recipe)
    let recipeId
    let recipeObject = {
        "type": "create:filling",
        "ingredients": [
            recipeHelper.itemIngredient(recipe.ingredient),
            recipeHelper.fluidIngredient(recipe.fluid)
        ],
        "results": [
            recipeHelper.itemResult(recipe.result)
        ]
    }
    if (recipeKeys.includes("id")) {
        recipeId = recipe.id
    } else {
        recipeId = `kubejs:filling_${stringHelper.removeNamespace(recipe.result)}_from_${stringHelper.removeNamespace(recipe.ingredient)}_using_${stringHelper.removeNamespace(recipe.fluid[0])}`
    }
    global.queueRecipe.custom(recipeObject, recipeId)
}

global.queueRecipe.mixing = (recipe) => {
    let recipeObject = {
        "type": "create:mixing",
        "ingredients": [],
        "results": []
    }
    let recipeKeys = Object.keys(recipe)
    let recipeId
    if (recipeKeys.includes("id")) {
        recipeId = recipe.id
    } else {
        recipeId = `kubejs:mixing_${stringHelper.removeNamespace(recipe.result)}`
    }
    if (recipeKeys.includes("heatRequirement")) {
        recipeObject.heat_requirement = recipe.heatRequirement
    }
    if (recipeKeys.includes("ingredients")) {
        recipeObject.ingredients = recipeObject.ingredients.concat(recipeHelper.itemIngredientArray(recipe.ingredients))
    }
    if (recipeKeys.includes("fluidIngredients")) {
        recipeObject.ingredients = recipeObject.ingredients.concat(recipeHelper.fluidIngredientArray(recipe.fluidIngredients))
    }
    if (recipeKeys.includes("results")) {
        recipeObject.results = recipeObject.results.concat(recipeHelper.itemResultArray(recipe.results))
    }
    if (recipeKeys.includes("fluidResults")) {
        recipeObject.results = recipeObject.results.concat(recipeHelper.fluidResultArray(recipe.fluidResults))
    }
    global.queueRecipe.custom(recipeObject, recipeId)
}

global.queueRecipe.pressing = (recipe) => {
    let recipeKeys = Object.keys(recipe)
    let recipeId
    let recipeObject = {
        "type": "create:pressing",
        "ingredients": [
            recipeHelper.itemIngredient(recipe.ingredient)
        ],
        "results": [
            recipeHelper.itemResult(recipe.result)
        ]
    }
    if (recipeKeys.includes("id")) {
        recipeId = recipe.id
    } else {
        recipeId = `kubejs:pressing_${stringHelper.removeNamespace(recipe.result)}_from_${stringHelper.removeNamespace(recipe.ingredient)}`
    }
    global.queueRecipe.custom(recipeObject, recipeId)
}