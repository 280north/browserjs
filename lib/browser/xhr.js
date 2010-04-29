var File = require("file"),
    IO = require("io").IO,
    URI = require("uri"),
    HashP = require("hashp").HashP,
    ByteString = require("binary").ByteString,
    DOMParser = require("./dom").DOMParser;

// http://www.w3.org/TR/XMLHttpRequest/

var parser = new DOMParser();

var UNSENT = 0,
    OPENED = 1,
    HEADERS_RECEIVED = 2,
    LOADING = 3,
    DONE = 4;

var XMLHttpRequest = exports.XMLHttpRequest = function()
{
    // onreadystatechange of type EventListener
    // This attribute is an event handler DOM attribute and must be invoked whenever a readystatechange event is targated at the object.
    this.onreadystatechange = null;

    // readyState of type unsigned short, readonly
    // On getting the attribute must return the value of the constant corresponding to the object's current state.
    this.readyState     = UNSENT;

    // responseText of type DOMString, readonly
    // On getting, the user agent must run the following steps:
    // 1. If the state is not LOADING or DONE return the empty string and terminate these steps.
    // 2. Return the text response entity body.
    this.responseText   = "";

    // responseXML of type Document, readonly
    // On getting, the user agent must run the following steps:
    // 1. If the state is not DONE return null and terminate these steps.
    // 2. Return the XML response entity body.
    this.responseXML    = null;

    // status of type unsigned short, readonly
    // On getting, if available, it must return the HTTP status code sent by the server (typically 200 for a successful request). Otherwise, if not available, the user agent must raise an INVALID_STATE_ERR exception.
    this.status         = null;

    // statusText of type DOMString, readonly
    // On getting, if available, it must return the HTTP status text sent by the server (appears after the status code). Otherwise, if not available, the user agent must raise an INVALID_STATE_ERR exception.
    this.statusText     = "";

    this._method        = null;
    this._url           = null;
    this._async         = null;
    this._user          = null;
    this._password      = null;

    this._requestHeaders    = {};
    this._responseHeaders   = {};

    this._responseBody      = null;
    this._errorFlag         = false;
    this._sendFlag          = false;
}

// open(method, url, async, user, password), method
XMLHttpRequest.prototype.open = function(method, url, async, user, password)
{
    // When invoked, the user agent must follow the following steps (unless otherwise indicated):

    // 1. Let stored method be the method argument.
    this._method = method;

    // 2. If stored method does not match the Method production, defined in section 5.1.1 of RFC 2616, raise a SYNTAX_ERR exception and terminate these steps. [RFC2616]
    if (typeof this._method !== "string" || !this._method.match(/^[A-Za-z]+$/))
        throw new Error("SYNTAX_ERR");

    // 3. If stored method case-insensitively matches CONNECT, DELETE, GET, HEAD, OPTIONS POST, PUT, TRACE, or TRACK let stored method be the canonical uppercase form of the matched method name.
    if (this._method.match(/^(CONNECT|DELETE|GET|HEAD|OPTIONS|POST|PUT|TRACE|TRACK)$/i))
        this._method = this._method.toUpperCase();

    // 4. If stored method is one of CONNECT, TRACE, or TRACK the user agent should raise a SECURITY_ERR exception and terminate these steps.
    if (this._method.match(/^(CONNECT|TRACE|TRACK)$/))
        throw new Error("SECURITY_ERR");

    var uri = URI.parse(url);

    if (!uri.scheme)
        uri.scheme = "file";

    // 5. Drop the fragment identifier (if any) from url and let stored url be the result of that operation.
    uri.fragment = null;

    // 6. If stored url is a relative reference resolve it using the current value of the baseURI attribute of the Document pointer. If this fails raise a SYNTAX_ERR exception and terminate these steps.
    if (uri.path === null)
        uri.path = "/";
    else if (uri.path.charAt(0) !== "/")
        uri.path = File.cwd() + "/" + uri.path;

    // 7. If stored url contains an unsupported scheme raise a NOT_SUPPORTED_ERR and terminate these steps.
    if (!(/https?|file/).test(uri.scheme))
        throw new Error("NOT_SUPPORTED_ERR");

    // 8. If the "user:password" format in the userinfo production defined in section 3.2.1 of RFC 3986 is not supported for the relevant scheme and stored url contains this format raise a SYNTAX_ERR and terminate these steps. [RFC3986]
    // 9. If stored url contains the "user:password" format let stored user be the user part and stored password be the password part.
    // 10. If stored url just contains the "user" format let stored user be the user part.
    if (uri.userinfo) {
        var components = uri.userinfo.split(":");
        if (components.length === 1)
            this._user = components[0];
        else if (components.length === 2) {
            this._user = components[0];
            this._password = components[1];
        }
    }

    // 11. If stored url is not of the same-origin as the origin of the Document pointer the user agent should raise a SECURITY_ERR exception and terminate these steps.
    // TODO?

    // 12. Let async be the value of the async argument or true if it was omitted.
    this._async = async === undefined ? true : async;

    // 13. If the user argument was not omitted, and its syntax does not match that specified by the relevant authentication scheme, raise a SYNTAX_ERR exception and terminate these steps.
    // 14. If the user argument was not omitted and is not null let stored user be user encoded using the encoding specified in the relevant authentication scheme or UTF-8 if the scheme fails to specify an encoding.
    // Note: This step overrides any user that may have been set by the url argument.
    // 15. If the user argument was not omitted and is null remove stored user.
    if (user !== undefined)
        this._user = user;


    // 16. If the password argument was not omitted and its syntax does not match that specified by the relevant authentication scheme raise a SYNTAX_ERR exception and terminate these steps.
    // 17. If the password argument was not omitted and is not null let stored password be password encoded using the encoding specified in the relevant authentication scheme or UTF-8 if the scheme fails to specify an encoding.
    // 18. If the password argument was not omitted and is null remove stored password.
    if (password !== undefined)
        this._password = password;

    this._url = uri.toString();

    // 19. Abort the send() algorithm, set response entity body to "null" and reset the list of request headers.
    this._requestHeaders = {};
    this._responseBody = null

    // 20. The user agent should cancel any network activity for which the object is responsible.
    // 21. Switch the object to the OPENED state, set the send() flag to "false" and then synchronously dispatch a readystatechange event on the object and return the method call.

    this.readyState = OPENED;
}

