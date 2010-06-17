browserjs
=========

BrowserJS is a CommonJS package that emulates portions of the browser JavaScript APIs.

Supported APIs
--------------

* XMLHttpRequest
* setTimeout, setInterval, clearTimeout, clearInterval
* console.log, error, warn, debug
* DOMParser and basic DOM operations (Rhino only)

Usage
-----

To get access to individual APIs, require the corresponding module. For example, if you just w

    var XMLHttpRequest = require("browser/xhr").XMLHttpRequest;
    
To get the "window" object, which contains all the APIs, require the "browser/window" module:

    var window = require("browser/window");

Use the properties of the window object directly:

    var request = new window.XMLHttpRequest();
    
Or you can bring all the properties of the "window" object into scope temporarily (without modifying the global scope) by using a with statement:

    with (window) {
        var request = new XMLHttpRequest();
    }

If you want to permanently modify the global scope to include all the properties of "window" in the global scope, simply require the "browser" module:

    require("browser")
