class Map
  constructor: (width, height) ->
    @width = width
    @height = height
    @tiles = []
    @images = {}
    @units = []
    @selected = false
    @hovered = false

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

  # Rework this. It's slow and slightly incorrect  
  canvasPosToMapPos: (targetX, targetY, offset, zoom) ->
    res = false
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
              res =
                x: x
                y: y
    res


  select: (targetX, targetY, offset, zoom) ->
    @selected = @canvasPosToMapPos targetX, targetY, offset, zoom

  hover: (targetX, targetY, offset, zoom) ->
    @hovered = @canvasPosToMapPos targetX, targetY, offset, zoom

  neighbours: (pos) ->
    x = pos.x
    y = pos.y

    hexDiff = if x % 2 == 0 then -1 else 1

    neighbours = [
      # Above, Below
      {x: x, y: y + 1},
      {x: x, y: y - 1},

      # Independent
      {x: x - 1, y: y},
      {x: x + 1, y: y},

      # Dependent
      {x: x + 1, y: y + hexDiff},
      {x: x - 1, y: y + hexDiff}
    ]

    that = this

    neighbours = neighbours.filter (neighbour) ->
      neighbour.x >= 0 && neighbour.y >= 0 && neighbour.x < that.width && neighbour.y < that.height

    neighbours

  drawTile: (pos, canvas, offset, zoom, image) ->
    x = pos.x
    y = pos.y
    context = canvas.getContext '2d'

    # Tiles are offset because of the hexagonal grid
    if image
      if x % 2 == 1
        hexOffsetY = 100
      else
        hexOffsetY = 0

      xPos = (x * 150) / zoom + offset.x
      yPos = (y * 200 + hexOffsetY) / zoom + offset.y

      context.drawImage image, 0, 0, image.width, image.height, xPos , yPos, image.width / zoom, image.height / zoom

  drawTiles: (canvas, offset, zoom) ->
    for y in [0...@height]
      for x in [0...@width]
        image = @images[@getTile(x, y)]
        @drawTile({x: x, y: y}, canvas, offset, zoom, image)

  drawSpecials: (canvas, offset, zoom) ->
    if @selected
      if @unitOnTile(@selected.x, @selected.y)
        if @hovered
          image = @images[@getTile(@hovered.x, @hovered.y)]
          image = Filters.brighten(image)
          @drawTile(@hovered, canvas, offset, zoom, image)
      else
        image = @images[@getTile(@selected.x, @selected.y)]
        image = Filters.brighten(image)
        @drawTile(@selected, canvas, offset, zoom, image)
        
  moveUnit: (from, to) ->
    for unit in @units
      if unit.pos.x == from.x && unit.pos.y == from.y
        unit.move(to, @getTile(to.x, to.y))

  unitOnTile: (x, y) ->
    @units.some (unit) ->
      unit.pos.x == x && unit.pos.y == y
      
  drawUnits: (canvas, offset, zoom) ->
    for unit in @units
      unit.draw canvas, offset, zoom, @selected

  draw: (canvas, offset, zoom) ->
    @drawBackground canvas
    @drawTiles canvas, offset, zoom
    @drawSpecials canvas, offset, zoom
    @drawUnits canvas, offset, zoom

