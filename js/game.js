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
    this.map = black_screen;
    this.renderer = new CanvasRenderer(this.map, this.canvas);
  }

  Game.prototype.changeMap = function(map) {
    this.map = map;
    return this.renderer.map = map;
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
        return that.map.select(event.clientX, event.clientY, that.renderer.offset, that.renderer.zoom);
      }
    };
    this.canvas.onmouseup = function(event) {
      return dragging = false;
    };
    this.canvas.onmousemove = function(event) {
      if (dragging) {
        that.renderer.offset.x += event.clientX - dragpos.x;
        that.renderer.offset.y += event.clientY - dragpos.y;
        dragpos.x = event.clientX;
        dragpos.y = event.clientY;
      }
      return that.map.hover(event.clientX, event.clientY, that.renderer.offset, that.renderer.zoom);
    };
    return this.canvas.onmousewheel = function(event) {
      var oldzoom;
      console.log("Zooming...");
      oldzoom = that.renderer.zoom;
      if (event.wheelDelta > 0) {
        that.renderer.zoom = Math.max(1, that.renderer.zoom - 1);
      } else {
        that.renderer.zoom = Math.min(5, that.renderer.zoom + 1);
      }
      that.renderer.offset.x *= oldzoom / that.renderer.zoom;
      return that.renderer.offset.y *= oldzoom / that.renderer.zoom;
    };
  };

  Game.prototype.fullWindow = function() {
    console.log("Resizing canvas...");
    this.canvas.width = document.body.clientWidth;
    return this.canvas.height = document.body.clientHeight;
  };

  Game.prototype.start = function() {
    console.log("Starting the game...");
    this.register_handlers();
    this.fullWindow();
    return this.renderer.draw();
  };

  return Game;

})();
