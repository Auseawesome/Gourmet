ServerEvents.recipes(event => {
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
})