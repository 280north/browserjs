var Logger = require("logger").Logger;

var console = exports;

var consoleLogger = new Logger(system.stdout);

console.error = function() {
    consoleLogger.error.apply(consoleLogger, arguments);
}
console.warn = function() {
    consoleLogger.warn.apply(consoleLogger, arguments);
}
console.log = function() {
    consoleLogger.info.apply(consoleLogger, arguments);
}
console.info = function() {
    consoleLogger.info.apply(consoleLogger, arguments);
}
console.debug = function() {
    consoleLogger.debug.apply(consoleLogger, arguments);
}

console.setLogger = function(logger) {
    consoleLogger = logger;
}
console.setLevel = function(level) {
    consoleLogger.level = level;
}
