class Submarine extends Unit
  constructor: () ->
    super 'images/submarine-unit.png'
    @moves = 5
    @canMoveOn = ["w"]
