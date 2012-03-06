var Filters, getPixels;
getPixels = function(image) {
  var canvas, context, imgd, pixels;
  canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  context = canvas.getContext('2d');
  context.drawImage(image, 0, 0);
  imgd = context.getImageData(0, 0, canvas.width, canvas.height);
  pixels = imgd.data;
  return [context, imgd, pixels, canvas];
};
Filters = {
  invert: function(image) {
    var canvas, context, i, imgd, pixels, _ref, _ref2, _step;
    _ref = getPixels(image), context = _ref[0], imgd = _ref[1], pixels = _ref[2], canvas = _ref[3];
    for (i = 0, _ref2 = pixels.length, _step = 4; 0 <= _ref2 ? i < _ref2 : i > _ref2; i += _step) {
      pixels[i] = 255 - pixels[i];
      pixels[i + 1] = 255 - pixels[i + 1];
      pixels[i + 2] = 255 - pixels[i + 2];
    }
    context.putImageData(imgd, 0, 0);
    return canvas;
  },
  brighten: function(image) {
    var canvas, context, i, imgd, pixels, _ref, _ref2, _step;
    _ref = getPixels(image), context = _ref[0], imgd = _ref[1], pixels = _ref[2], canvas = _ref[3];
    for (i = 0, _ref2 = pixels.length, _step = 4; 0 <= _ref2 ? i < _ref2 : i > _ref2; i += _step) {
      pixels[i] = Math.min(255, pixels[i] + 60);
      pixels[i + 1] = Math.min(255, pixels[i + 1] + 60);
      pixels[i + 2] = Math.min(255, pixels[i + 2] + 60);
    }
    context.putImageData(imgd, 0, 0);
    return canvas;
  }
};