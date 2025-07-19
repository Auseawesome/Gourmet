//priority: 50

global.queueRecipe.assembly = (recipe) => {
    let deployingId
    let preparationId
    if (Object.keys(recipe).includes("id")) {
        deployingId = stringHelper.getNamespace(recipe.id) + ":deploying_" + stringHelper.removeNamespace(recipe.id)
        preparationId = stringHelper.getNamespace(recipe.id) + ":preparation_" + stringHelper.removeNamespace(recipe.id)
    } else {
        deployingId = `kubejs:deploying_${stringHelper.removeNamespace(recipe.tool)}_on_${stringHelper.removeNamespace(recipe.ingredient)}`
        preparationId = `kubejs:preparing_${stringHelper.removeNamespace(recipe.ingredient)}_with_${stringHelper.removeNamespace(recipe.tool)}`
    }
    global.queueRecipe.deploying({
        "ingredient": recipe.ingredient,
        "tool": recipe.tool,
        "result": recipe.result,
        "id": deployingId,
    })
    global.queueRecipe.preparation({
        "ingredient": recipe.ingredient,
        "tool": recipe.tool,
        "result": recipe.result,
        "id": preparationId,
    })
    // Make sure item gets consumed when assembling
    let consumeRecipe = {
        "tool": recipe.tool,
        "ingredient": recipe.ingredient,
    }
    if (Object.keys(recipe).includes("toolResult")) {
        consumeRecipe.toolResult = recipe.toolResult
    }
    
    global.queueRecipe.preparationConsume(consumeRecipe)
}

global.queueRecipe.fluidAssembly = (recipe) => {
    let fillingId
    if (Object.keys(recipe).includes("id")) {
        fillingId = stringHelper.getNamespace(recipe.id) + ":filling_" + stringHelper.removeNamespace(recipe.id)
    } else {
        fillingId = `kubes:spouting_${stringHelper.removeNamespace(recipe.fluid)}_on_${stringHelper.removeNamespace(recipe.ingredient)}`
    }
    let fillingRecipe = {
        "ingredient": recipe.ingredient,
        "fluid": recipe.fluid,
        "result": recipe.result,
        "id": fillingId,
    }
    if (Object.keys(recipe).includes("amount")) {
        fillingRecipe.amount = recipe.amount
    }
    global.queueRecipe.filling(fillingRecipe)
    let assemblyRecipe = {
        "ingredient": recipe.ingredient,
        "tool": recipe.container,
        "result": recipe.result,
    }
    if (Object.keys(recipe).includes("emptyContainer")) {
        assemblyRecipe.toolResult = recipe.emptyContainer
    }
    if (Object.keys(recipe).includes("id")) {
        assemblyRecipe.id = recipe.id
    }
    global.queueRecipe.assembly(assemblyRecipe)
}