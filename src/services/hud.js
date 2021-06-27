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
      .setDepth(998)

    this.heartImage = this.scene.add
      .image(10, 8, 'tilemap', 47)
      .setScrollFactor(0)
      .setDepth(999)
    this.healthText = this.scene.add
      .bitmapText(20, 6, 'pixel-dan', '100')
      .setScrollFactor(0)
      .setDepth(999)

    this.timerImage = this.scene.add
      .image(width - 25, 9, 'tilemap', 212)
      .setScrollFactor(0)
      .setDepth(999)
    this.timerText = this.scene.add
      .bitmapText(width - 18, 6, 'pixel-dan', this.timer + 1)
      .setScrollFactor(0)
      .setDepth(999)

    this.upgradeText = this.scene.add
      .bitmapText(10, height - 10, 'pixel-dan', '')
      .setScrollFactor(0)
      .setDepth(999)

    this.scene.time.addEvent({
      delay: 1000,
      repeat: -1,
      callback: () => {
        if (this.timer < 0) {
          this.scene.scene.restart()
        }
        if (this.timer >= 0) this.timerText.setText(this.timer--)
      },
    })
  }
}
