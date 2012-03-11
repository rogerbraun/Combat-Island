class ImageSet
  constructor: (imageSrc) ->
    @normal = new Image
    @normal.src = imageSrc
    that = this
    @normal.onload = () ->
      that.brightened = Filters.brighten that.normal
      that.inverted = Filters.invert that.normal

class Tile
  constructor: (imageSet, element) ->
    @imageSet = imageSet
    @element = element
    @currentImage = imageSet.normal
    @oldImages = []
