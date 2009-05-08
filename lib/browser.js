var window = exports.window = require("./browser/window");

for (var property in window) {
    if (global[property] === undefined)
        global[property] = window[property];
    else
        system.log.warn("global clash");
}
