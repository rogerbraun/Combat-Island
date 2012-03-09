level1 = new Map(30,30)

level_str = """
            wwwwwwwwwwwwwwwwwwwwwwwwwwwwww
            wwggwwwwwwwwwgggwwwwwwwwwwwwww
            wwwggwwwwggggggggwwwwwwwwwwwww
            wwwgggwwgfgggggggwwwwwwwwwwwww
            wwwwggggffffgggggwwwwwwwwwwwww
            wwwwwwggfffffgggggwwwwwwwwwwww
            wwwwwgfffffgggggggwwwwwwwwwwww
            wwwwwggffffffgggggwwwwwwwwwwww
            wwwwwwggggggggggwwwwwggggwwwww
            wwwwwwwwwggggwwwwgggggggwwwwww
            wwwwwwwwwwwwwwwwwwggggggwwwwww
            wwwwwwwwwwwwwwwwgggggggwwwwwww
            wwwwwwwwwwwwwwwwwwggwwwwwwwwww
            wwwwwwwwwwggwwwwwwwwwwwwwwwwww
            wwwwwwwggggggggwwwwwwwwwwwwwww
            wwwwggggffffggwwwwwwwwwwwwwwww
            wwwwwggggfffgggwwwwwwwwwwwwwww
            wwwwwwwwggggggggggwwwwwwwwwwww
            wwwwwwwwwwwggwwwwwwwwwwwwwwwww
            wwwwwwgwwggggggwwwwwwwwwwwwwww
            wwwwwwgggggffggggwwwwwwwwwwwww
            wwwwwwwggfffgggwwwwwwwwwwwwwww
            wwwwwwwwggggwwwwwwwgggggggwwww
            wwwwwwwwwwggwwwwwgggffggwwwwww
            wwwwwwwwwwwwwwwwwggffgggwwwwww
            wwwwwwwwwwwwwwwwwggggwwwwwwwww
            wwwwwwwwwwwwwwwwwwwggggwwwwwww
            wwwwwwwwwwwwwwwwwwwwwwwwwwwwww
            wwwwwwwwwwwwwwwwwwwwwwwwwwwwww
            wwwwwwwwwwwwwwwwwwwwwwwwwwwwww
            """

images =
  w: new ImageSet 'images/water-tile.png'
  g: new ImageSet 'images/grass-tile.png'
  f: new ImageSet 'images/forest-tile.png'

level1.loadFromString level_str, images

tank = new Unit('images/tank-unit.png')
tank.setPosition(7, 7)
tank.currentHealth = 50

tank2 = new Unit('images/tank-unit.png')
tank2.setPosition(3, 3)
tank2.player = 2

sub = new Submarine
sub.currentHealth = 20

sub2 = new Submarine
sub2.setPosition(4,10)
sub2.currentHealth = 10
sub2.player = 2

level1.units.push(tank)
level1.units.push(tank2)
level1.units.push(sub)
level1.units.push(sub2)


window.onload = () ->
  canvas = document.getElementById 'canvas'
  game = new Game(canvas)
  game.changeMap level1
  game.start()
