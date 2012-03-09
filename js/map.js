var Map;

Array.prototype.uniq = function() {
  var el, res, _i, _len;
  res = [];
  for (_i = 0, _len = this.length; _i < _len; _i++) {
    el = this[_i];
    if (res.indexOf(el) === -1) res.push(el);
  }
  return res;
};

Map = (function() {

  function Map(width, height) {
    this.width = width;
    this.height = height;
    this.tiles = [];
    this.units = [];
    this.selected = {
      x: -1,
      y: -1
    };
    this.hovered = {
      x: -1,
      y: -1
    };
    this.currentPossibleMoves = false;
  }

  Map.prototype.getTile = function(x, y) {
    return this.tiles[x + y * this.width];
  };

  Map.prototype.setTile = function(x, y, tile) {
    return this.tiles[x + y * this.width] = tile;
  };

  Map.prototype.loadFromString = function(string, images) {
    var element, elements, line, lines, tile, x, y, _len, _results;
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
          tile = new Tile(images[element], element);
          _results2.push(this.setTile(x, y, tile));
        }
        return _results2;
      }).call(this));
    }
    return _results;
  };

  Map.prototype.canvasPosToMapPos = function(targetX, targetY, offset, zoom) {
    var hexOffsetY, res, x, xPos, y, yPos, _ref, _ref2;
    res = false;
    for (y = 0, _ref = this.height; 0 <= _ref ? y < _ref : y > _ref; 0 <= _ref ? y++ : y--) {
      for (x = 0, _ref2 = this.width; 0 <= _ref2 ? x < _ref2 : x > _ref2; 0 <= _ref2 ? x++ : x--) {
        if (x % 2 === 1) {
          hexOffsetY = 100;
        } else {
          hexOffsetY = 0;
        }
        xPos = (x * 150) / zoom + offset.x;
        yPos = (y * 200 + hexOffsetY) / zoom + offset.y;
        if (targetX >= xPos && targetX < xPos + 200 / zoom) {
          if (targetY >= yPos && targetY < yPos + 200 / zoom) {
            res = {
              x: x,
              y: y
            };
            return res;
          }
        }
      }
    }
  };

  Map.prototype.inPossibleMoves = function(x, y) {
    var move, _i, _len, _ref;
    _ref = this.currentPossibleMoves;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      move = _ref[_i];
      if (move.x === x && move.y === y) return true;
    }
    return false;
  };

  Map.prototype.restoreTiles = function() {
    var move, tile, _i, _len, _ref, _results;
    _ref = this.currentPossibleMoves;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      move = _ref[_i];
      tile = this.getTile(move.x, move.y);
      _results.push(tile.restore());
    }
    return _results;
  };

  Map.prototype.select = function(targetX, targetY, offset, zoom) {
    var move, old_selected, tile, unit, _i, _len, _ref, _results;
    old_selected = this.selected;
    this.selected = this.canvasPosToMapPos(targetX, targetY, offset, zoom);
    if (this.currentPossibleMoves) this.restoreTiles();
    if (this.unitOnTile(old_selected.x, old_selected.y)) {
      unit = this.getUnit(old_selected);
      if (this.inPossibleMoves(this.selected.x, this.selected.y)) {
        this.moveUnit(old_selected, this.selected);
        this.selected = false;
      }
    }
    if (this.unitOnTile(this.selected.x, this.selected.y)) {
      unit = this.getUnit(this.selected);
      this.currentPossibleMoves = this.possibleMoves(unit);
      _ref = this.currentPossibleMoves;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        move = _ref[_i];
        tile = this.getTile(move.x, move.y);
        _results.push(tile.invert());
      }
      return _results;
    } else {
      return this.currentPossibleMoves = false;
    }
  };

  Map.prototype.hover = function(targetX, targetY, offset, zoom) {
    var tile;
    if (this.hovered) {
      tile = this.getTile(this.hovered.x, this.hovered.y);
      if (tile) tile.restore();
    }
    this.hovered = this.canvasPosToMapPos(targetX, targetY, offset, zoom);
    if (this.hovered) {
      tile = this.getTile(this.hovered.x, this.hovered.y);
      if (tile) return tile.brighten();
    }
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

  Map.prototype.getUnit = function(pos) {
    var unit, _i, _len, _ref;
    _ref = this.units;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      unit = _ref[_i];
      if (unit.pos.x === pos.x && unit.pos.y === pos.y) return unit;
    }
  };

  Map.prototype.moveUnit = function(from, to) {
    var unit;
    unit = this.getUnit(from);
    return unit.move(to, this.getTile(to.x, to.y));
  };

  Map.prototype.possibleMoves = function(unit) {
    return this.possibleMovesHelper(unit, unit.moves - 1, this.neighbours(unit.pos));
  };

  Map.prototype.possibleMovesHelper = function(unit, movesLeft, neighbours, visited) {
    var neighbour, next_neighbours, res, that, _i, _len;
    that = this;
    neighbours = neighbours.filter(function(neighbour) {
      return unit.canMoveTo(that.getTile(neighbour.x, neighbour.y)) && !that.unitOnTile(neighbour.x, neighbour.y);
    });
    if (movesLeft === 0) {
      return neighbours;
    } else {
      res = [].concat(neighbours);
      for (_i = 0, _len = neighbours.length; _i < _len; _i++) {
        neighbour = neighbours[_i];
        next_neighbours = this.neighbours(neighbour);
        res = res.concat(this.possibleMovesHelper(unit, movesLeft - 1, next_neighbours));
      }
      return res.uniq();
    }
  };

  Map.prototype.unitOnTile = function(x, y) {
    return this.units.some(function(unit) {
      return unit.pos.x === x && unit.pos.y === y;
    });
  };

  return Map;

})();
