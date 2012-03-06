Filters =
  invert: (image) ->
    canvas = document.createElement 'canvas'
    canvas.width = image.width
    canvas.height = image.height
    context = canvas.getContext '2d'
    context.drawImage(image,0,0)
    imgd = context.getImageData(0,0,canvas.width,canvas.height)
    pixels = imgd.data
    
    for i in [0...pixels.length] by 4
      pixels[i] = 255 - pixels[i]
      pixels[i + 1] = 255 - pixels[i + 1]
      pixels[i + 2] = 255 - pixels[i + 2]

    context.putImageData(imgd,0,0)
    canvas
