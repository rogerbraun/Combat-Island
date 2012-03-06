class Unit
  constructor: (image_src) ->
    @image = new Image
    @image.src = image_src
    @pos =
      x: 0
      y: 0
    @direction = "n"
    @canMoveOn = ["g","f"]

  setPosition: (x, y) ->
    @pos.x = x
    @pos.y = y

  canMoveTo: (tile) ->
    @canMoveOn.some (allowed) ->
      tile == allowed

  move: (to, tile) ->
    from = @pos
    if @canMoveTo(tile)
      @pos = to
      @calcDirection(from, to)

  calcDirection: (from, to) ->
    dir = ""
    if from.y < to.y 
      dir += "s"
    else 
      dir += "n"
    
    if from.x < to.x
      dir += "e"
    if from.x > to.x
      dir += "w"

    @direction = dir

  rotate: (image) ->
    switch @direction
      when "s" then deg = 0
      when "sw" then deg = 60
      when "nw" then deg = 120
      when "n" then deg = 180
      when "ne" then deg = 240
      when "se" then deg = 300
      else deg = 0

    Filters.rotate(image, deg)

  draw: (canvas, offset, zoom, selected) ->
    context = canvas.getContext '2d'

    x = @pos.x
    y = @pos.y

    if x % 2 == 1
      hexOffsetY = 100
    else
      hexOffsetY = 0

    image = @rotate(@image)


    if selected.x == x && selected.y == y
      image = Filters.brighten(image)

    xPos = (x * 150 + 50) / zoom + offset.x  
    yPos = (y * 200 + hexOffsetY + 50) / zoom + offset.y 

    context.drawImage image, 0, 0, image.width, image.height, xPos , yPos, image.width / zoom, image.height / zoom
