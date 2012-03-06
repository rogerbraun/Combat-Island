var Map;

Map = (function() {

  function Map(width, height) {
    this.width = width;
    this.height = height;
    this.tiles = [];
    this.images = {};
    this.selected = false;
  }

  Map.prototype.getTile = function(x, y) {
    return this.tiles[x + y * this.width];
  };

  Map.prototype.setTile = function(x, y, element) {
    return this.tiles[x + y * this.width] = element;
  };

  Map.prototype.setImage = function(letter, src) {
    var image;
    image = new Image;
    image.src = src;
    return this.images[letter] = image;
  };

  Map.prototype.loadFromString = function(string) {
    var element, elements, line, lines, x, y, _len, _results;
    lines = string.split('\n');
    _results = [];
    for (y = 0, _len = lines.length; y < _len; y++) {
      line = lines[y];
      elements = line.split('');
      _results.push((function() {
        var _len2, _results2;
        _results2 = [];
        for (x = 0, _len2 = elements.length; x < _len2; x++) {
          element = elements[x];
          _results2.push(this.setTile(x, y, element));
        }
        return _results2;
      }).call(this));
    }
    return _results;
  };

  Map.prototype.drawBackground = function(canvas) {
    var context;
    context = canvas.getContext('2d');
    context.fillStyle = 'black';
    return context.fillRect(0, 0, canvas.width, canvas.height);
  };

  Map.prototype.select = function(targetX, targetY, offset, zoom) {
    var hexOffsetY, image, x, xPos, y, yPos, _ref, _results;
    _results = [];
    for (y = 0, _ref = this.height; 0 <= _ref ? y < _ref : y > _ref; 0 <= _ref ? y++ : y--) {
      _results.push((function() {
        var _ref2, _results2;
        _results2 = [];
        for (x = 0, _ref2 = this.width; 0 <= _ref2 ? x < _ref2 : x > _ref2; 0 <= _ref2 ? x++ : x--) {
          image = this.images[this.getTile(x, y)];
          if (image) {
            if (x % 2 === 1) {
              hexOffsetY = 100;
            } else {
              hexOffsetY = 0;
            }
            xPos = (x * 150) / zoom + offset.x;
            yPos = (y * 200 + hexOffsetY) / zoom + offset.y;
            if (targetX >= xPos && targetX < xPos + image.width / zoom) {
              if (targetY >= yPos && targetY < yPos + image.height / zoom) {
                this.selected = {
                  x: x,
                  y: y
                };
                _results2.push(this.setTile(x, y, " "));
              } else {
                _results2.push(void 0);
              }
            } else {
              _results2.push(void 0);
            }
          } else {
            _results2.push(void 0);
          }
        }
        return _results2;
      }).call(this));
    }
    return _results;
  };

  Map.prototype.drawTiles = function(canvas, offset, zoom) {
    var context, hexOffsetY, image, x, xPos, y, yPos, _ref, _results;
    context = canvas.getContext('2d');
    _results = [];
    for (y = 0, _ref = this.height; 0 <= _ref ? y < _ref : y > _ref; 0 <= _ref ? y++ : y--) {
      _results.push((function() {
        var _ref2, _results2;
        _results2 = [];
        for (x = 0, _ref2 = this.width; 0 <= _ref2 ? x < _ref2 : x > _ref2; 0 <= _ref2 ? x++ : x--) {
          image = this.images[this.getTile(x, y)];
          if (image) {
            if (x % 2 === 1) {
              hexOffsetY = 100;
            } else {
              hexOffsetY = 0;
            }
            xPos = (x * 150) / zoom + offset.x;
            yPos = (y * 200 + hexOffsetY) / zoom + offset.y;
            _results2.push(context.drawImage(image, 0, 0, image.width, image.height, xPos, yPos, image.width / zoom, image.height / zoom));
          } else {
            _results2.push(void 0);
          }
        }
        return _results2;
      }).call(this));
    }
    return _results;
  };

  Map.prototype.draw = function(canvas, offset, zoom) {
    this.drawBackground(canvas);
    return this.drawTiles(canvas, offset, zoom);
  };

  return Map;

})();
