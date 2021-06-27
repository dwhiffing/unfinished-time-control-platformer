import Background from '../sprites/Background'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Credits' })
  }

  create() {
    this.behavior = this.plugins.get('BehaviorPlugin')

    const { width, height } = this.cameras.main
    this.background = new Background(this)

    this.add
      .image(width - 12, height - 10, 'tilemap', 223)
      .setInteractive()
      .on('pointerdown', () => this.scene.start('Game'))

    this.add
      .bitmapText(
        5,
        height / 2 + 5,
        'pixel-dan',
        'DANIEL WHIFFING'.toUpperCase(),
      )
      .setFontSize(5)
      .setOrigin(0, 0.5)
  }

  update() {
    this.behavior.preUpdate()
    this.behavior.update()
  }
}
