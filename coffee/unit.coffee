class Unit
  constructor: (image_src) ->
    image = new Image
    image.src = image_src
    that = this
    image.onload = () ->
      that.image = Filters.tilefy image
    @pos =
      x: 0
      y: 0
    @direction = "n"
    @canMoveOn = ["g","f"]
    @moves = 3
    @maxHealth = 100
    @currentHealth = 100
    @player = 1
    @imageCache = []
    @brightCache = []
    @selected = false
    @attack = 15
    @defense = 15

  setPosition: (x, y) ->
    @pos.x = x
    @pos.y = y

  canMoveTo: (tile) ->
    @canMoveOn.some (allowed) ->
      tile.element == allowed

  moveTo: (to) ->
    from = @pos
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
    if !@imageCache[@direction]
      switch @direction
        when "s" then deg = 0
        when "sw" then deg = 60
        when "nw" then deg = 120
        when "n" then deg = 180
        when "ne" then deg = 240
        when "se" then deg = 300
        else deg = 0

      image = Filters.rotate(image, deg)
      @imageCache[@direction] = image
    @imageCache[@direction]

  battle: (otherUnit) ->
    otherUnit.currentHealth -= @attack

  addHealthBar: (canvas) ->
    context = canvas.getContext '2d'
    maxWidth = canvas.width *  0.8
    offset = canvas.width * 0.1
    width = (@currentHealth / @maxHealth) * maxWidth
    # HSL!
    context.fillStyle = "hsl(#{(width / maxWidth) * 120},100%, 50%)"
    context.fillRect offset, offset, width, offset
    canvas

  getCurrentImage: () ->
    image = document.createElement 'canvas'
    image.width = @image.width
    image.height = @image.height
    ctx = image.getContext '2d'

    ctx.drawImage(@rotate(@image), 0, 0)

    if @player == 2
      image = Filters.switchColor image
    image = @addHealthBar image
    image
  
  getBrightImage: () ->
    image = getCurrentImage()
    image = Filters.brighten(image)
    image

