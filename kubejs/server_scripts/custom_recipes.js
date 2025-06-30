/**
 * Returns the namespace of an id
 * @param {String} id 
 * @returns {String}
 */
function getNamespace(id) {
    return id.split(":")[0]
}

/**
 * Returns the id without the namespace
 * @param {String} id 
 * @returns {String}
 */
function removeNamespace(id) {
    return id.split(":")[1]
}

ServerEvents.recipes(event => {
    /**
     * Creates recipes for emptying and filling container with given amount of fluid
     * @param {Special.Fluid} fluid 
     * @param {Special.Item} container 
     * @param {Special.Item} full_container 
     * @param {Number} amount 
     */
    function fluid_storage(fluid, container, full_container, amount) {
        event.custom({
            "type": "create:filling",
            "ingredients": [
                {
                    "item": container
                },
                {
                    "type": "fluid_stack",
                    "amount": amount,
                    "fluid": fluid,
                }
            ],
            "results": [
                {
                    "id": full_container
                }
            ]
        }).id(`filling_${removeNamespace(container)}_with_${removeNamespace(fluid)}`)
        event.custom({
            "type": "create:emptying",
            "ingredients": [
                {
                    "item": full_container
                }
            ],
            "results": [
                {
                    "id": container
                },
                {
                    "amount": amount,
                    "id": fluid
                }
            ]
        }).id(`emptying_${removeNamespace(full_container)}`)
    }
    /**
     * Creates recipes for emptying and filling a bottle
     * @param {Special.Fluid} fluid 
     * @param {Special.Item} full_container
     */
    function bottle_fluid(fluid, full_container) {
        fluid_storage(fluid, "minecraft:glass_bottle", full_container, 250)
    }
    /**
     * Creates recipes for emptying and fitting a bowl
     * @param {Special.Fluid} fluid 
     * @param {Special.Item} full_container 
     */
    function bowl_fluid(fluid, full_container) {
        fluid_storage(fluid, "minecraft:bowl", full_container, 250)
    }
    /**
     * Creates recipes for emptying and fitting a bowl
     * @param {Special.Fluid} fluid 
     * @param {Special.Item} full_container 
     */
    function bucket_fluid(fluid, full_container) {
        fluid_storage(fluid, "minecraft:bucket", full_container, 1000)
    }

    event.custom({
        "type": "create:pressing",
        "ingredients": [
            {
                "item": "minecraft:beef"
            }
        ],
        "results": [
            {
                "id": "farmersdelight:minced_beef",
                "count": 2
            }
        ]
    })
    bottle_fluid("kubejs:ketchup", "kubejs:ketchup_bottle")
})