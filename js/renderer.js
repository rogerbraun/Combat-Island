var CanvasRenderer;

CanvasRenderer = (function() {

  function CanvasRenderer(map, canvas) {
    var that;
    this.map = map;
    this.canvas = canvas;
    this.tileCanvas = false;
    this.context = this.canvas.getContext('2d');
    this.frames = 0;
    this.fps = 0;
    this.zoom = 2;
    this.offset = {
      x: 0,
      y: 0
    };
    that = this;
    setInterval(function() {
      that.fps = that.frames;
      return that.frames = 0;
    }, 1000);
    window.requestAnimationFrame || (window.requestAnimationFrame = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame);
  }

  CanvasRenderer.prototype.drawBackground = function() {
    this.context.fillStyle = 'black';
    return this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  };

  CanvasRenderer.prototype.drawFps = function() {
    var text, width;
    this.context.fillStyle = 'white';
    this.context.font = '40pt Arial';
    text = "FPS: " + this.fps;
    width = this.context.measureText(text).width;
    return this.context.fillText(text, this.canvas.width - width, 50);
  };

  CanvasRenderer.prototype.drawTiles = function() {
    var possible, unit, _i, _j, _len, _len2, _ref, _ref2, _results;
    this.context.drawImage(this.tileCanvas, this.offset.x, this.offset.y, this.tileCanvas.width / this.zoom, this.tileCanvas.height / this.zoom);
    if (this.map.hovered) this.drawImage(this.map.hovered, this.map.brightOverlay);
    _ref = this.map.units;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      unit = _ref[_i];
      this.drawOverlay(unit);
    }
    _ref2 = this.map.currentPossibleMoves;
    _results = [];
    for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
      possible = _ref2[_j];
      _results.push(this.drawImage(possible, this.map.brightOverlay));
    }
    return _results;
  };

  CanvasRenderer.prototype.drawOverlay = function(unit) {
    return this.drawImage(unit.pos, this.map.overlays[unit.player - 1]);
  };

  CanvasRenderer.prototype.drawUnits = function() {
    var unit, _i, _len, _ref, _results;
    _ref = this.map.units;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      unit = _ref[_i];
      _results.push(this.drawUnit(unit));
    }
    return _results;
  };

  CanvasRenderer.prototype.drawUnit = function(unit) {
    var image;
    image = unit.getCurrentImage();
    if (this.map.selectedUnit === unit) image = Filters.brighten(image);
    return this.drawImage(unit.pos, image);
  };

  CanvasRenderer.prototype.drawImage = function(pos, image) {
    var height, hexOffsetY, width, x, xPos, y, yPos;
    x = pos.x;
    y = pos.y;
    if (x % 2 === 1) {
      hexOffsetY = 100;
    } else {
      hexOffsetY = 0;
    }
    xPos = (x * 150) / this.zoom + this.offset.x + ((200 - image.width) / this.zoom / 2);
    yPos = (y * 200 + hexOffsetY) / this.zoom + this.offset.y + ((200 - image.height) / this.zoom / 2);
    width = image.width / this.zoom;
    height = image.height / this.zoom;
    xPos = Math.round(xPos);
    yPos = Math.round(yPos);
    width = Math.round(width);
    height = Math.round(height);
    return this.context.drawImage(image, 0, 0, image.width, image.height, xPos, yPos, width, height);
  };

  CanvasRenderer.prototype.drawInfo = function() {
    this.context.fillStyle = 'red';
    this.context.font = '40pt Arial';
    return this.context.fillText("Player " + this.map.currentPlayer, 10, 60);
  };

  CanvasRenderer.prototype.ready = function() {
    var context, hexOffsetY, image, pos, tile, x, y, _ref, _results;
    this.tileCanvas = document.createElement('canvas');
    this.tileCanvas.height = 200 * this.map.height;
    this.tileCanvas.width = 200 * this.map.width;
    context = this.tileCanvas.getContext('2d');
    _results = [];
    for (y = 0, _ref = this.map.height; 0 <= _ref ? y < _ref : y > _ref; 0 <= _ref ? y++ : y--) {
      _results.push((function() {
        var _ref2, _results2;
        _results2 = [];
        for (x = 0, _ref2 = this.map.width; 0 <= _ref2 ? x < _ref2 : x > _ref2; 0 <= _ref2 ? x++ : x--) {
          pos = {
            x: x,
            y: y
          };
          tile = this.map.getTile(pos);
          image = tile.currentImage;
          if (x % 2 === 1) {
            hexOffsetY = 100;
          } else {
            hexOffsetY = 0;
          }
          _results2.push(context.drawImage(image, pos.x * 150, (pos.y * 200) + hexOffsetY));
        }
        return _results2;
      }).call(this));
    }
    return _results;
  };

  CanvasRenderer.prototype.draw = function() {
    var that;
    that = this;
    return window.requestAnimationFrame(function() {
      that.drawBackground();
      that.drawTiles();
      that.drawUnits();
      that.drawFps();
      that.drawInfo();
      that.frames += 1;
      return that.draw();
    });
  };

  return CanvasRenderer;

})();
