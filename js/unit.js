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
  }

  Unit.prototype.setPosition = function(x, y) {
    this.pos.x = x;
    return this.pos.y = y;
  };

  Unit.prototype.canMoveTo = function(tile) {
    return this.canMoveOn.some(function(allowed) {
      return tile === allowed;
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
    return Filters.rotate(image, deg);
  };

  Unit.prototype.draw = function(canvas, offset, zoom, selected) {
    var context, hexOffsetY, image, x, xPos, y, yPos;
    context = canvas.getContext('2d');
    x = this.pos.x;
    y = this.pos.y;
    if (x % 2 === 1) {
      hexOffsetY = 100;
    } else {
      hexOffsetY = 0;
    }
    image = this.rotate(this.image);
    if (selected.x === x && selected.y === y) image = Filters.brighten(image);
    xPos = (x * 150 + 50) / zoom + offset.x;
    yPos = (y * 200 + hexOffsetY + 50) / zoom + offset.y;
    return context.drawImage(image, 0, 0, image.width, image.height, xPos, yPos, image.width / zoom, image.height / zoom);
  };

  return Unit;

})();
