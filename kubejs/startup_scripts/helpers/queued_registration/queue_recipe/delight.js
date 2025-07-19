//priority: 100


// Special recipes

global.specialRecipes.preparationConsume = {}

global.queueRecipe.preparationConsume = (recipe) => {
    if (!Object.keys(global.specialRecipes.preparationConsume).includes(recipe.tool)) {
        global.specialRecipes.preparationConsume[recipe.tool] = {}
    }

    let recipeObject = {}
    if (Object.keys(recipe).includes("toolResult")) {
        recipeObject.toolResult = recipe.toolResult
    }
    
    global.specialRecipes.preparationConsume[recipe.tool][recipe.ingredient] = recipeObject
}

// JSON recipes
global.queueRecipe.preparation = (recipe) => {
    if (!Object.keys(recipe).includes("id")) {
        recipe.id = `preparing_${stringHelper.removeNamespace(recipe.result)}_from_${stringHelper.removeNamespace(recipe.ingredient)}_using_${stringHelper.removeNamespace(recipe.tool)}`
    }
    global.recipes[recipe.id] = {
        "type": "farmersdelight:cutting",
        "ingredients": [
            {
                "item": recipe.ingredient
            }
        ],
        "result": [
            {
                "item": {
                    "count": 1,
                    "id": recipe.result
                }
            }
        ],
        "tool": recipeHelper.itemIngredient(recipe.tool),
    }
}

global.queueRecipe.juicing = (recipe) => {
    if (!Object.keys(recipe).includes("id")) {
        recipe.id = `juicing_${stringHelper.removeNamespace(recipe.primary)}_with_${stringHelper.removeNamespace(recipe.secondary)}_into_${stringHelper.removeNamespace(recipe.container)}`
    }
    global.recipes[recipe.id] = {
        "type": "expandeddelight:juicing",
        "container": {
            "count": 1,
            "id": recipe.container
        },
        "experience": 0.0,
        "ingredients": [
            recipeHelper.itemIngredient(recipe.primary),
            recipeHelper.itemIngredient(recipe.secondary)
        ],
        "result": {
            "count": 1,
            "id": recipe.result
        }
    }
}