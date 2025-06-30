// priority: 100

global.queueTooltip = {}
global.tooltips = {}

global.tooltips.basic = {}

global.queueTooltip.basic = (id, tooltip) => {
    global.tooltips.basic[id] = tooltip
}