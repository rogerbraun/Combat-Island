class Unit
  constructor: (image_src) ->
    @image = new Image
    @image.src = image_src
    @pos =
      x: 0
      y: 0
    @direction = "n"
    @canMoveOn = ["g","f"]
    @moves = 3
    @imageCache = []
    @brightCache = []

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

  getCurrentImage: () ->
    @rotate @image
  
  getBrightImage: () ->
    if !@brightCache[@direction]
      image = getCurrentImage()
      image = Filters.brighten(image)
      @brightCache[@direction] = image
    @brightCache[@direction]

