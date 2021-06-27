export const JUMP = {
  options: {},

  $create: function (entity, opts) {
    entity.body.setGravityY(500)
    entity.jumpCount = 1
    const scene = entity.scene

    entity.particles = entity.scene.add.particles('tilemap')
    entity.jumpEmitter = entity.particles
      .createEmitter(JUMP_PARTICLE_CONFIG)
      .stop()

    scene.anims.create({
      key: `jump`,
      frameRate: 5,
      frames: scene.anims.generateFrameNames('tilemap', {
        start: 155,
        end: 156,
      }),
    })

    entity.jump = () => {
      if (!entity.canMove) return
      if (entity.direction.down && entity.canFall) {
        return entity.fall()
      }

      if (entity.jumpCount > 0) {
        entity.jumpCount--
        entity.jumpEmitter.explode(20)
        entity.scene.sound.play('jump', {
          rate: Phaser.Math.RND.between(8, 10) / 10,
        })
        if (entity.anims) entity.anims.play(`jump`, true)

        entity.body && entity.body.setVelocityY(-200)
      }
    }
  },

  update(entity) {
    if (!entity.body) return

    entity.jumpEmitter.setPosition(
      entity.x + (entity.flipX ? 2 : -2),
      entity.y + 6,
    )

    if (!entity.body.onFloor()) {
      entity.inAir = true
    }

    if (entity.body.onFloor() && entity.inAir) {
      entity.inAir = false
      entity.jumpCount = 1
      entity.jumpEmitter.explode(20)
      entity.scene.sound.play('hit2', {
        rate: Phaser.Math.RND.between(9, 10) / 10,
        volume: 0.5,
      })
    } else {
      entity.body.setAllowGravity(true)
    }

    entity.fall = () => {
      if (this.body.onFloor() && this.canFall) {
        this.body.setVelocityY(20)
        this.scene.level.playerCollider.active = false
        this.scene.time.addEvent({
          delay: 400,
          callback: () => {
            this.scene.level.playerCollider.active = true
          },
        })
      }
    }
  },
}

const JUMP_PARTICLE_CONFIG = {
  frame: 15,
  x: 0,
  y: 0,
  lifespan: { min: 300, max: 900 },
  speedX: { min: -30, max: 30 },
  speedY: { min: -20, max: 20 },
  angle: { min: 0, max: 360 },
  rotate: { min: 0, max: 360 },
  gravityY: -10,
  alpha: { start: 0.5, end: 0 },
  scale: { start: 0.2, end: 0 },
}
