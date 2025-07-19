//priority: 50

global.queueRecipe.automatableJuicing = (recipe) => {
    let juicingId
    let compactingId
    if (Object.keys(recipe).includes("id")) {
        juicingId = stringHelper.getNamespace(recipe.id) + ":juicing_" + stringHelper.removeNamespace(recipe.id)
        compactingId = stringHelper.getNamespace(recipe.id) + ":compacting_" + stringHelper.removeNamespace(recipe.id)
    } else {
        juicingId = `kubejs:juicing_${stringHelper.removeNamespace(recipe.primary)}_and_${stringHelper.removeNamespace(recipe.secondary)}_into_${stringHelper.removeNamespace(recipe.container)}`
        compactingId = `kubejs:compacting_${stringHelper.removeNamespace(recipe.primary)}_and_${stringHelper.removeNamespace(recipe.secondary)}_to_${stringHelper.removeNamespace(recipe.fluidResult)}`
    }
    global.queueRecipe.juicing({
        "id": juicingId,
        "primary": recipe.primary,
        "secondary": recipe.secondary,
        "container": recipe.container,
        "result": recipe.result
    })
    global.queueRecipe.compacting({
        "id": compactingId,
        "ingredients": [recipe.primary, recipe.secondary],
        "fluidResults": [recipe.fluidResult]
    })
}

global.queueRecipe.automatableCooking = (recipe) => {
    let recipeKeys = Object.keys(recipe)

    let cookingRecipe = {
        "ingredients": [],
        "result": recipe.result
    }
    let mixingRecipe = {
        "heatRequirement": "heated"
    }

    if (recipeKeys.includes("id")) {
        cookingRecipe.id = `${stringHelper.getNamespace(recipe.id)}:manual_cooking_${stringHelper.removeNamespace(recipe.id)}`
        mixingRecipe.id = `${stringHelper.getNamespace(recipe.id)}:mixing_cooking_${stringHelper.removeNamespace(recipe.id)}`
    } else {
        cookingRecipe.id = `kubejs:manual_cooking_${stringHelper.removeNamespace(recipe.result)}`
        mixingRecipe.id = `kubejs:mixing_cooking_${stringHelper.removeNamespace(recipe.result)}`
    }
    if (recipeKeys.includes("container")) {
        cookingRecipe.container = recipe.container
    }
    if (recipeKeys.includes("ingredients")) {
        cookingRecipe.ingredients = cookingRecipe.ingredients.concat(recipe.ingredients)
        mixingRecipe.ingredients = recipe.ingredients
    }
    if (recipeKeys.includes("containerIngredients")) {
        cookingRecipe.ingredients = cookingRecipe.ingredients.concat(recipe.containerIngredients)
    }
    if (recipeKeys.includes("fluidIngredients")) {
        mixingRecipe.fluidIngredients = recipe.fluidIngredients
    }
    // Make mixing result fluid if possible
    if (recipeKeys.includes("fluidResult")) {
        mixingRecipe.fluidResults = [recipe.fluidResult]
    } else {
        mixingRecipe.results = [recipe.result]
    }

    global.queueRecipe.cooking(cookingRecipe)
    global.queueRecipe.mixing(mixingRecipe)
}