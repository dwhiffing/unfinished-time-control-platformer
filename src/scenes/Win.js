import Background from '../sprites/Background'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Win' })
  }

  create() {
    this.behavior = this.plugins.get('BehaviorPlugin')

    const { width, height } = this.cameras.main
    this.background = new Background(this)

    this.add
      .bitmapText(width / 2, height / 2 - 10, 'pixel-dan', 'YOU WIN')
      .setCenterAlign()
      .setFontSize(5)
      .setOrigin(0.5)

    this.add
      .image(width / 2 - 15, height - 10, 'tilemap', 223)
      .setInteractive()
      .on('pointerdown', () => this.scene.start('Game'))

    this.add
      .image(width / 2 + 15, height - 10, 'tilemap', 224)
      .setInteractive()
      .on('pointerdown', () => this.scene.start('Credits'))
  }

  update() {
    this.behavior.preUpdate()
    this.behavior.update()
  }
}
