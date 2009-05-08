var HTMLCanvasElement = exports.HTMLCanvasElement = function() {
};

// DOMString toDataURL([Optional] in DOMString type, [Variadic] in any args);
HTMLCanvasElement.prototype.toDataURL = function(type) {
    
}

// Object getContext(in DOMString contextId);
HTMLCanvasElement.prototype.getContext = function(contextId) {
    return new CRC2D(this);
}

var CRC2D = exports.CanvasRenderingContext2D = function(canvas) {
    
    this.states = [];
    
    // readonly attribute HTMLCanvasElement canvas;
    this.canvas = canvas;
    
    // attribute float globalAlpha; // (default 1.0)
    this.globalAlpha = 1.0;
    // attribute DOMString globalCompositeOperation; // (default source-over)
    this.globalCompositeOperation = "source-over";

    // attribute any strokeStyle; // (default black)
    this.strokeStyle = "black";
    // attribute any fillStyle; // (default black)
    this.fillStyle = "black";
    
    // attribute float lineWidth; // (default 1)
    this.lineWidth = 1.0;
    // attribute DOMString lineCap; // "butt", "round", "square" (default "butt")
    this.lineCap = "butt";
    // attribute DOMString lineJoin; // "round", "bevel", "miter" (default "miter")
    this.lineJoin = "miter";
    // attribute float miterLimit; // (default 10)
    this.miterLimit = 10.0;
    
    // attribute float shadowOffsetX; // (default 0)
    this.shadowOffsetX = 0.0;
    // attribute float shadowOffsetY; // (default 0)
    this.shadowOffsetY = 0.0;
    // attribute float shadowBlur; // (default 0)
    this.shadowBlur = 0.0;
    // attribute DOMString shadowColor; // (default transparent black)
    this.shadowColor = "transparent black";

    // attribute DOMString font; // (default 10px sans-serif)
    this.font = "default 10px sans-serif";
    // attribute DOMString textAlign; // "start", "end", "left", "right", "center" (default: "start")
    this.textAlign = "start";
    // attribute DOMString textBaseline; // "top", "hanging", "middle", "alphabetic", "ideographic", "bottom" (default: "alphabetic")
    this.textBaseline = "alphabetic";
}


// void save(); // push state on state stack
CRC2D.prototype.save = function() {
    this.states.push();
}

// void restore(); // pop state stack and restore state
CRC2D.prototype.restore = function() {
    this.states.pop();
}


// void scale(in float x, in float y);
CRC2D.prototype.scale = function(x, y) {}
// void rotate(in float angle);
CRC2D.prototype.rotate = function(angle) {}
// void translate(in float x, in float y);
CRC2D.prototype.translate = function(x, y) {}
// void transform(in float m11, in float m12, in float m21, in float m22, in float dx, in float dy);
CRC2D.prototype.transform = function(m11, m12, m21, m22, dx, dy) {}
// void setTransform(in float m11, in float m12, in float m21, in float m22, in float dx, in float dy);
CRC2D.prototype.setTransform = function(m11, m12, m21, m22, dx, dy) {}

// CanvasGradient createLinearGradient(in float x0, in float y0, in float x1, in float y1);
CRC2D.prototype.createLinearGradient = function(x0, y0, x1, y1) {}
// CanvasGradient createRadialGradient(in float x0, in float y0, in float r0, in float x1, in float y1, in float r1);
CRC2D.prototype.createRadialGradient = function(x0, y0, r0, x1, y1, r1) {}
// CanvasPattern createPattern(in HTMLImageElement image, in DOMString repetition);
// CanvasPattern createPattern(in HTMLCanvasElement image, in DOMString repetition);
CRC2D.prototype.createPattern = function(image, repetition) {}

// void clearRect(in float x, in float y, in float w, in float h);
CRC2D.prototype.clearRect = function(x, y, w, h) {}
// void fillRect(in float x, in float y, in float w, in float h);
CRC2D.prototype.fillRect = function(x, y, w, h) {}
// void strokeRect(in float x, in float y, in float w, in float h);
CRC2D.prototype.strokeRect = function(x, y, w, h) {}

// void beginPath();
CRC2D.prototype.beginPath = function() {}
// void closePath();
CRC2D.prototype.closePath = function() {}
// void moveTo(in float x, in float y);
CRC2D.prototype.moveTo = function(x, y) {}
// void lineTo(in float x, in float y);
CRC2D.prototype.lineTo = function(x, y) {}
// void quadraticCurveTo(in float cpx, in float cpy, in float x, in float y);
CRC2D.prototype.quadraticCurveTo = function(cpx, cpy, x, y) {}
// void bezierCurveTo(in float cp1x, in float cp1y, in float cp2x, in float cp2y, in float x, in float y);
CRC2D.prototype.bezierCurveTo = function(cp1x, cp1y, cp2x, cp2y, x, y) {}
// void arcTo(in float x1, in float y1, in float x2, in float y2, in float radius);
CRC2D.prototype.arcTo = function(x1, y1, x2, y2, radius) {}
// void rect(in float x, in float y, in float w, in float h);
CRC2D.prototype.rect = function(x, y, w, h) {}
// void arc(in float x, in float y, in float radius, in float startAngle, in float endAngle, in boolean anticlockwise);
CRC2D.prototype.arc = function(x, y, radius, startAngle, endAngle, anticlockwise) {}
// void fill();
CRC2D.prototype.fill = function() {}
// void stroke();
CRC2D.prototype.stroke = function() {}
// void clip();
CRC2D.prototype.clip = function() {}
// boolean isPointInPath(in float x, in float y);
CRC2D.prototype.isPointInPath = function(x, y) {}

// void fillText(in DOMString text, in float x, in float y, [Optional] in float maxWidth);
CRC2D.prototype.fillText = function(text, x, y, maxWidth) {}
// void strokeText(in DOMString text, in float x, in float y, [Optional] in float maxWidth);
CRC2D.prototype.strokeText = function(text, x, y, maxWidth) {}
// TextMetrics measureText(in DOMString text);
CRC2D.prototype.measureText = function(text) {}

// void drawImage(in HTMLImageElement image, in float dx, in float dy, [Optional] in float dw, in float dh);
// void drawImage(in HTMLCanvasElement image, in float dx, in float dy, [Optional] in float dw, in float dh);
// void drawImage(in HTMLVideoElement image, in float dx, in float dy, [Optional] in float dw, in float dh);
CRC2D.prototype.drawImage = function(image, dx, dy, dw, dh) {}
// void drawImage(in HTMLImageElement image, in float sx, in float sy, in float sw, in float sh, in float dx, in float dy, in float dw, in float dh);
// void drawImage(in HTMLCanvasElement image, in float sx, in float sy, in float sw, in float sh, in float dx, in float dy, in float dw, in float dh);
// void drawImage(in HTMLVideoElement image, in float sx, in float sy, in float sw, in float sh, in float dx, in float dy, in float dw, in float dh);
CRC2D.prototype.drawImage = function(image, sx, sy, sw, sh, dx, dy, dw, dh) {}

// ImageData createImageData(in float sw, in float sh);
CRC2D.prototype.createImageData = function(sw, sh) {}
// ImageData getImageData(in float sx, in float sy, in float sw, in float sh);
CRC2D.prototype.getImageData = function(sx, sy, sw, sh) {}
// void putImageData(in ImageData imagedata, in float dx, in float dy, [Optional] in float dirtyX, in float dirtyY, in float dirtyWidth, in float dirtyHeight);
CRC2D.prototype.putImageData = function(imagedata, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight) {}
