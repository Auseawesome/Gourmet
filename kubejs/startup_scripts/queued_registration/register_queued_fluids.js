// priority: -1000

StartupEvents.registry("fluid", event => {
    Object.keys(global.fluids).forEach(id => {
        let fluid = global.fluids[id]
        let fluidBuilder = event.create(id, fluid.type).tint(fluid.tint)
        if (!fluid.bucket) {
            fluidBuilder.noBucket()
        }
        if (!fluid.block) {
            fluidBuilder.noBlock()
        }
    })
})