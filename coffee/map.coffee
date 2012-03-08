Array::uniq = ->
  res = []
  for el in this
    if res.indexOf(el) == -1
      res.push el
  res

class Map
  constructor: (width, height) ->
    @width = width
    @height = height
    @tiles = []
    @images = {}
    @units = []
    @selected = false
    @hovered = false
    @imageCache = {}
    @currentPossibleMoves = false

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


  inPossibleMoves: (destination) ->  
    for move in @currentPossibleMoves
      if move.x == destination.x && move.y == destination.y
        return true
    return false


  select: (targetX, targetY, offset, zoom) ->
    old_selected = @selected
    @selected = @canvasPosToMapPos targetX, targetY, offset, zoom
    if @unitOnTile(old_selected.x, old_selected.y)
      unit = @getUnit(old_selected)
      if @inPossibleMoves(@selected)
        @moveUnit old_selected, @selected
        @selected = false
    if @unitOnTile(@selected.x, @selected.y)
      unit = @getUnit(@selected)
      @currentPossibleMoves = @possibleMoves(unit)
    else
      @currentPossibleMoves = false

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

  drawTile: (pos, canvas, context, offset, zoom, image) ->
    x = pos.x
    y = pos.y

    # Tiles are offset because of the hexagonal grid
    if image
      if x % 2 == 1
        hexOffsetY = 100
      else
        hexOffsetY = 0

      xPos = (x * 150) / zoom + offset.x
      yPos = (y * 200 + hexOffsetY) / zoom + offset.y
      width = image.width / zoom
      height = image.height / zoom
     
      xPos = Math.round(xPos)
      yPos = Math.round(yPos)
      width = Math.round(width)
      height = Math.round(height)

      context.drawImage image, 0, 0, image.width, image.height, xPos , yPos, width, height

  drawTiles: (canvas, context, offset, zoom) ->
    for y in [0...@height]
      for x in [0...@width]
        image = @getTileImage {x: x, y: y}
        #@drawTile({x: x, y: y}, canvas, context, offset, zoom, image)
        # Much faster this way. Let's find out why.
        if image
          if x % 2 == 1
            hexOffsetY = 100
          else
            hexOffsetY = 0
          width = image.width / zoom
          height = image.height / zoom

          xPos = (x * 150) / zoom + offset.x
          yPos = (y * 200 + hexOffsetY) / zoom + offset.y
          context.drawImage image, 0, 0, image.width, image.height, xPos , yPos, width, height

  drawSpecials: (canvas, context, offset, zoom) ->
    if @hovered
      if !@imageCache[["brightened", @getTile(@hovered.x, @hovered.y)]]
        image = @getTileImage @hovered
        @imageCache[["brightened", @getTile(@hovered.x, @hovered.y)]] = Filters.brighten(image)
      image = @imageCache[["brightened", @getTile(@hovered.x, @hovered.y)]]
      @drawTile @hovered, canvas, context, offset, zoom, image
    if @currentPossibleMoves
      for pos in @currentPossibleMoves
        if !@imageCache[["inverted", @getTile(pos.x, pos.y)]]
          image = Filters.invert(image)
          @imageCache[["inverted", @getTile(pos.x, pos.y)]] = image
        image = @imageCache[["inverted", @getTile(pos.x, pos.y)]]
        @drawTile pos, canvas, context, offset, zoom, image


    #if @inPossibleMoves pos
    #image

  getTileImage: (pos) ->
    image = @images[@getTile(pos.x, pos.y)]
        
  getUnit: (pos) ->
    for unit in @units
      if unit.pos.x == pos.x && unit.pos.y == pos.y
        return unit

  moveUnit: (from, to) ->
    unit = @getUnit from
    unit.move(to, @getTile(to.x, to.y))

  possibleMoves: (unit) ->
    @possibleMovesHelper unit, unit.moves - 1, @neighbours(unit.pos)

  possibleMovesHelper: (unit, movesLeft, neighbours, visited) ->
    that = this
    neighbours = neighbours.filter (neighbour) ->
      unit.canMoveTo(that.getTile(neighbour.x, neighbour.y)) && !that.unitOnTile(neighbour.x, neighbour.y)

    if movesLeft == 0
      neighbours
    else
      res = [].concat(neighbours)
      for neighbour in neighbours
        next_neighbours = @neighbours neighbour
        res = res.concat(@possibleMovesHelper(unit, movesLeft - 1, next_neighbours))
      res.uniq()

  unitOnTile: (x, y) ->
    @units.some (unit) ->
      unit.pos.x == x && unit.pos.y == y
      
  drawUnits: (canvas, context, offset, zoom) ->
    for unit in @units
      unit.draw canvas, context, offset, zoom, @selected

  draw: (canvas, offset, zoom) ->
    context = canvas.getContext '2d'
    @drawBackground canvas
    @drawTiles canvas, context, offset, zoom
    @drawSpecials canvas, context, offset, zoom
    @drawUnits canvas, context, offset, zoom

