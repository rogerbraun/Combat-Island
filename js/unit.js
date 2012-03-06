var Unit;
Unit = (function() {
  function Unit(image_src) {
    this.image = new Image;
    this.image.src = image_src;
    this.orig_image = this.image;
    this.pos = {
      x: 0,
      y: 0
    };
    this.direction = "s";
    this.canMoveOn = ["g", "f"];
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
    image = this.image;
    if (selected.x === x && selected.y === y) {
      image = Filters.brighten(image);
    }
    xPos = (x * 150 + 50) / zoom + offset.x;
    yPos = (y * 200 + hexOffsetY + 50) / zoom + offset.y;
    return context.drawImage(image, 0, 0, image.width, image.height, xPos, yPos, image.width / zoom, image.height / zoom);
  };
  return Unit;
})();