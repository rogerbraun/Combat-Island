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

tank2 = new Unit('images/tank-unit.png')
tank2.setPosition(3, 3)

sub = new Submarine

level1.units.push(tank)
level1.units.push(tank2)
level1.units.push(sub)


window.onload = () ->
  canvas = document.getElementById 'canvas'
  game = new Game(canvas)
  game.changeMap level1
  game.start()
