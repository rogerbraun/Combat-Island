black_screen =
  draw: (canvas) ->
    context = canvas.getContext '2d'
    context.fillStyle = 'black'
    context.fillRect 0, 0, canvas.width, canvas.height

class Game
  constructor: (canvas) ->
    @canvas = canvas
    @map = black_screen
    @offset =
      x: 0
      y: 0
    @zoom = 2

  draw: () ->
    @map.draw(@canvas, @offset, @zoom)
   
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
      console.log event
      # Right Click
      if event.which == 3
        dragging = true
        dragpos =
          x: event.clientX
          y: event.clientY

      # Left Click
      if event.which == 1
        old_selected = that.map.selected

        that.map.select(event.clientX, event.clientY, that.offset, that.zoom)

        # Move units if previous click was on unit and new one is on empty tile
        if that.map.unitOnTile(old_selected.x, old_selected.y) && !that.map.unitOnTile(that.map.selected.x, that.map.selected.y)
          console.log("Moving unit...")
          that.map.moveUnit(old_selected, that.map.selected)
          # deselect
          that.map.selected = false

        that.draw()

    @canvas.onmouseup = (event) ->
      dragging = false

    @canvas.onmousemove = (event) ->
      if dragging
        that.offset.x += event.clientX - dragpos.x
        that.offset.y += event.clientY - dragpos.y
        dragpos.x = event.clientX
        dragpos.y = event.clientY

      that.map.select(event.clientX, event.clientY, that.offset, that.zoom, true)
      that.draw()

    @canvas.onmousewheel = (event) ->
      console.log("Zooming...")
      oldzoom = that.zoom
      if event.wheelDelta > 0
        that.zoom = Math.max 1, that.zoom - 1
      else
        that.zoom = Math.min 5, that.zoom + 1
      that.offset.x *= (oldzoom / that.zoom)
      that.offset.y *= (oldzoom / that.zoom)
      that.draw()

  fullWindow: () ->
    console.log "Resizing canvas..."
    @canvas.width = document.body.clientWidth
    @canvas.height = document.body.clientHeight

  start: () ->
    console.log("Starting the game...")
    @register_handlers()
    @fullWindow()
    @draw()
