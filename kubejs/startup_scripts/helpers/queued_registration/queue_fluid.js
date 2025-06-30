// priority: 100

global.queueFluid = {}
global.fluids = {}

global.queueFluid.basic = (id, type, tint) => {
    global.fluids[id] = {
        "type": type,
        "tint": tint,
        "bucket": false,
        "block": false,
    }
}