var Game, black_screen;
black_screen = {
  draw: function(canvas) {
    var context;
    context = canvas.getContext('2d');
    context.fillStyle = 'black';
    return context.fillRect(0, 0, canvas.width, canvas.height);
  }
};
Game = (function() {
  function Game(canvas) {
    this.canvas = canvas;
    this.buffer = document.createElement('canvas');
    this.map = black_screen;
    this.offset = {
      x: 0,
      y: 0
    };
    this.zoom = 2;
  }
  Game.prototype.draw = function() {
    var context, that;
    this.map.draw(this.buffer, this.offset, this.zoom);
    context = this.canvas.getContext('2d');
    context.drawImage(this.buffer, 0, 0);
    that = this;
    return window.webkitRequestAnimationFrame(function() {
      return that.draw();
    });
  };
  Game.prototype.register_handlers = function() {
    var dragging, dragpos, that;
    console.log("Registering Handlers...");
    dragging = false;
    dragpos = {
      x: 0,
      y: 0
    };
    that = this;
    this.canvas.oncontextmenu = function() {
      return false;
    };
    this.canvas.onmousedown = function(event) {
      console.log(event);
      if (event.which === 3) {
        dragging = true;
        dragpos = {
          x: event.clientX,
          y: event.clientY
        };
      }
      if (event.which === 1) {
        return that.map.select(event.clientX, event.clientY, that.offset, that.zoom);
      }
    };
    this.canvas.onmouseup = function(event) {
      return dragging = false;
    };
    this.canvas.onmousemove = function(event) {
      if (dragging) {
        that.offset.x += event.clientX - dragpos.x;
        that.offset.y += event.clientY - dragpos.y;
        dragpos.x = event.clientX;
        dragpos.y = event.clientY;
      }
      return that.map.hover(event.clientX, event.clientY, that.offset, that.zoom);
    };
    return this.canvas.onmousewheel = function(event) {
      var oldzoom;
      console.log("Zooming...");
      oldzoom = that.zoom;
      if (event.wheelDelta > 0) {
        that.zoom = Math.max(1, that.zoom - 1);
      } else {
        that.zoom = Math.min(5, that.zoom + 1);
      }
      that.offset.x *= oldzoom / that.zoom;
      return that.offset.y *= oldzoom / that.zoom;
    };
  };
  Game.prototype.fullWindow = function() {
    console.log("Resizing canvas...");
    this.canvas.width = document.body.clientWidth;
    this.canvas.height = document.body.clientHeight;
    this.buffer.width = canvas.width;
    return this.buffer.height = canvas.height;
  };
  Game.prototype.start = function() {
    console.log("Starting the game...");
    this.register_handlers();
    this.fullWindow();
    return this.draw();
  };
  return Game;
})();