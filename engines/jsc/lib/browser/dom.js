exports.Node = global.Node;
exports.Element = global.Element;
exports.Document = global.Document;

exports.NodeList = global.NodeList;

exports.DOMParser = global.DOMParser;
exports.XMLSerializer = global.XMLSerializer;
exports.XPathResult = global.XPathResult;

exports.createDocument = function(/*String*/ namespaceURI, /*String*/ qualifiedName, /*DocumentType*/ doctype)  {
    return global.document.implementation.createDocument(namespaceURI, qualifiedName, doctype || null);
}

exports.evaluate = function(/*String*/ xpathText, /*Node*/ contextNode, /*Function*/ namespaceURLMapper, /*short*/ resultType, /*XPathResult*/ result) {
    var doc = contextNode instanceof exports.Document ? contextNode : contextNode.ownerDocument;
    return doc.evaluate(xpathText, contextNode, namespaceURLMapper, resultType, result || null);
}
