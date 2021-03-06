var Unit;

Unit = (function() {

  function Unit(image_src) {
    var image, that;
    image = new Image;
    image.src = image_src;
    that = this;
    image.onload = function() {
      return that.image = Filters.tilefy(image);
    };
    this.pos = {
      x: 0,
      y: 0
    };
    this.direction = "n";
    this.canMoveOn = ["g", "f"];
    this.moves = 3;
    this.maxHealth = 100;
    this.currentHealth = 100;
    this.player = 1;
    this.imageCache = [];
    this.brightCache = [];
    this.selected = false;
    this.attack = 15;
    this.defense = 15;
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

  Unit.prototype.moveTo = function(to) {
    var from;
    from = this.pos;
    this.pos = to;
    return this.calcDirection(from, to);
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

  Unit.prototype.battle = function(otherUnit) {
    return otherUnit.currentHealth -= this.attack;
  };

  Unit.prototype.addHealthBar = function(canvas) {
    var context, maxWidth, offset, width;
    context = canvas.getContext('2d');
    maxWidth = canvas.width * 0.8;
    offset = canvas.width * 0.1;
    width = (this.currentHealth / this.maxHealth) * maxWidth;
    context.fillStyle = "hsl(" + ((width / maxWidth) * 120) + ",100%, 50%)";
    context.fillRect(offset, offset, width, offset);
    return canvas;
  };

  Unit.prototype.getCurrentImage = function() {
    var ctx, image;
    image = document.createElement('canvas');
    image.width = this.image.width;
    image.height = this.image.height;
    ctx = image.getContext('2d');
    ctx.drawImage(this.rotate(this.image), 0, 0);
    if (this.player === 2) image = Filters.switchColor(image);
    image = this.addHealthBar(image);
    return image;
  };

  Unit.prototype.getBrightImage = function() {
    var image;
    image = getCurrentImage();
    image = Filters.brighten(image);
    return image;
  };

  return Unit;

})();
