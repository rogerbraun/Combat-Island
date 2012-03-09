class CanvasRenderer
  constructor: (map, canvas) ->
    @map = map
    @canvas = canvas
    @context = @canvas.getContext '2d'
    @frames = 0
    @fps = 0
    @zoom = 2
    @offset =
      x: 0
      y: 0
    that = this
    setInterval () ->
      that.fps = that.frames
      that.frames = 0
    , 1000

    window.requestAnimationFrame ||= window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame

  drawBackground: () ->
    @context.fillStyle = 'black'
    @context.fillRect 0, 0, @canvas.width, @canvas.height

  drawFps: () ->
    @context.fillStyle = 'white'
    @context.fillText "FPS: #{@fps}", 15, 15

  drawTiles: () ->
    for y in [0...@map.height]
      for x in [0...@map.width]
        if (@map.hovered.x == x && @map.hovered.y == y) || (@map.selected.x == x && @map.selected.y == y)
          image = @map.getBrightImage {x: x, y: y}
        else if @map.inPossibleMoves -x, -y
          image = @map.getInvertedImage {x: x, y: y}
        else
          image = @map.getImage {x: x, y: y}
        @drawImage({x: x, y: y}, image)

  drawUnits: () ->
    for unit in @map.units
      @drawUnit unit

  drawUnit: (unit) ->
    image = unit.getCurrentImage()
    if @map.selected.x == unit.pos.x && @map.selected.y == unit.pos.y
      image = Filters.brighten image
    @drawImage(unit.pos, image)

  drawImage: (pos, image) ->
    x = pos.x
    y = pos.y

    if x % 2 == 1
      hexOffsetY = 100
    else
      hexOffsetY = 0

    xPos = (x * 150) / @zoom + @offset.x + ((200 - image.width) / @zoom / 2)
    yPos = (y * 200 + hexOffsetY) / @zoom + @offset.y + ((200 - image.height) / @zoom / 2)
    width = image.width / @zoom
    height = image.height / @zoom
   
    xPos = Math.round(xPos)
    yPos = Math.round(yPos)
    width = Math.round(width)
    height = Math.round(height)

    @context.drawImage image, 0, 0, image.width, image.height, xPos , yPos, width, height

  draw: () ->
    that = this
    window.requestAnimationFrame () ->
      that.drawBackground()
      that.drawTiles()
      that.drawUnits()
      that.drawFps()

      that.frames += 1
      that.draw()

