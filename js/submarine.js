var Submarine;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
Submarine = (function() {
  __extends(Submarine, Unit);
  function Submarine() {
    Submarine.__super__.constructor.call(this, 'images/submarine-unit.png');
    this.moves = 5;
    this.canMoveOn = ["w"];
  }
  return Submarine;
})();