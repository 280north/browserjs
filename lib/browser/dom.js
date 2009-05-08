var DOMParser = exports.DOMParser = function() {
}

DOMParser.prototype.parseFromString = function(string, type) {
    return builder.parse(new Packages.org.xml.sax.InputSource(new Packages.java.io.StringReader(String(string))));
}


var builderFactory = Packages.javax.xml.parsers.DocumentBuilderFactory.newInstance();

// setValidating to false doesn't seem to prevent it from downloading the DTD, but lets do it anyway
builderFactory.setValidating(false);

// FIXME: make one for each thread
var builder = builderFactory.newDocumentBuilder();

// prevent the Java XML parser from downloading the plist DTD from Apple every time we parse a plist
builder.setEntityResolver(new JavaAdapter(Packages.org.xml.sax.EntityResolver, {
    resolveEntity: function(publicId, systemId) {
        // TODO: return a local copy of the DTD?
        if (String(systemId) === "http://www.apple.com/DTDs/PropertyList-1.0.dtd")
            return new Packages.org.xml.sax.InputSource(new Packages.java.io.StringReader(""));
        
        return null;
    }
}));

// throw an exception on error
builder.setErrorHandler(function(exception, methodName) {
	throw exception;
});
