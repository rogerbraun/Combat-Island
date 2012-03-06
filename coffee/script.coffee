level1 = new Map(30,30)

level_str = """
            wwwwwwwwwwwwwwwwwwwwwwwwwwwwww
            wwwwwwwwwwwwwgggwwwwwwwwwwwwww
            wwwwwwwwwggggggggwwwwwwwwwwwww
            wwwwwwwwgfgggggggwwwwwwwwwwwww
            wwwwwwwgffffgggggwwwwwwwwwwwww
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

level1.loadFromString level_str

level1.setImage 'w', 'images/water-tile.png'
level1.setImage 'g', 'images/grass-tile.png'
level1.setImage 'f', 'images/forest-tile.png'

window.onload = () ->
  canvas = document.getElementById 'canvas'
  game = new Game(canvas)
  game.map = level1
  game.start()
