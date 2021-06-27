import { TRACKABLE } from '../behaviors'

export class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'tilemap', 50)
    this.fire = this.fire.bind(this)
    scene.physics.world.enable(this)
    this.scene.behavior.enable(this)
    this.behaviors.set('trackable', TRACKABLE)
    this.body.setAllowGravity(false)
    this.speed = 200
    this.scene = scene
    this.damageAmount = 10
    this.emitter = this.scene.particles
      .createEmitter(BULLET_EMITTER_CONFIG)
      .stop()
  }

  fire(x, y, directionX, directionY, lifeSpan = 250) {
    this.startX = x
    this.setActive(true)
      .setVisible(true)
      .setPosition(x, y)
      .setFrame(50)
      .setSize(8, 8)
      .setScale(1)
      .setVelocityX(this.speed * directionX)
      .setVelocityY(
        (directionX === 0 ? this.speed : this.speed * 0.5) * directionY,
      )
    this.lifeSpan = lifeSpan
  }

  update() {
    if (!this.active) return

    this.emitter.setPosition(this.x, this.y)
    if (Math.abs(this.x - this.startX) > this.lifeSpan) {
      this.die(true)
    }
  }

  die(useSound = true) {
    if (!this.active) return

    this.emitter.explode(1)
    useSound && this.scene.playSound('hit', [15, 20], { volume: 0.5 })
    this.setActive(false)
    this.setVisible(false)
  }
}

const BULLET_EMITTER_CONFIG = {
  frame: 15,
  x: 0,
  y: 0,
  lifespan: { min: 300, max: 900 },
  speedX: { min: -40, max: 40 },
  speedY: { min: -40, max: 40 },
  angle: { min: 0, max: 360 },
  rotate: { min: 0, max: 360 },
  gravityY: -0,
  alpha: { start: 0.5, end: 0 },
  scale: { start: 0.3, end: 0 },
  quantity: 1,
}
