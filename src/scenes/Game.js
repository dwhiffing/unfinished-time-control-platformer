import HudService from '../services/Hud'
import InputService from '../services/input'
import LevelService from '../services/level'
import Background from '../sprites/Background'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' })
  }

  create() {
    this.behavior = this.plugins.get('BehaviorPlugin')
    this.background = new Background(this)
    this.particles = this.add.particles('tilemap')
    this.level = new LevelService(this, 'map')
    this.inputService = new InputService(this)
    this.hud = new HudService(this)
    this.history = { player: [] }
    this._time = 0
    this.timeScale = 1
  }

  playSound(key, _rate = [8, 10], opts = {}) {
    const rate = (Phaser.Math.RND.between(..._rate) / 10) * this.timeScale
    this.sound.play(key, { rate, ...opts })
  }

  update(time, delta) {
    this._time = Math.max(0, this._time + delta * this.timeScale)
    this.behavior.preUpdate()
    this.behavior.update()
    this.level.update(time, delta)
  }
}
