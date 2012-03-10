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
    @currentPlayer = 1
    @selectedUnit = false
    @hoveredTile = false

  getTile: (pos) ->
    @tiles[pos.x + pos.y * @width]

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

  inPossibleMoves: (pos) ->
    for move in @currentPossibleMoves
      if move.x == pos.x && move.y == pos.y
        return true
    return false

  restoreTiles: () ->
    for move in @currentPossibleMoves
      tile = @getTile(move)
      tile.restore()

  invertTiles: () ->
    for move in @currentPossibleMoves
      tile = @getTile(move)
      tile.invert()

  selectUnit: () ->
    @selectedUnit = @getUnit(@selected)
    @currentPossibleMoves = @possibleMoves @selectedUnit
    @invertTiles()

  deSelectUnit: () ->
    @selectedUnit = false
    @restoreTiles()
    @currentPossibleMoves = false

  possiblySelectUnit: () ->
    if @getUnit(@selected).player == @currentPlayer
      @selectUnit()

  switchPlayer: () ->
    if @currentPlayer == 1
      @currentPlayer = 2
    else
      @currentPlayer = 1

  possiblyMoveUnit: () ->
    if @inPossibleMoves @selected
      if @unitOnTile @selected
        # Attack unit on selected tile
        @selectedUnit.battle(@getUnit(@selected))
      else
        # Move unit to empty tile
        @selectedUnit.moveTo(@selected)
      @deSelectUnit()
      @switchPlayer()
    else
      @deSelectUnit()

  select: (targetX, targetY, offset, zoom) ->
    @selected = @canvasPosToMapPos targetX, targetY, offset, zoom

    if @selectedUnit
      @possiblyMoveUnit()
    else
      if @unitOnTile @selected
        @possiblySelectUnit()

  hover: (targetX, targetY, offset, zoom) ->
    pos = @canvasPosToMapPos targetX, targetY, offset, zoom
    newHoveredTile = @getTile pos
    if newHoveredTile && (@hoveredTile != newHoveredTile)
      if @hoveredTile
        @hoveredTile.restore()
      @hoveredTile = newHoveredTile
      @hoveredTile.brighten()

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

  isPossibleMove: (unit, pos) ->
    tile = @getTile pos
    unit.canMoveTo(tile) && (!@unitOnTile(pos) || (@unitOnTile(pos).player != @currentPlayer))

  possibleMoves: (unit) ->
    @possibleMovesHelper unit, unit.moves - 1, @neighbours(unit.pos)

  possibleMovesHelper: (unit, movesLeft, neighbours, visited) ->
    that = this
    neighbours = neighbours.filter (neighbour) ->
      that.isPossibleMove unit, neighbour

    if movesLeft == 0
      neighbours
    else
      res = [].concat(neighbours)
      for neighbour in neighbours
        next_neighbours = @neighbours neighbour
        res = res.concat(@possibleMovesHelper(unit, movesLeft - 1, next_neighbours))
      res.uniq()

  # Supposed to be an A* algorithm
  findPath: (unit, goal) ->
    
    isEqualNode = (node, otherNode) ->
      node.pos.x == otherNode.pos.x && node.pos.y == otherNode.pos.y

    # See http://3dmdesign.com/development/hexmap-coordinates-the-easy-way
    heuristicWeight = (node) ->
      deltaX = node.pos.x - goal.x
      deltaY = node.pos.y - goal.y
      deltaD = deltaX - deltaY

      Math.max(Math.abs(deltaX), Math.abs(deltaY), Math.abs(deltaD))

    combinedWeight = (node) ->
      node.weight + heuristicWeight(node)

    sortNodes = (set) ->
      set.sort (node, otherNode) ->
        combinedWeight(node) - combinedWeight(otherNode)

    getNode = (node, set) ->
      for otherNode in set
        if isEqualNode(node, otherNode)
          return otherNode
      return false

    removeNode = (node, set) ->
      nodeIndex = false
      for possibleNode, index in set
        if isEqualNode(possibleNode, node)
          nodeIndex = index
      set.splice(nodeIndex, 1)

    startNode =
      pos: unit.pos
      weight: 0
    
    goalNode =
      pos: goal

    open = [startNode]
    closed = []


    while !isEqualNode(sortNodes(open)[0], goalNode)
      currentNode = open.shift()
      closed.push(currentNode)
      
      neighbours = @neighbours currentNode.pos
      neighbours = neighbours.filter (neighbour) ->
        @isPossibleMove unit, neighbour
      , this

      for neighbour in neighbours
        neighbourNode =
          pos: neighbour
          weight: currentNode.weight + 1
          parent: currentNode

        inOpen = getNode(neighbourNode, open)
        inClosed = getNode(neighbourNode, closed)

        if inOpen && inOpen.weight > neighbourNode.weight
          removeNode(inOpen, open)
        if inClosed && inClosed.weight > neighbourNode.weight
          removeNode(inClosed, closed)
          
        inOpen = getNode(neighbourNode, open)
        inClosed = getNode(neighbourNode, closed)

        if !inOpen && !inClosed
          open.push neighbourNode

  
    res = []
    goalNode = open[0]
    while goalNode.parent
      res.push(goalNode)
      goalNode = goalNode.parent

    #debugging
    res.map (node) ->
      @getTile(node.pos).brighten()
    , this

    console.log res

  unitOnTile: (tilePos) ->
    @units.some (unit) ->
      unit.pos.x == tilePos.x && unit.pos.y == tilePos.y
