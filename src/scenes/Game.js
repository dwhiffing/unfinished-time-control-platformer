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
    this.hud = new HudService(this)
    this.level = new LevelService(this, 'map')
    this.player = this.level.player

    // TODO: move to behavior?
    this.inputService = new InputService(this, {
      leftPressed: () => (this.player.direction.left = true),
      leftReleased: () => (this.player.direction.left = false),
      rightPressed: () => (this.player.direction.right = true),
      rightReleased: () => (this.player.direction.right = false),
      upPressed: () => (this.player.direction.up = true),
      upReleased: () => (this.player.direction.up = false),
      downPressed: () => (this.player.direction.down = true),
      downReleased: () => (this.player.direction.down = false),
      shootPressed: () => (this.player.direction.shoot = 1),
      shootReleased: () => (this.player.direction.shoot = 0),
      jumpPressed: () => this.player.jump(150),
      restartPressed: () => this.scene.restart(),
    })
  }

  update(time, delta) {
    this.behavior.preUpdate()
    this.behavior.update()
    this.level.update(time, delta)
  }
}
