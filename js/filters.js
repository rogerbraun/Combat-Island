var Filters, getCanvas, getPixels;

getPixels = function(image) {
  var canvas, context, imgd, pixels;
  canvas = getCanvas(image);
  context = canvas.getContext('2d');
  context.drawImage(image, 0, 0);
  imgd = context.getImageData(0, 0, canvas.width, canvas.height);
  pixels = imgd.data;
  return [context, imgd, pixels, canvas];
};

getCanvas = function(image) {
  var canvas;
  canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  return canvas;
};

Filters = {
  invert: function(image) {
    var canvas, context, i, imgd, pixels, _ref, _ref2;
    _ref = getPixels(image), context = _ref[0], imgd = _ref[1], pixels = _ref[2], canvas = _ref[3];
    for (i = 0, _ref2 = pixels.length; i < _ref2; i += 4) {
      pixels[i] = 255 - pixels[i];
      pixels[i + 1] = 255 - pixels[i + 1];
      pixels[i + 2] = 255 - pixels[i + 2];
    }
    context.putImageData(imgd, 0, 0);
    return canvas;
  },
  switchColor: function(image) {
    var canvas, context, i, imgd, pixels, red, _ref, _ref2;
    _ref = getPixels(image), context = _ref[0], imgd = _ref[1], pixels = _ref[2], canvas = _ref[3];
    for (i = 0, _ref2 = pixels.length; i < _ref2; i += 4) {
      red = pixels[i];
      pixels[i] = pixels[i + 2];
      pixels[i + 2] = red;
    }
    context.putImageData(imgd, 0, 0);
    return canvas;
  },
  brighten: function(image) {
    var canvas, context, i, imgd, pixels, _ref, _ref2;
    _ref = getPixels(image), context = _ref[0], imgd = _ref[1], pixels = _ref[2], canvas = _ref[3];
    for (i = 0, _ref2 = pixels.length; i < _ref2; i += 4) {
      pixels[i] = Math.min(255, pixels[i] + 60);
      pixels[i + 1] = Math.min(255, pixels[i + 1] + 60);
      pixels[i + 2] = Math.min(255, pixels[i + 2] + 60);
    }
    context.putImageData(imgd, 0, 0);
    return canvas;
  },
  rotate: function(image, deg) {
    var canvas, context, radians;
    if (deg == null) deg = 90;
    radians = (Math.PI / 180) * deg;
    canvas = getCanvas(image);
    context = canvas.getContext('2d');
    context.save();
    context.translate(image.width / 2, image.height / 2);
    context.rotate(radians);
    context.translate(-(image.width / 2), -(image.height / 2));
    context.drawImage(image, 0, 0);
    context.restore();
    context.fill();
    return canvas;
  },
  tilefy: function(image) {
    var canvas, context, offset;
    canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    offset = (200 - image.width) / 2;
    context = canvas.getContext('2d');
    context.drawImage(image, offset, offset);
    return canvas;
  }
};
