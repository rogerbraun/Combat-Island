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
    @units = []
    @selected =
      x: -1
      y: -1
    @hovered =
      x: -1
      y: -1
    @currentPossibleMoves = false

  getTile: (x, y) ->
    @tiles[x + y * @width]

  setTile: (x, y, tile) ->
    @tiles[x + y * @width] = tile

  loadFromString: (string, images) ->
    lines = string.split '\n'
    for line, y in lines
      elements = line.split ''
      for element, x in elements
        tile = new Tile images[element], element
        @setTile x, y, tile

  # Rework this. It's slow and slightly incorrect  
  canvasPosToMapPos: (targetX, targetY, offset, zoom) ->
    res = false
    for y in [0...@height]
      for x in [0...@width]
        if x % 2 == 1
          hexOffsetY = 100
        else
          hexOffsetY = 0

        xPos = (x * 150) / zoom + offset.x
        yPos = (y * 200 + hexOffsetY) / zoom + offset.y

        if targetX >= xPos && targetX < xPos + 200 / zoom
          if targetY >= yPos && targetY < yPos + 200 / zoom
            res =
              x: x
              y: y

            return res

  inPossibleMoves: (x, y) ->
    for move in @currentPossibleMoves
      if move.x == x && move.y == y
        return true
    return false

  restoreTiles: () ->
    for move in @currentPossibleMoves
      tile = @getTile(move.x, move.y)
      tile.restore()

  select: (targetX, targetY, offset, zoom) ->
    old_selected = @selected
    @selected = @canvasPosToMapPos targetX, targetY, offset, zoom
    if @currentPossibleMoves
      @restoreTiles()
    if @unitOnTile(old_selected.x, old_selected.y)
      unit = @getUnit(old_selected)
      if @inPossibleMoves @selected.x, @selected.y
        @moveUnit old_selected, @selected
        @selected = false
    if @unitOnTile(@selected.x, @selected.y)
      unit = @getUnit(@selected)
      @currentPossibleMoves = @possibleMoves(unit)
      for move in @currentPossibleMoves
        tile = @getTile(move.x, move.y)
        tile.invert()
    else
      @currentPossibleMoves = false

  hover: (targetX, targetY, offset, zoom) ->
    if @hovered
      tile = @getTile(@hovered.x, @hovered.y)
      if tile
        tile.restore()
    @hovered = @canvasPosToMapPos targetX, targetY, offset, zoom
    if @hovered
      tile = @getTile(@hovered.x, @hovered.y)
      if tile
        tile.brighten()

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
