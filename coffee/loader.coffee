class Loader
  constructor: (arrOfAssets, onComplete) ->
    this.assets = []
    this.all = arrOfAssets.length
    that = this
    for assetString in arrOfAssets
      extension = assetString.substring(assetString.lastIndexOf('.') + 1).toLowerCase()
      if extension == 'wav'
        asset = new Audio
        asset.src = assetString
        if navigator.userAgent.indexOf('Chrome') != -1
          that.all -= 1
      else if extension == 'png'
        asset = new Image
        asset.src = assetString

      asset.onload = (el) ->
        that.assets.push this
        if that.assets.length == that.all
          onComplete()
