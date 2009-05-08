var window = exports;

window.window           = window;

window.DOMParser        = require("./dom").DOMParser;

window.XMLHttpRequest   = require("./xhr").XMLHttpRequest;

window.setTimeout       = require("./timeout").setTimeout;
window.setInterval      = require("./timeout").setInterval;
window.clearTimeout     = require("./timeout").clearTimeout;
window.clearInterval    = require("./timeout").clearInterval;

window.console          = require("./console");

window.alert            = function() { print.apply(null, arguments); }
window.prompt           = function() { print.apply(null, arguments); return ""; }
window.confirm          = function() { print.apply(null, arguments); return true; }

window.Image            = function() {};