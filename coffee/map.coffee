class Map
  constructor: (width, height) ->
    @width = width
    @height = height
    @tiles = []
    @images = {}
    @selected = false
  
  getTile: (x, y) ->
    @tiles[x + y * @width]

  setTile: (x, y, element) ->
    @tiles[x + y * @width] = element

  setImage: (letter, src) ->
    image = new Image
    image.src = src
    @images[letter] = image
        
  loadFromString: (string) ->
    lines = string.split '\n'
    for line, y in lines
      elements = line.split ''
      for element, x in elements
        @setTile x, y, element

  drawBackground: (canvas) ->
    context = canvas.getContext '2d'
    context.fillStyle = 'black'
    context.fillRect 0, 0, canvas.width, canvas.height

  select: (targetX, targetY, offset, zoom) ->
    for y in [0...@height]
      for x in [0...@width]
        image = @images[@getTile(x, y)]
        if image
          if x % 2 == 1
            hexOffsetY = 100
          else
            hexOffsetY = 0

          xPos = (x * 150) / zoom + offset.x
          yPos = (y * 200 + hexOffsetY) / zoom + offset.y

          if targetX >= xPos && targetX < xPos + image.width / zoom
            if targetY >= yPos && targetY < yPos + image.height / zoom
              @selected =
                x: x
                y: y
              console.log @selected

  drawTiles: (canvas, offset, zoom) ->
    context = canvas.getContext '2d'

    for y in [0...@height]
      for x in [0...@width]
        image = @images[@getTile(x, y)]
        if image
          if x % 2 == 1
            hexOffsetY = 100
          else
            hexOffsetY = 0

          xPos = (x * 150) / zoom + offset.x
          yPos = (y * 200 + hexOffsetY) / zoom + offset.y

          if @selected.x == x && @selected.y == y
            image = Filters.invert(image)

          context.drawImage image, 0, 0, image.width, image.height, xPos , yPos, image.width / zoom, image.height / zoom
  
  draw: (canvas, offset, zoom) ->
    @drawBackground(canvas)
    @drawTiles(canvas, offset, zoom)

