export const JUMP = {
  options: {
    gravity: 500,
    jumpHeight: 200,
    jumpCount: 2,
    playSound: true,
    emitter: true,
  },

  $create: function (entity, opts) {
    entity.body.setGravityY(opts.gravity)
    entity.jumpCount = 1

    if (opts.emitter)
      entity.jumpEmitter = entity.scene.add
        .particles('tilemap')
        .createEmitter(JUMP_PARTICLE_CONFIG)
        .stop()

    entity.jump = () => {
      if (entity.tintFill || entity.jumpCount === 0) return

      entity.body.useDamping = false
      entity.jumpCount--
      entity.body?.setVelocityY(-opts.jumpHeight)
      entity.anims?.play('jump', true)

      if (opts.emitter) entity.jumpEmitter.explode(20)

      if (opts.playSound) {
        const rate = Phaser.Math.RND.between(8, 10) / 10
        entity.scene.sound.play('jump', { rate })
      }
    }

    entity.land = () => {
      if (!entity.inAir) return

      entity.inAir = false
      entity.body.useDamping = true
      entity.jumpCount = opts.jumpCount

      if (opts.emitter) entity.jumpEmitter.explode(20)

      if (opts.playSound) {
        const rate = Phaser.Math.RND.between(9, 10) / 10
        entity.scene.sound.play('hit2', { rate, volume: 0.5 })
      }
    }
  },

  update(entity) {
    if (!entity.body) return

    entity.jumpEmitter?.setPosition(
      entity.x + (entity.flipX ? 2 : -2),
      entity.y + 10,
    )

    if (entity.body?.onFloor()) {
      entity.land()
    } else {
      entity.body.setAllowGravity(true)
      entity.inAir = true
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

export const FALL = {
  options: {},

  $create: function (entity, opts) {
    entity.fall = () => {
      if (!entity.body?.onFloor() || !entity.canFall) return

      entity.body.setVelocityY(20)
      entity.scene.level.playerCollider.active = false
      entity.scene.time.addEvent({
        delay: 400,
        callback: () => {
          entity.scene.level.playerCollider.active = true
        },
      })
    }
  },

  update(entity) {},
}
