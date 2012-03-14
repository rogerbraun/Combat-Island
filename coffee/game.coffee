black_screen =
  draw: (canvas) ->
    context = canvas.getContext '2d'
    context.fillStyle = 'black'
    context.fillRect 0, 0, canvas.width, canvas.height

class Game
  constructor: (canvas) ->
    @canvas = canvas
    @map = black_screen
    @renderer = new CanvasRenderer(@map, @canvas)

  changeMap: (map) ->
    @map = map
    @renderer.map = map

  register_handlers: () ->
    console.log "Registering Handlers..."
    dragging = false
    dragpos =
      x: 0
      y: 0

    that = this

    @canvas.oncontextmenu = () ->
      false

    @canvas.onmousedown = (event) ->
      # Right Click
      if event.which == 3
        dragging = true
        dragpos =
          x: event.clientX
          y: event.clientY

      # Left Click
      if event.which == 1
        that.map.select(event.clientX, event.clientY, that.renderer.offset, that.renderer.zoom)

    @canvas.onmouseup = (event) ->
      dragging = false

    @canvas.onmousemove = (event) ->
      if dragging
        that.renderer.offset.x += event.clientX - dragpos.x
        that.renderer.offset.y += event.clientY - dragpos.y
        dragpos.x = event.clientX
        dragpos.y = event.clientY

      that.map.hover(event.clientX, event.clientY, that.renderer.offset, that.renderer.zoom)

    @canvas.onmousewheel = (event) ->
      console.log("Zooming...")
      oldzoom = that.renderer.zoom
      if event.wheelDelta > 0
        if oldzoom > 1
          that.renderer.zoom -= 1
          that.renderer.offset.x -= event.clientX
          that.renderer.offset.y -= event.clientY
      else
        if oldzoom < 5
          that.renderer.zoom += 1 
          that.renderer.offset.x -= event.clientX
          that.renderer.offset.y -= event.clientY

      if oldzoom != that.renderer.zoom
        that.renderer.offset.x *= (oldzoom / that.renderer.zoom)
        that.renderer.offset.y *= (oldzoom / that.renderer.zoom)
        that.renderer.offset.x += (that.canvas.width / 2)
        that.renderer.offset.y += (that.canvas.height / 2)

  fullWindow: () ->
    console.log "Resizing canvas..."
    @canvas.width = document.body.clientWidth
    @canvas.height = document.body.clientHeight

  start: () ->
    console.log("Starting the game...")
    @register_handlers()
    @fullWindow()
    @renderer.ready()
    @renderer.draw()
