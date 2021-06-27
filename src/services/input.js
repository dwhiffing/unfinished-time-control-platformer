export default class InputService {
  constructor(scene, listeners = {}) {
    this.scene = scene
    this.listeners = listeners
    const noop = () => {}

    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      this.addTouchControls()
    } else {
      this.cursors = this.scene.input.keyboard.createCursorKeys()
      this.spaceKey = this.scene.input.keyboard.addKey('SPACE')
      this.zKey = this.scene.input.keyboard.addKey('Z')
      this.xKey = this.scene.input.keyboard.addKey('X')
      this.rKey = this.scene.input.keyboard.addKey('R')

      this.cursors.up.addListener('down', listeners.upPressed || noop)
      this.cursors.up.addListener('up', listeners.upReleased || noop)
      this.cursors.left.addListener('down', listeners.leftPressed || noop)
      this.cursors.left.addListener('up', listeners.leftReleased || noop)
      this.cursors.right.addListener('down', listeners.rightPressed || noop)
      this.cursors.right.addListener('up', listeners.rightReleased || noop)
      this.cursors.down.addListener('down', listeners.downPressed || noop)
      this.cursors.down.addListener('up', listeners.downReleased || noop)
      this.zKey.addListener('down', listeners.shootPressed || noop)
      this.zKey.addListener('up', listeners.shootReleased || noop)
      this.spaceKey.addListener('down', listeners.jumpPressed || noop)
      this.spaceKey.addListener('up', listeners.jumpReleased || noop)
      this.rKey.addListener('down', listeners.restartPressed || noop)
    }
  }

  addTouchControls() {
    const { height, width } = this.scene.cameras.main
    const X = 25
    const Y = 20
    const H = height - Y

    this.makeButton(X, height - Y, 216, 'left')
    this.makeButton(X * 1.8, H * 1.6, 213, 'up')
    this.makeButton(X * 1.8, H + Y * 0.6, 215, 'down')
    this.makeButton(X * 2.6, H, 214, 'right')
    this.makeButton(width - X, H, 217, 'jump')
    this.makeButton(width - X * 2, H, 218, 'shoot')
  }

  makeButton = (x, y, key, type) => {
    const noop = () => {}
    return this.scene.add
      .image(x, y, 'tilemap', key)
      .setScale(1)
      .setInteractive()
      .setScrollFactor(0)
      .setDepth(1000)
      .setAlpha(0.6)
      .on('pointerdown', this.listeners[`${type}Pressed`] || noop)
      .on('pointerup', this.listeners[`${type}Released`] || noop)
      .on('pointerout', this.listeners[`${type}Released`] || noop)
  }

  cleanup = () => {
    this.cursors.up.removeListener('down')
    this.cursors.left.removeListener('down')
    this.cursors.right.removeListener('down')
    this.cursors.down.removeListener('down')
    this.zKey.removeListener('down')
    this.spaceKey.removeListener('down')
    this.cursors.down.removeListener('up')
    this.cursors.up.removeListener('up')
    this.cursors.left.removeListener('up')
    this.cursors.right.removeListener('up')
  }
}
