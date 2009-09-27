
exports.createDocument = function(/*String*/ namespaceURI, /*String*/ qualifiedName, /*DocumentType*/ doctype)  {
    return global.document.implementation.createDocument(namespaceURI, qualifiedName, doctype || null);
}

exports.XMLSerializer = global.XMLSerializer;

// DOMParser
exports.DOMParser = global.DOMParser;

var validContentTypes = { "text/xml" : true, "application/xml" : true, "application/xhtml+xml" : true };

// FIXME: wrap Document so we can add these:

exports.createExpression = function(/*String*/ xpathText, /*Function*/ namespaceURLMapper) {
    return (new XPathEvaluator).createExpression(xpathText, namespaceURLMapper).
}

exports.evaluate = function(/*String*/ xpathText, /*Node*/ contextNode, /*Function*/ namespaceURLMapper, /*short*/ resultType, /*XPathResult*/ result) {
    return exports.createExpression(xpathText, namespaceURLMapper).evaluate(contextNode, resultType, result);
}

exports.Node = global.Node;
exports.Node = global.Document;
exports.Element = global.Element;
exports.NodeList = global.NodeList;
exports.Document = global.Document;
