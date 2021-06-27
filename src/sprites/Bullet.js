export class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'tilemap', 50)
    this.fire = this.fire.bind(this)
    scene.physics.world.enable(this)
    this.body.setAllowGravity(false)
    this.speed = 200
    this.damageAmount = 10
    this.particles = this.scene.add.particles('tilemap')
    this.emitter = this.particles.createEmitter(BULLET_EMITTER_CONFIG).stop()
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
    this.emitter.setPosition(this.x, this.y)
    if (Math.abs(this.x - this.startX) > this.lifeSpan) {
      this.destroy(false)
    }
  }

  destroy(useSound = true) {
    this.emitter.explode(1)
    useSound &&
      this.scene.sound.play('hit', {
        rate: Phaser.Math.RND.between(15, 20) / 10,
        volume: 0.5,
      })
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