// setRequestHeader(header, value), method
// Each request has a list of request headers with associated values. The setRequestHeader() method can be used to manipulate those values and set new request headers.
// The setRequestHeader() method appends a value if the HTTP header given as argument is already part of the list of request headers.
XMLHttpRequest.prototype.setRequestHeader = function(header, value)
{
    // When invoked, the user agent must follow the following steps (unless otherwise indicated):

    // 1. If the state of the object is not OPENED raise an INVALID_STATE_ERR exception and terminate these steps.
    if (this.readyState !== OPENED)
        throw new Error("INVALID_STATE_ERR");

    // 2. If the send() flag is "true" raise an INVALID_STATE_ERR exception and terminate these steps.
    if (this._sendFlag)
        throw new Error("INVALID_STATE_ERR");

    // 3. If the header argument does not match the field-name production as defined by section 4.2 of RFC 2616 or is null raise a SYNTAX_ERR exception and terminate these steps. [RFC2616]
    if (typeof header !== "string") // FIXME
        return;

    // 4. If the value argument is null terminate these steps. (Do not raise an exception.)
    if (!value)
        return;

    // 5. If the value argument does not match the field-value production as defined by section 4.2 of RFC 2616 raise a SYNTAX_ERR and terminate these steps. [RFC2616]
    if (typeof value !== "string") // FIXME
        return;

    // 6. For security reasons, these steps should be terminated if the header argument case-insensitively matches one of the following headers:
    // 7. Also for security reasons, these steps should be terminated if the start of the header argument case-insensitively matches Proxy- or Sec-.
    //if (header.match(/(^(Proxy-|Sec-)|^(Accept-Charset|Accept-Encoding|Connection|Content-Length|Content-Transfer-Encoding|Date|Expect|Host|Keep-Alive|Referer|TE|Trailer|Transfer-Encoding|Upgrade|Via)$)/i))
    //    return;

    // 8. If the header argument is not in the list of request headers append the header with its associated value to the list and terminate these steps.
    // 9. If the header argument is in the list of request headers either use multiple headers, combine the values or use a combination of those (section 4.2, RFC 2616). [RFC2616]
    var values = HashP.get(this._requestHeaders, header);
    if (values)
        values.push(value);
    else
        HashP.set(this._requestHeaders, header, [value]);
}

var initSend = function(data){
    // When invoked, the user agent must follow the following steps (unless otherwise noted). Note that this algorithm might get aborted if the open() or abort() method is invoked. When the send() algorithm is aborted the user agent must terminate the algorithm after finishing the step it is on.

    // 1. If the state of the object is not OPENED raise an INVALID_STATE_ERR exception and terminate these steps.
    if (this.readyState !== OPENED)
        throw new Error("INVALID_STATE_ERR");

    // 2. If the send() flag is "true" raise an INVALID_STATE_ERR exception and terminate these steps.
    if (this._sendFlag)
        throw new Error("INVALID_STATE_ERR");

    // 3. If async is true set the send() flag to "true".
    if (this._async)
        this._sendFlag = true;

    // 4. If stored method is GET act as if the data argument is null.
    // If the data argument has not been omitted and is not null use it for the entity body as defined by section 7.2 of RFC 2616 observing the following rules: [RFC2616]
    if (this._method === "GET")
        data = null;

    return data;
}

