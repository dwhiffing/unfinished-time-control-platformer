export default class InputService {
  constructor(scene) {
    this.scene = scene
    this.player = this.scene.level.player

    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      this.addTouchControls()
    }

    this.cursors = this.scene.input.keyboard.createCursorKeys()
    this.spaceKey = this.scene.input.keyboard.addKey('SPACE')
    this.zKey = this.scene.input.keyboard.addKey('Z')
    this.xKey = this.scene.input.keyboard.addKey('X')
    this.rKey = this.scene.input.keyboard.addKey('R')

    this.cursors.up.addListener('down', this.upPressed)
    this.cursors.left.addListener('down', this.leftPressed)
    this.cursors.right.addListener('down', this.rightPressed)
    this.cursors.down.addListener('down', this.downPressed)
    this.cursors.down.addListener('up', this.downReleased)
    this.cursors.up.addListener('up', this.upReleased)
    this.cursors.left.addListener('up', this.leftReleased)
    this.cursors.right.addListener('up', this.rightReleased)
    this.zKey.addListener('down', this.shootPressed)
    this.zKey.addListener('up', this.shootReleased)
    this.rKey.addListener('down', this.restartPressed)
    this.spaceKey.addListener('down', this.jumpPressed)
    this.spaceKey.addListener('up', this.jumpReleased)
    this.chargeSound = this.scene.sound.add('charge2', {
      rate: 0.5,
      volume: 0.5,
      loop: true,
    })
  }

  leftPressed = () => (this.player.direction.left = true)
  leftReleased = () => (this.player.direction.left = false)

  rightPressed = () => (this.player.direction.right = true)
  rightReleased = () => (this.player.direction.right = false)

  upPressed = () => (this.player.direction.up = true)
  upReleased = () => (this.player.direction.up = false)

  downPressed = () => (this.player.direction.down = true)
  downReleased = () => (this.player.direction.down = false)

  jumpPressed = () => {
    this.jumpJustPressed = true
    this.player.direction.jump = true
    this.jumpTime = +new Date()
    this.scene.time.addEvent({
      delay: 150,
      callback: this.jumpReleased,
    })
  }
  jumpReleased = () => {
    if (!this.jumpJustPressed) return

    this.jumpJustPressed = false
    this.player.jump(+new Date() - this.jumpTime)
  }

  shootPressed = () => (this.player.direction.shoot = 1)

  shootReleased = () => (this.player.direction.shoot = 0)

  restartPressed = () => {
    this.scene.sound.mute = true
    const scene = this.scene
    scene.scene.restart()
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
    this.makeButton(width - X, H, 217, 'jump').setAlpha(0)
    this.makeButton(width - X * 2, H, 218, 'shoot').setAlpha(0)
    // this.makeButton(width - X * 3, H, 219, 'missile').setAlpha(0)
  }

  makeButton = (x, y, key, type) =>
    this.scene.add
      .image(x, y, 'tilemap', key)
      .setScale(1)
      .setInteractive()
      .setScrollFactor(0)
      .setDepth(1000)
      .setAlpha(0.6)
      .on('pointerdown', this[`${type}Pressed`])
      .on('pointerup', this[`${type}Released`])
      .on('pointerout', this[`${type}Released`])

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

  update() {}
}
