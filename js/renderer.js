var CanvasRenderer;

CanvasRenderer = (function() {

  function CanvasRenderer(map, canvas) {
    var that;
    this.map = map;
    this.canvas = canvas;
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
    this.context.fillStyle = 'white';
    return this.context.fillText("FPS: " + this.fps, 15, 15);
  };

  CanvasRenderer.prototype.drawTiles = function() {
    var image, x, y, _ref, _results;
    _results = [];
    for (y = 0, _ref = this.map.height; 0 <= _ref ? y < _ref : y > _ref; 0 <= _ref ? y++ : y--) {
      _results.push((function() {
        var _ref2, _results2;
        _results2 = [];
        for (x = 0, _ref2 = this.map.width; 0 <= _ref2 ? x < _ref2 : x > _ref2; 0 <= _ref2 ? x++ : x--) {
          if ((this.map.hovered.x === x && this.map.hovered.y === y) || (this.map.selected.x === x && this.map.selected.y === y)) {
            image = this.map.getBrightImage({
              x: x,
              y: y
            });
          } else if (this.map.inPossibleMoves(-x, -y)) {
            image = this.map.getInvertedImage({
              x: x,
              y: y
            });
          } else {
            image = this.map.getImage({
              x: x,
              y: y
            });
          }
          _results2.push(this.drawImage({
            x: x,
            y: y
          }, image));
        }
        return _results2;
      }).call(this));
    }
    return _results;
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
    if (this.map.selected.x === unit.pos.x && this.map.selected.y === unit.pos.y) {
      image = Filters.brighten(image);
    }
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

  CanvasRenderer.prototype.draw = function() {
    var that;
    that = this;
    return window.requestAnimationFrame(function() {
      that.drawBackground();
      that.drawTiles();
      that.drawUnits();
      that.drawFps();
      that.frames += 1;
      return that.draw();
    });
  };

  return CanvasRenderer;

})();
