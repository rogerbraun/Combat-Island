Array::uniq = ->
  res = []
  for el in this
    if res.indexOf(el) == -1
      res.push el
  res

Array::remove = (el) ->
  removeIndex = false
  found = false
  for cmp, index in this
    if cmp == el
      removeIndex = index
      found = true
  if found
    this.splice(removeIndex, 1)
  else
    this

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
    @overlays = []
    @brightOverlay = false
    @sounds = {}

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

  selectUnit: () ->
    @selectedUnit = @getUnit(@selected)
    @currentPossibleMoves = @possibleMoves(@selectedUnit)

  deSelectUnit: () ->
    @selectedUnit = false
    @currentPossibleMoves = false

  possiblySelectUnit: () ->
    if @getUnit(@selected).player == @currentPlayer
      @selectUnit()

  switchPlayer: () ->
    if @currentPlayer == 1
      @currentPlayer = 2
    else
      @currentPlayer = 1

  animatedMove: (unit, goal, callback) ->
    path = @findPath(unit, goal).path

    moveAlongPath = () ->
      if path.length > 0
        if path.length == 1 && callback
          callback()
        else
          next = path.shift()
          unit.moveTo(next)
          setTimeout moveAlongPath, 150 

    moveAlongPath path

  playSound: (sound) ->
    if @sounds[sound]
      audio = new Audio
      audio.src = @sounds[sound]
      audio.play()

  moveAndAttack: (unit, otherUnit) ->
    that = this
    @animatedMove unit, otherUnit.pos, () ->
      unit.battle otherUnit
      if otherUnit.currentHealth <= 0
        that.playSound 'die'
        that.units.remove otherUnit
      else
        that.playSound 'attack'

  possiblyMoveUnit: () ->
    if @inPossibleMoves @selected
      if @unitOnTile @selected
        # Attack unit on selected tile
        @moveAndAttack(@selectedUnit, @getUnit(@selected))
      else
        # Move unit to empty tile
        @animatedMove @selectedUnit, @selected
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
    @hovered = pos

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
    # Find an impossible path, this gets all possible moves.
    @findPath(unit, {x: -1, y: -1}, unit.moves).visitedNodes

  uniquePositions: (array) ->
    res = []
    contains = (array, element) ->
      array.some (cmp) ->
        element.x == cmp.x && cmp.y == element.y

    for element in array
      if !contains(res, element)
        res.push element
    res

  # Supposed to be an A* algorithm
  findPath: (unit, goal, maxWeight) ->

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

    while open.length > 0 && !isEqualNode(sortNodes(open)[0], goalNode)
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

        if !inOpen && !inClosed && (!(maxWeight?) || neighbourNode.weight <= maxWeight)
          open.push neighbourNode
  
    res = []
    if open.length > 0
      goalNode = open[0]
      while goalNode.parent
        res.push(goalNode)
        goalNode = goalNode.parent

      res = res.map (el) ->
        el.pos
      res = res.reverse()
    ret = {
      path: res,
      visitedNodes: closed.map (node) ->
        node.pos
    }
    return ret

  unitOnTile: (tilePos) ->
    @units.some (unit) ->
      unit.pos.x == tilePos.x && unit.pos.y == tilePos.y
