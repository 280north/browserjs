var File = require("file"),
    Timeout = require("./timeout"),
    DOMParser = require("./dom").DOMParser;
    
var debug = true;
var parser = new DOMParser();

var XMLHttpRequest = exports.XMLHttpRequest = function()
{
    this.readyState     = 0;
    this.responseText   = "";
    this.responseXML    = null;
    this.status         = null;
    this.statusText     = null;
    
    this.onreadystatechange = null;
    
    this.method         = null;
    this.url            = null;
    this.async          = null;
    this.username       = null;
    this.password       = null;
}

XMLHttpRequest.prototype.abort = function()
{
    this.readyState = 0;
}

XMLHttpRequest.prototype.open = function(method, url, async, username, password)
{
    this.readyState = 1;

    this.method     = method;
    this.url        = url;
    this.async      = async;
    this.username   = username;
    this.password   = password;
}

XMLHttpRequest.prototype.send = function(body)
{
    this.readyState = 3;
    
    this.responseText = "";
    this.responseXML = null;
    
    try
    {
        // TODO: actual HTTP requests
        this.responseText = File.read(this.url).toString("UTF-8"); // FIXME: should we really assume this is UTF-8?
        system.log.debug("xhr response:  " + this.url + " (length="+this.responseText.length+")");
    }
    catch (e)
    {
        system.log.debug("xhr exception: " + this.url);
        this.responseText = "";
        this.responseXML = null;
    }    
    
    if (this.responseText.length > 0)
    {
        try
        {
            this.responseXML = parser.parseFromString(this.responseText);
        }
        catch (e)
        {
            this.responseXML = null;
        }
        this.status = 200;
    }
    else {
        system.log.debug("xhr empty:     " + this.url);
        this.status = 404;
    }
    
    this.readyState = 4;
    
    if (this.onreadystatechange)
    {
         if (this.async)
             Timeout.setTimeout(this.onreadystatechange, 0);
         else
             this.onreadystatechange();
    }
}

XMLHttpRequest.prototype.getResponseHeader = function(header)
{
    return (this.readyState < 3) ? "" : "";
}

XMLHttpRequest.prototype.getAllResponseHeaders = function()
{
    return (this.readyState < 3) ? null : "";
}

XMLHttpRequest.prototype.setRequestHeader = function(name, value)
{
}
