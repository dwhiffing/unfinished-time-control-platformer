export default class HudService {
  constructor(scene) {
    this.scene = scene
    this.timer = 299
    const { width, height } = this.scene.cameras.main

    this.background = this.scene.add
      .graphics(0, 0)
      .fillStyle(0x181425)
      .fillRect(0, 0, width, 17)
      .fillStyle(0x3a4466)
      .fillRect(1, 1, width - 2, 15)
      .fillStyle(0x181425)
      .fillRect(2, 2, width - 4, 13)
      .setScrollFactor(0)

    this.heartImage = this.scene.add
      .image(10, 8, 'tilemap', 47)
      .setScrollFactor(0)
    this.timerImage = this.scene.add
      .image(width - 25, 9, 'tilemap', 212)
      .setScrollFactor(0)

    this.healthText = this.addText(20, 6, '100')
    this.timerText = this.addText(width - 18, 6, this.timer + 1)
    this.upgradeText = this.addText(10, height - 10, '')

    this.scene.time.addEvent({
      delay: 1000,
      repeat: -1,
      callback: () => {
        if (this.timer < 0) this.scene.scene.restart()
        else this.timerText.setText(this.timer--)
      },
    })
  }

  addText = (x, y, text = '') =>
    this.scene.add.bitmapText(x, y, 'pixel-dan', text).setScrollFactor(0)
}
