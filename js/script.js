var images, level1, level_str, sub, tank, tank2;

level1 = new Map(30, 30);

level_str = "wwwwwwwwwwwwwwwwwwwwwwwwwwwwww\nwwggwwwwwwwwwgggwwwwwwwwwwwwww\nwwwggwwwwggggggggwwwwwwwwwwwww\nwwwgggwwgfgggggggwwwwwwwwwwwww\nwwwwggggffffgggggwwwwwwwwwwwww\nwwwwwwggfffffgggggwwwwwwwwwwww\nwwwwwgfffffgggggggwwwwwwwwwwww\nwwwwwggffffffgggggwwwwwwwwwwww\nwwwwwwggggggggggwwwwwggggwwwww\nwwwwwwwwwggggwwwwgggggggwwwwww\nwwwwwwwwwwwwwwwwwwggggggwwwwww\nwwwwwwwwwwwwwwwwgggggggwwwwwww\nwwwwwwwwwwwwwwwwwwggwwwwwwwwww\nwwwwwwwwwwggwwwwwwwwwwwwwwwwww\nwwwwwwwggggggggwwwwwwwwwwwwwww\nwwwwggggffffggwwwwwwwwwwwwwwww\nwwwwwggggfffgggwwwwwwwwwwwwwww\nwwwwwwwwggggggggggwwwwwwwwwwww\nwwwwwwwwwwwggwwwwwwwwwwwwwwwww\nwwwwwwgwwggggggwwwwwwwwwwwwwww\nwwwwwwgggggffggggwwwwwwwwwwwww\nwwwwwwwggfffgggwwwwwwwwwwwwwww\nwwwwwwwwggggwwwwwwwgggggggwwww\nwwwwwwwwwwggwwwwwgggffggwwwwww\nwwwwwwwwwwwwwwwwwggffgggwwwwww\nwwwwwwwwwwwwwwwwwggggwwwwwwwww\nwwwwwwwwwwwwwwwwwwwggggwwwwwww\nwwwwwwwwwwwwwwwwwwwwwwwwwwwwww\nwwwwwwwwwwwwwwwwwwwwwwwwwwwwww\nwwwwwwwwwwwwwwwwwwwwwwwwwwwwww";

images = {
  w: new ImageSet('images/water-tile.png'),
  g: new ImageSet('images/grass-tile.png'),
  f: new ImageSet('images/forest-tile.png')
};

level1.loadFromString(level_str, images);

tank = new Unit('images/tank-unit.png');

tank.setPosition(7, 7);

tank.currentHealth = 50;

tank2 = new Unit('images/tank-unit.png');

tank2.setPosition(3, 3);

sub = new Submarine;

sub.currentHealth = 20;

level1.units.push(tank);

level1.units.push(tank2);

level1.units.push(sub);

window.onload = function() {
  var canvas, game;
  canvas = document.getElementById('canvas');
  game = new Game(canvas);
  game.changeMap(level1);
  return game.start();
};
