var Map;
Map = (function() {
  function Map(width, height) {
    this.width = width;
    this.height = height;
    this.tiles = [];
    this.images = {};
    this.units = [];
    this.selected = false;
    this.hover = false;
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
  Map.prototype.select = function(targetX, targetY, offset, zoom, hover) {
    var hexOffsetY, image, x, xPos, y, yPos, _ref, _results;
    if (hover == null) {
      hover = false;
    }
    _results = [];
    for (y = 0, _ref = this.height; 0 <= _ref ? y < _ref : y > _ref; 0 <= _ref ? y++ : y--) {
      _results.push((function() {
        var _ref2, _results2;
        _results2 = [];
        for (x = 0, _ref2 = this.width; 0 <= _ref2 ? x < _ref2 : x > _ref2; 0 <= _ref2 ? x++ : x--) {
          image = this.images[this.getTile(x, y)];
          _results2.push(image ? (x % 2 === 1 ? hexOffsetY = 100 : hexOffsetY = 0, xPos = (x * 150) / zoom + offset.x, yPos = (y * 200 + hexOffsetY) / zoom + offset.y, targetX >= xPos && targetX < xPos + image.width / zoom ? targetY >= yPos && targetY < yPos + image.height / zoom ? hover ? this.hover = {
            x: x,
            y: y
          } : (this.selected = {
            x: x,
            y: y
          }, console.log(this.selected)) : void 0 : void 0) : void 0);
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
          _results2.push(image ? (x % 2 === 1 ? hexOffsetY = 100 : hexOffsetY = 0, xPos = (x * 150) / zoom + offset.x, yPos = (y * 200 + hexOffsetY) / zoom + offset.y, this.selected.x === x && this.selected.y === y && !this.unitOnTile(x, y) ? image = Filters.brighten(image) : void 0, this.hover.x === x && this.hover.y === y && this.unitOnTile(this.selected.x, this.selected.y) ? image = Filters.brighten(image) : void 0, context.drawImage(image, 0, 0, image.width, image.height, xPos, yPos, image.width / zoom, image.height / zoom)) : void 0);
        }
        return _results2;
      }).call(this));
    }
    return _results;
  };
  Map.prototype.moveUnit = function(from, to) {
    var unit, _i, _len, _ref, _results;
    _ref = this.units;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      unit = _ref[_i];
      _results.push(unit.pos.x === from.x && unit.pos.y === from.y ? unit.move(to, this.getTile(to.x, to.y)) : void 0);
    }
    return _results;
  };
  Map.prototype.unitOnTile = function(x, y) {
    return this.units.some(function(unit) {
      return unit.pos.x === x && unit.pos.y === y;
    });
  };
  Map.prototype.drawUnits = function(canvas, offset, zoom) {
    var unit, _i, _len, _ref, _results;
    _ref = this.units;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      unit = _ref[_i];
      _results.push(unit.draw(canvas, offset, zoom, this.selected));
    }
    return _results;
  };
  Map.prototype.draw = function(canvas, offset, zoom) {
    this.drawBackground(canvas);
    this.drawTiles(canvas, offset, zoom);
    return this.drawUnits(canvas, offset, zoom);
  };
  return Map;
})();