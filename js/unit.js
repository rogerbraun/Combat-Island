var Unit;

Unit = (function() {

  function Unit(image_src) {
    this.image = new Image;
    this.image.src = image_src;
    this.pos = {
      x: 0,
      y: 0
    };
    this.direction = "n";
    this.canMoveOn = ["g", "f"];
    this.moves = 3;
    this.maxHealth = 100;
    this.currentHealth = 100;
    this.imageCache = [];
    this.brightCache = [];
  }

  Unit.prototype.setPosition = function(x, y) {
    this.pos.x = x;
    return this.pos.y = y;
  };

  Unit.prototype.canMoveTo = function(tile) {
    return this.canMoveOn.some(function(allowed) {
      return tile.element === allowed;
    });
  };

  Unit.prototype.move = function(to, tile) {
    var from;
    from = this.pos;
    if (this.canMoveTo(tile)) {
      this.pos = to;
      return this.calcDirection(from, to);
    }
  };

  Unit.prototype.calcDirection = function(from, to) {
    var dir;
    dir = "";
    if (from.y < to.y) {
      dir += "s";
    } else {
      dir += "n";
    }
    if (from.x < to.x) dir += "e";
    if (from.x > to.x) dir += "w";
    return this.direction = dir;
  };

  Unit.prototype.rotate = function(image) {
    var deg;
    if (!this.imageCache[this.direction]) {
      switch (this.direction) {
        case "s":
          deg = 0;
          break;
        case "sw":
          deg = 60;
          break;
        case "nw":
          deg = 120;
          break;
        case "n":
          deg = 180;
          break;
        case "ne":
          deg = 240;
          break;
        case "se":
          deg = 300;
          break;
        default:
          deg = 0;
      }
      image = Filters.rotate(image, deg);
      this.imageCache[this.direction] = image;
    }
    return this.imageCache[this.direction];
  };

  Unit.prototype.addHealthBar = function(canvas) {
    var context, width;
    context = canvas.getContext('2d');
    width = (this.currentHealth / this.maxHealth) * 80;
    context.fillStyle = "hsl(" + ((width / 80) * 120) + ",100%, 50%)";
    context.fillRect(10, 10, width, 10);
    return canvas;
  };

  Unit.prototype.getCurrentImage = function() {
    var image;
    image = this.rotate(this.image);
    return this.addHealthBar(image);
  };

  Unit.prototype.getBrightImage = function() {
    var image;
    if (!this.brightCache[this.direction]) {
      image = getCurrentImage();
      image = Filters.brighten(image);
      this.brightCache[this.direction] = image;
    }
    return this.brightCache[this.direction];
  };

  return Unit;

})();
