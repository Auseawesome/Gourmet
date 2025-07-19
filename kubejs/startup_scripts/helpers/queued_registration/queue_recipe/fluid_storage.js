//priority: 50

global.queueRecipe.fluidStorage = (fluid, container, fullContainer, amount) => {
    global.queueRecipe.filling({
        "id": `kubejs:filling_${stringHelper.removeNamespace(container)}_with_${stringHelper.removeNamespace(fluid)}`,
        "ingredient": container,
        "fluid": [fluid, amount],
        "result": fullContainer
    })
    global.queueRecipe.emptying({
        "ingredient": fullContainer,
        "fluid":  [fluid, amount],
        "result": container,
    })
}

global.queueRecipe.bottleFluid = (fluid, fullContainer) => {
    global.queueRecipe.fluidStorage(fluid, "minecraft:glass_bottle", fullContainer, 250)
}

global.queueRecipe.bowlFluid = (fluid, fullContainer) => {
    global.queueRecipe.fluidStorage(fluid, "minecraft:bowl", fullContainer, 250)
}

global.queueRecipe.bucketFluid = (fluid, fullContainer) => {
    global.queueRecipe.fluidStorage(fluid, "minecraft:bucket", fullContainer, 1000)
}