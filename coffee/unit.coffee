class Unit
  constructor: (image_src) ->
    @image = new Image
    @image.src = image_src
    @pos =
      x: 0
      y: 0
    @direction = "s"
    @canMoveOn = ["g","f"]

  setPosition: (x, y) ->
    @pos.x = x
    @pos.y = y

  canMoveTo: (tile) ->
    @canMoveOn.some (allowed) ->
      tile == allowed

  draw: (canvas, offset, zoom, selected) ->
    context = canvas.getContext '2d'

    x = @pos.x
    y = @pos.y

    if x % 2 == 1
      hexOffsetY = 100
    else
      hexOffsetY = 0

    image = @image

    if selected.x == x && selected.y == y
      image = Filters.brighten(image)

    xPos = (x * 150 + 50) / zoom + offset.x  
    yPos = (y * 200 + hexOffsetY + 50) / zoom + offset.y 

    context.drawImage image, 0, 0, image.width, image.height, xPos , yPos, image.width / zoom, image.height / zoom
