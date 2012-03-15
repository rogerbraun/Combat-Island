var Loader;

Loader = (function() {

  function Loader(arrOfAssets, onComplete) {
    var asset, assetString, extension, that, _i, _len;
    this.assets = [];
    this.all = arrOfAssets.length;
    that = this;
    for (_i = 0, _len = arrOfAssets.length; _i < _len; _i++) {
      assetString = arrOfAssets[_i];
      extension = assetString.substring(assetString.lastIndexOf('.') + 1).toLowerCase();
      if (extension === 'wav') {
        asset = new Audio;
        asset.src = assetString;
        if (navigator.userAgent.indexOf('Chrome') !== -1) that.all -= 1;
      } else if (extension === 'png') {
        asset = new Image;
        asset.src = assetString;
      }
      asset.onload = function(el) {
        that.assets.push(this);
        if (that.assets.length === that.all) return onComplete();
      };
    }
  }

  return Loader;

})();
