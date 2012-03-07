var Map;

Map = (function() {

  function Map(width, height) {
    this.width = width;
    this.height = height;
    this.tiles = [];
    this.images = {};
    this.units = [];
    this.selected = false;
    this.hovered = false;
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

  Map.prototype.canvasPosToMapPos = function(targetX, targetY, offset, zoom) {
    var hexOffsetY, image, res, x, xPos, y, yPos, _ref, _ref2;
    res = false;
    for (y = 0, _ref = this.height; 0 <= _ref ? y < _ref : y > _ref; 0 <= _ref ? y++ : y--) {
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
              res = {
                x: x,
                y: y
              };
            }
          }
        }
      }
    }
    return res;
  };

  Map.prototype.select = function(targetX, targetY, offset, zoom) {
    return this.selected = this.canvasPosToMapPos(targetX, targetY, offset, zoom);
  };

  Map.prototype.hover = function(targetX, targetY, offset, zoom) {
    return this.hovered = this.canvasPosToMapPos(targetX, targetY, offset, zoom);
  };

  Map.prototype.neighbours = function(pos) {
    var hexDiff, neighbours, that, x, y;
    x = pos.x;
    y = pos.y;
    hexDiff = x % 2 === 0 ? -1 : 1;
    neighbours = [
      {
        x: x,
        y: y + 1
      }, {
        x: x,
        y: y - 1
      }, {
        x: x - 1,
        y: y
      }, {
        x: x + 1,
        y: y
      }, {
        x: x + 1,
        y: y + hexDiff
      }, {
        x: x - 1,
        y: y + hexDiff
      }
    ];
    that = this;
    neighbours = neighbours.filter(function(neighbour) {
      return neighbour.x >= 0 && neighbour.y >= 0 && neighbour.x < that.width && neighbour.y < that.height;
    });
    return neighbours;
  };

  Map.prototype.drawTiles = function(canvas, offset, zoom) {
    var context, hexOffsetY, image, neighbour, neighbours, x, xPos, y, yPos, _i, _len, _ref, _ref2, _results;
    context = canvas.getContext('2d');
    for (y = 0, _ref = this.height; 0 <= _ref ? y < _ref : y > _ref; 0 <= _ref ? y++ : y--) {
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
          if (this.selected.x === x && this.selected.y === y && !this.unitOnTile(x, y)) {
            image = Filters.brighten(image);
          }
          if (this.hovered.x === x && this.hovered.y === y && this.unitOnTile(this.selected.x, this.selected.y)) {
            image = Filters.brighten(image);
          }
          context.drawImage(image, 0, 0, image.width, image.height, xPos, yPos, image.width / zoom, image.height / zoom);
        }
      }
    }
    if (this.selected) {
      neighbours = this.neighbours(this.selected);
      _results = [];
      for (_i = 0, _len = neighbours.length; _i < _len; _i++) {
        neighbour = neighbours[_i];
        x = neighbour.x;
        y = neighbour.y;
        if (x % 2 === 1) {
          hexOffsetY = 100;
        } else {
          hexOffsetY = 0;
        }
        xPos = (x * 150) / zoom + offset.x;
        yPos = (y * 200 + hexOffsetY) / zoom + offset.y;
        image = this.images[this.getTile(x, y)];
        image = Filters.invert(image);
        _results.push(context.drawImage(image, 0, 0, image.width, image.height, xPos, yPos, image.width / zoom, image.height / zoom));
      }
      return _results;
    }
  };

  Map.prototype.moveUnit = function(from, to) {
    var unit, _i, _len, _ref, _results;
    _ref = this.units;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      unit = _ref[_i];
      if (unit.pos.x === from.x && unit.pos.y === from.y) {
        _results.push(unit.move(to, this.getTile(to.x, to.y)));
      } else {
        _results.push(void 0);
      }
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
