// priority: -1000

StartupEvents.registry("fluid", event => {
    Object.keys(global.fluids).forEach(id => {
        let fluid = global.fluids[id]
        let fluid_builder = event.create(id, fluid.type).tint(fluid.tint)
        if (!fluid.bucket) {
            fluid_builder.noBucket()
        }
        if (!fluid.block) {
            fluid_builder.noBlock()
        }
    })
})