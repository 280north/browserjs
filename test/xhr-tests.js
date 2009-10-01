var assert = require("test/assert");

var XHR = require("browser/xhr").XMLHttpRequest,
    File = require("file"),
    ByteString = require("binary").ByteString;

var testFileMissing = "foobarbaz-missing",
    testFilePresent = "foobarbaz-present",
    contents = "hello world\n",
    binaryContents = new ByteString(contents);

var sendAsBinary = function(req) { return req.sendAsBinary(binaryContents); };

exports.setup = function() {
    try { File.remove(testFileMissing); } catch (e) {}
    
    try {
        File.write(testFilePresent, contents);
    } catch (e) {
        system.log.error("Couldn't prepare test file: " + e);
    }
}

exports.teardown = function() {
    try { File.remove(testFileMissing); } catch (e) {}
    try { File.remove(testFilePresent); } catch (e) {}
}

exports.testSynchronouseLocalGET = function() {
    xhrSynchronousTest("GET", testFilePresent, 200, contents);
}

exports.testSynchronouseLocalGETMissing = function() {
    xhrSynchronousTest("GET", testFileMissing, 404, "");
}

exports.testSynchronouseLocalPUT = function() {
    xhrSynchronousTest("PUT", testFileMissing, 201, "");
    assert.isEqual(contents, File.read(testFileMissing));
}

exports.testSynchronouseLocalDELETE = function() {
    xhrSynchronousTest("DELETE", testFilePresent, 200, "");
    assert.isTrue(!File.exists(testFilePresent), "File should be deleted");
}

exports.testSynchronouseLocalBinaryGET = function() {
    xhrSynchronousTest("GET", testFilePresent, 200, contents, sendAsBinary);
}

exports.testSynchronouseLocalBinaryGETMissing = function() {
    xhrSynchronousTest("GET", testFileMissing, 404, "", sendAsBinary);
}

exports.testSynchronouseLocalBinaryPUT = function() {
    xhrSynchronousTest("PUT", testFileMissing, 201, "", sendAsBinary);
    assert.isEqual(binaryContents.decodeToString(64), File.read(testFileMissing, "rb").decodeToString(64));
}

exports.testSynchronouseLocalBinaryDELETE = function() {
    xhrSynchronousTest("DELETE", testFilePresent, 200, "", sendAsBinary);
    assert.isTrue(!File.exists(testFilePresent), "File should be deleted");
}

function xhrSynchronousTest(method, url, expectedStatus, expectedText, send) {
    var req = new XHR(),
        lastState = req.readyState;

    send = send || function(req) { req.send(contents); };
        
    assert.isEqual(0, lastState);
    req.onreadystatechange = function() {
        assert.isTrue(lastState <= req.readyState, "readyState not monotonically increasing");
        lastState = req.readyState;
    }
    
    req.open(method, url, false);
    
    assert.isEqual(1, req.readyState);
    
    send(req);
    
    assert.isEqual(4, req.readyState);
    assert.isEqual(4, lastState);
    assert.isEqual(expectedStatus, req.status);
    assert.isEqual(expectedText, req.responseText);
}
