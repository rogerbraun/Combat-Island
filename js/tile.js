var ImageSet, Tile;
ImageSet = (function() {
  function ImageSet(imageSrc) {
    var that;
    this.normal = new Image;
    this.normal.src = imageSrc;
    that = this;
    this.normal.onload = function() {
      that.brightened = Filters.brighten(that.normal);
      return that.inverted = Filters.invert(that.normal);
    };
  }
  return ImageSet;
})();
Tile = (function() {
  function Tile(imageSet, element) {
    this.imageSet = imageSet;
    this.element = element;
    this.currentImage = imageSet.normal;
    this.oldImages = [];
  }
  return Tile;
})();