function sendData(entityBody){
        // 5. Make a request to stored url, using HTTP method stored method, user stored user (if provided) and password stored password (if provided), taking into account the entity body, list of request headers and the rules listed directly after this set of steps.
    // 6. Synchronously dispatch a readystatechange event on the object.
    if (this.onreadystatechange)
        this.onreadystatechange();

    try {
        var uri = URI.parse(this._url);
        if (!uri.scheme || uri.scheme == "file") {
            // unclear whether plusses are reserved in the URI path
            //uri.path = decodeURIComponent(uri.path.replace(/\+/g, " "));
            if (this._method === "PUT") {
                if ((File.exists(uri.path) && File.isWritable(uri.path)) || File.path(uri.path).resolve('..').isWritable()) {
                    this.output = File.write(uri.path, entityBody || new ByteString(), { mode : "b" });
                    this.status = 201;
                } else {
                    this.status = 403;
                }
            } else if (this._method === "DELETE") {
                if (File.exists(uri.path)) {
                    if (File.path(uri.path).resolve('..').isWritable()) {
                        File.remove(uri.path);
                        this.status = 200;
                    } else {
                        this.status = 403;
                    }
                } else {
                    this.status = 404;
                }
            } else {
                if (File.exists(uri.path)) {
                    this.responseText = File.read(uri.path, { charset : "UTF-8" }); // FIXME: don't assume UTF-8?
                    this.status = 200;
                } else {
                    this.status = 404;
                }
            }
        } else {
            var url = new java.net.URL(this._url),
                connection = url.openConnection();

            connection.setDoInput(true);

            connection.setRequestMethod(this._method);

            for (var header in this._requestHeaders) {
                var value = this._requestHeaders[header];
                connection.addRequestProperty(String(header), String(value));
            }

            var input = null;
            try {
                if (entityBody) {
                    connection.setDoOutput(true);

                    var output = new IO(null, connection.getOutputStream());
                    output.write(entityBody);
                    output.close();
                }
                connection.connect();

                input = new IO(connection.getInputStream(), null);
            } catch (e) {
                // HttpUrlConnection will throw FileNotFoundException on 404 errors. FIXME: others?
                if (e.javaException instanceof java.io.FileNotFoundException)
                    input = new IO(connection.getErrorStream(), null);
                else {
                    try {
                        this.status = Number(connection.getResponseCode());
                        this.statusText = String(connection.getResponseMessage());
                        return;
                    } catch (err) {
                        throw e;
                    }
                }
            }

            this.status = Number(connection.getResponseCode());
            this.statusText = String(connection.getResponseMessage() || "");

            for (var i = 0;; i++) {
                var key = connection.getHeaderFieldKey(i),
                    value = connection.getHeaderField(i);
                if (!key && !value)
                    break;
                // returns the HTTP status code with no key, ignore it.
                if (key)
                    this._responseHeaders[String(key)] = String(value);
            }

            //this.readyState = HEADERS_RECEIVED;
            //this.readyState = LOADING;

            this.responseRaw = input.read();
            this.responseText = this.responseRaw.decodeToString("UTF-8"); // FIXME: don't assume UTF-8?
        }
        system.log.debug("xhr response:  " + this._url + " (status="+this.status+" length="+this.responseText.length+")");
    }
    catch (e) {
        this.status = 500;
        this.responseText = "";
        system.log.warn("xhr exception: " + this.url + " ("+e+")");
    }

    this.responseXML = null;
    if (this.responseText)
    {
        var contentType = HashP.includes(this._responseHeaders, "Content-Type") ? HashP.get(this._responseHeaders, "Content-Type") : "text/xml";

        if (contentType.match(/((^text\/xml$)|(^application\/xml$)|(\+xml$))/))
        try { this.responseXML = parser.parseFromString(this.responseText, contentType); } catch (e) {}
    }
    
    // 7. If async is true return the send() method call. (Do not terminate the steps in the algorithm though.)
    // 8. While downloading the resource the following rules are to be observed.
    // 9. When the request has successfully completed loading, synchronously switch the state to DONE and then synchronously dispatch a readystatechange event on the object and return the method call in case of async being false.

    // FIXME: this is very very wrong. hook into event loop correctly
    this.readyState = DONE;
    if (this.onreadystatechange) {
        var that = this;
        if (this._async)
            require("./timeout").setTimeout(function() { that.onreadystatechange() }, 0); // FIXME
        else
            this.onreadystatechange();
    }
}

