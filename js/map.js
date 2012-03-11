var Map;
Array.prototype.uniq = function() {
  var el, res, _i, _len;
  res = [];
  for (_i = 0, _len = this.length; _i < _len; _i++) {
    el = this[_i];
    if (res.indexOf(el) === -1) {
      res.push(el);
    }
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
    this.currentPlayer = 1;
    this.selectedUnit = false;
    this.hoveredTile = false;
    this.overlays = [];
    this.brightOverlay = false;
  }
  Map.prototype.getTile = function(pos) {
    return this.tiles[pos.x + pos.y * this.width];
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
    var hexOffsetY, res, x, xPos, y, yPos, _ref, _ref2, _results;
    res = false;
    _results = [];
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
    return _results;
  };
  Map.prototype.inPossibleMoves = function(pos) {
    var move, _i, _len, _ref;
    _ref = this.currentPossibleMoves;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      move = _ref[_i];
      if (move.x === pos.x && move.y === pos.y) {
        return true;
      }
    }
    return false;
  };
  Map.prototype.selectUnit = function() {
    this.selectedUnit = this.getUnit(this.selected);
    return this.currentPossibleMoves = this.possibleMoves(this.selectedUnit);
  };
  Map.prototype.deSelectUnit = function() {
    this.selectedUnit = false;
    return this.currentPossibleMoves = false;
  };
  Map.prototype.possiblySelectUnit = function() {
    if (this.getUnit(this.selected).player === this.currentPlayer) {
      return this.selectUnit();
    }
  };
  Map.prototype.switchPlayer = function() {
    if (this.currentPlayer === 1) {
      return this.currentPlayer = 2;
    } else {
      return this.currentPlayer = 1;
    }
  };
  Map.prototype.animatedMove = function(unit, goal, callback) {
    var moveAlongPath, path;
    path = this.findPath(unit, goal);
    moveAlongPath = function() {
      var next;
      if (path.length > 0) {
        if (path.length === 1 && callback) {
          return callback();
        } else {
          next = path.shift();
          unit.moveTo(next);
          return setTimeout(moveAlongPath, 300);
        }
      }
    };
    return moveAlongPath(path);
  };
  Map.prototype.moveAndAttack = function(unit, otherUnit) {
    return this.animatedMove(unit, otherUnit.pos, function() {
      return unit.battle(otherUnit);
    });
  };
  Map.prototype.possiblyMoveUnit = function() {
    if (this.inPossibleMoves(this.selected)) {
      if (this.unitOnTile(this.selected)) {
        this.moveAndAttack(this.selectedUnit, this.getUnit(this.selected));
      } else {
        this.animatedMove(this.selectedUnit, this.selected);
      }
      this.deSelectUnit();
      return this.switchPlayer();
    } else {
      return this.deSelectUnit();
    }
  };
  Map.prototype.select = function(targetX, targetY, offset, zoom) {
    this.selected = this.canvasPosToMapPos(targetX, targetY, offset, zoom);
    if (this.selectedUnit) {
      return this.possiblyMoveUnit();
    } else {
      if (this.unitOnTile(this.selected)) {
        return this.possiblySelectUnit();
      }
    }
  };
  Map.prototype.hover = function(targetX, targetY, offset, zoom) {
    var pos;
    pos = this.canvasPosToMapPos(targetX, targetY, offset, zoom);
    return this.hovered = pos;
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
      if (unit.pos.x === pos.x && unit.pos.y === pos.y) {
        return unit;
      }
    }
  };
  Map.prototype.isPossibleMove = function(unit, pos) {
    var tile;
    tile = this.getTile(pos);
    return unit.canMoveTo(tile) && (!this.unitOnTile(pos) || (this.unitOnTile(pos).player !== this.currentPlayer));
  };
  Map.prototype.possibleMoves = function(unit) {
    return this.possibleMovesHelper(unit, unit.moves - 1, this.neighbours(unit.pos));
  };
  Map.prototype.uniquePositions = function(array) {
    var contains, element, res, _i, _len;
    res = [];
    contains = function(array, element) {
      return array.some(function(cmp) {
        return element.x === cmp.x && cmp.y === element.y;
      });
    };
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      element = array[_i];
      if (!contains(res, element)) {
        res.push(element);
      }
    }
    return res;
  };
  Map.prototype.possibleMovesHelper = function(unit, movesLeft, neighbours, visited) {
    var neighbour, next_neighbours, res, that, _i, _len;
    that = this;
    neighbours = neighbours.filter(function(neighbour) {
      return that.isPossibleMove(unit, neighbour);
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
      return res = this.uniquePositions(res);
    }
  };
  Map.prototype.findPath = function(unit, goal) {
    var closed, combinedWeight, currentNode, getNode, goalNode, heuristicWeight, inClosed, inOpen, isEqualNode, neighbour, neighbourNode, neighbours, open, removeNode, res, sortNodes, startNode, _i, _len;
    isEqualNode = function(node, otherNode) {
      return node.pos.x === otherNode.pos.x && node.pos.y === otherNode.pos.y;
    };
    heuristicWeight = function(node) {
      var deltaD, deltaX, deltaY;
      deltaX = node.pos.x - goal.x;
      deltaY = node.pos.y - goal.y;
      deltaD = deltaX - deltaY;
      return Math.max(Math.abs(deltaX), Math.abs(deltaY), Math.abs(deltaD));
    };
    combinedWeight = function(node) {
      return node.weight + heuristicWeight(node);
    };
    sortNodes = function(set) {
      return set.sort(function(node, otherNode) {
        return combinedWeight(node) - combinedWeight(otherNode);
      });
    };
    getNode = function(node, set) {
      var otherNode, _i, _len;
      for (_i = 0, _len = set.length; _i < _len; _i++) {
        otherNode = set[_i];
        if (isEqualNode(node, otherNode)) {
          return otherNode;
        }
      }
      return false;
    };
    removeNode = function(node, set) {
      var index, nodeIndex, possibleNode, _len;
      nodeIndex = false;
      for (index = 0, _len = set.length; index < _len; index++) {
        possibleNode = set[index];
        if (isEqualNode(possibleNode, node)) {
          nodeIndex = index;
        }
      }
      return set.splice(nodeIndex, 1);
    };
    startNode = {
      pos: unit.pos,
      weight: 0
    };
    goalNode = {
      pos: goal
    };
    open = [startNode];
    closed = [];
    while (!isEqualNode(sortNodes(open)[0], goalNode)) {
      currentNode = open.shift();
      closed.push(currentNode);
      neighbours = this.neighbours(currentNode.pos);
      neighbours = neighbours.filter(function(neighbour) {
        return this.isPossibleMove(unit, neighbour);
      }, this);
      for (_i = 0, _len = neighbours.length; _i < _len; _i++) {
        neighbour = neighbours[_i];
        neighbourNode = {
          pos: neighbour,
          weight: currentNode.weight + 1,
          parent: currentNode
        };
        inOpen = getNode(neighbourNode, open);
        inClosed = getNode(neighbourNode, closed);
        if (inOpen && inOpen.weight > neighbourNode.weight) {
          removeNode(inOpen, open);
        }
        if (inClosed && inClosed.weight > neighbourNode.weight) {
          removeNode(inClosed, closed);
        }
        inOpen = getNode(neighbourNode, open);
        inClosed = getNode(neighbourNode, closed);
        if (!inOpen && !inClosed) {
          open.push(neighbourNode);
        }
      }
    }
    res = [];
    goalNode = open[0];
    while (goalNode.parent) {
      res.push(goalNode);
      goalNode = goalNode.parent;
    }
    res = res.map(function(el) {
      return el.pos;
    });
    return res.reverse();
  };
  Map.prototype.unitOnTile = function(tilePos) {
    return this.units.some(function(unit) {
      return unit.pos.x === tilePos.x && unit.pos.y === tilePos.y;
    });
  };
  return Map;
})();