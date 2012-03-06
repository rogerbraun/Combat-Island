var level1, level_str, tank;
level1 = new Map(30, 30);
level_str = "wwwwwwwwwwwwwwwwwwwwwwwwwwwwww\nwwwwwwwwwwwwwgggwwwwwwwwwwwwww\nwwwwwwwwwggggggggwwwwwwwwwwwww\nwwwwwwwwgfgggggggwwwwwwwwwwwww\nwwwwwwwgffffgggggwwwwwwwwwwwww\nwwwwwwggfffffgggggwwwwwwwwwwww\nwwwwwgfffffgggggggwwwwwwwwwwww\nwwwwwggffffffgggggwwwwwwwwwwww\nwwwwwwggggggggggwwwwwggggwwwww\nwwwwwwwwwggggwwwwgggggggwwwwww\nwwwwwwwwwwwwwwwwwwggggggwwwwww\nwwwwwwwwwwwwwwwwgggggggwwwwwww\nwwwwwwwwwwwwwwwwwwggwwwwwwwwww\nwwwwwwwwwwggwwwwwwwwwwwwwwwwww\nwwwwwwwggggggggwwwwwwwwwwwwwww\nwwwwggggffffggwwwwwwwwwwwwwwww\nwwwwwggggfffgggwwwwwwwwwwwwwww\nwwwwwwwwggggggggggwwwwwwwwwwww\nwwwwwwwwwwwggwwwwwwwwwwwwwwwww\nwwwwwwgwwggggggwwwwwwwwwwwwwww\nwwwwwwgggggffggggwwwwwwwwwwwww\nwwwwwwwggfffgggwwwwwwwwwwwwwww\nwwwwwwwwggggwwwwwwwgggggggwwww\nwwwwwwwwwwggwwwwwgggffggwwwwww\nwwwwwwwwwwwwwwwwwggffgggwwwwww\nwwwwwwwwwwwwwwwwwggggwwwwwwwww\nwwwwwwwwwwwwwwwwwwwggggwwwwwww\nwwwwwwwwwwwwwwwwwwwwwwwwwwwwww\nwwwwwwwwwwwwwwwwwwwwwwwwwwwwww\nwwwwwwwwwwwwwwwwwwwwwwwwwwwwww";
level1.loadFromString(level_str);
level1.setImage('w', 'images/water-tile.png');
level1.setImage('g', 'images/grass-tile.png');
level1.setImage('f', 'images/forest-tile.png');
tank = new Unit('images/tank-unit.png');
tank.setPosition(7, 7);
level1.units.push(tank);
window.onload = function() {
  var canvas, game;
  canvas = document.getElementById('canvas');
  game = new Game(canvas);
  game.map = level1;
  return game.start();
};