XMLHttpRequest.prototype.sendAsBinary = function(data) {
    data = initSend.call(this, data);

    var entityBody;
    if (data == null || data === undefined ){
        entityBody = null;
    } else if (typeof data === "string"){
        throw new Error("Please use ByteString");
    } else {
        entityBody = data;
    }

    sendData.call(this, entityBody);
}

// send(data), method
// The send() method initiates the request and its optional argument provides the entity body.
XMLHttpRequest.prototype.send = function(data)
{
    data = initSend.call(this, data);

    var entityBody;
    if (data === null || data === undefined) {
        entityBody = null;
    }
    else if (typeof data === "string") {
        // data is a DOMString
        // Encode data using UTF-8 for transmission.
        entityBody = data.toByteString("UTF-8");
        // If a Content-Type header is set using setRequestHeader() set the charset parameter of that header to UTF-8.
        var values = HashP.get(this._requestHeaders, "Content-Type");
        if (values)
            values[0] = values[0].replace(/(;\s*charset=([^;]+|.*$)|$)/, "; charset=utf-8");
    }
    //else if (data instanceof Document) {
        // data is a Document
        // Serialize data into a namespace well-formed XML document and encoded using the encoding given by data.inputEncoding, when not null, or UTF-8 otherwise. Or, if this fails because the Document cannot be serialized act as if data is null.
        // If no Content-Type header has been set using setRequestHeader() append a Content-Type header to the list of request headers with a value of application/xml;charset=charset where charset is the encoding used to encode the document.
    //}
    else {
        // data is not a DOMString or Document
        // Use the stringification mechanisms of the host language on data and treat the result as if data is a DOMString. Or, if this fails, act as if the data argument is null.
        // If the data argument has been omitted, or is null, no entity body is used in the request.
        entityBody = String(data).toByteString("UTF-8");
    }

    sendData.call(this, entityBody);
}

XMLHttpRequest.prototype.abort = function()
{
    // When invoked, the user agent must run the following steps (unless otherwise noted):

    // 1. Abort the send() algorithm, set the response entity body to "null", the error flag to "true" and remove any registered request headers.
    this._responseBody      = null;
    this._errorFlag         = true;
    this._requestHeaders    = {};

    // 2. The user agent should cancel any network activity for which the object is responsible.

    // 3. If the state is UNSENT, OPENED and the send() flag is "false", or DONE go to the next step.
    // 4. Otherwise, switch the state to DONE, set the send() flag to "false" and synchronously dispatch a readystatechange event on the object.
    if (!(this.readyState < HEADERS_RECEIVED && this._sendFlag === false) && !(this.readyState < DONE)) {
        this.readyState = DONE;
        this._sendFlag = false;
        if (this.onreadystatechange)
            this.onreadystatechange();
    }

    // 5. Switch the state to UNSENT. (Do not dispatch the readystatechange event.)
    this.readyState = UNSENT;
}

XMLHttpRequest.prototype.getAllResponseHeaders = function()
{
    // When invoked, the user agent must run the following steps:

    // 1. If the state is UNSENT or OPENED raise an INVALID_STATE_ERR exception and terminate these steps.
    if (this.readyState < HEADERS_RECEIVED)
        throw new Error("INVALID_STATE_ERR");

    // 2. If the error flag is "true" return the empty string and terminate these steps.
    if (this._errorFlag)
        return "";

    // 3. Return all the HTTP headers, as a single string, with each header line separated by a U+000D (CR) U+000A (LF) pair excluding the status line.
    var headerLines = [];
    for (var header in this._responseHeaders)
        headerLines.push(header + ": " + this._responseHeaders[header]);
    return headerLines.join("\n");
}

XMLHttpRequest.prototype.getResponseHeader = function(header)
{
    // When the method is invoked, the user agent must run the following steps:

    // 1. If the state is UNSENT or OPENED raise an INVALID_STATE_ERR exception and terminate these steps.
    if (this.readyState < HEADERS_RECEIVED)
        throw new Error("INVALID_STATE_ERR");

    // 2. If the header argument does not match the field-name production return null and terminate these steps.
    // TODO

    // 3. If the error flag is "true" return null and terminate these steps.
    if (this._errorFlag)
        return null;

    // 4. If the header argument case-insensitively matches multiple HTTP headers for the last request sent, return the values of these headers as a single concatenated string separated from each other by an U+002C followed by an U+0020 character and terminate these steps.
    // 5. If the header argument case-insensitively matches a single HTTP header for the last request sent return the value of that header and terminate these steps.
    // 6. Return null.

    // FIXME: not quite correct
    return HashP.get(this._responseHeaders, header) || null;
}

