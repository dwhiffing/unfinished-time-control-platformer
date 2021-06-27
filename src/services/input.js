export default class InputService {
  constructor(scene) {
    this.scene = scene
    this.direction = {}
    const noop = () => {}

    const player = this.scene.level.player

    this.listeners = {
      leftPressed: () => (this.direction.left = true),
      leftReleased: () => (this.direction.left = false),
      rightPressed: () => (this.direction.right = true),
      rightReleased: () => (this.direction.right = false),
      upPressed: () => (this.direction.up = true),
      upReleased: () => (this.direction.up = false),
      downPressed: () => (this.direction.down = true),
      downReleased: () => (this.direction.down = false),
      zPressed: () => player.shoot(),
      spacePressed: () => {
        if (this.direction.down) player.fall()
        else player.jump()
      },
      cPressed: () => {
        this.scene.timeScale = -1
      },
      cReleased: () => {
        this.scene.timeScale = 1
      },
      xPressed: () => {
        this.scene.tweens.add({
          targets: [
            this.scene.physics.world,
            this.scene,
            this.scene.time,
            this.scene.tweens,
            this.scene.particles,
            player.anims,
          ],
          props: { timeScale: { value: (a, b, c, d) => (d === 0 ? 4 : 0.25) } },
          ease: 'Power1',
          duration: 800,
        })
      },
      xReleased: () => {
        this.scene.tweens.add({
          targets: [
            this.scene.physics.world,
            this.scene,
            this.scene.time,
            this.scene.tweens,
            this.scene.particles,
            player.anims,
          ],
          props: { timeScale: 1 },
          ease: 'Power1',
          duration: 800,
        })
      },
    }

    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      this.addTouchControls()
    } else {
      this.cursors = this.scene.input.keyboard.createCursorKeys()
      this.spaceKey = this.scene.input.keyboard.addKey('SPACE')
      this.zKey = this.scene.input.keyboard.addKey('Z')
      this.xKey = this.scene.input.keyboard.addKey('X')
      this.cKey = this.scene.input.keyboard.addKey('C')

      this.cursors.up.addListener('down', this.listeners.upPressed || noop)
      this.cursors.up.addListener('up', this.listeners.upReleased || noop)
      this.cursors.left.addListener('down', this.listeners.leftPressed || noop)
      this.cursors.left.addListener('up', this.listeners.leftReleased || noop)
      this.cursors.right.addListener(
        'down',
        this.listeners.rightPressed || noop,
      )
      this.cursors.right.addListener('up', this.listeners.rightReleased || noop)
      this.cursors.down.addListener('down', this.listeners.downPressed || noop)
      this.cursors.down.addListener('up', this.listeners.downReleased || noop)
      this.zKey.addListener('down', this.listeners.zPressed || noop)
      this.zKey.addListener('up', this.listeners.zReleased || noop)
      this.xKey.addListener('down', this.listeners.xPressed || noop)
      this.xKey.addListener('up', this.listeners.xReleased || noop)
      this.cKey.addListener('down', this.listeners.cPressed || noop)
      this.cKey.addListener('up', this.listeners.cReleased || noop)
      this.spaceKey.addListener('down', this.listeners.spacePressed || noop)
      this.spaceKey.addListener('up', this.listeners.spaceReleased || noop)
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
