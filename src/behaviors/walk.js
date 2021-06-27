export const WALK = {
  options: {},

  $create: function (entity, opts) {
    entity.canMove = true
    const scene = entity.scene
    entity.body.setMaxVelocity(600, 600)
    entity.body.useDamping = true
    entity.setDrag(0.8, 1)
    entity.walkParticles = entity.scene.add.particles('tilemap')
    entity.walkEmitter = entity.walkParticles
      .createEmitter(WALK_PARTICLE_CONFIG)
      .stop()
    entity.speed = 90

    scene.anims.create({
      key: `idle`,
      frameRate: 4,
      repeat: -1,
      frames: scene.anims.generateFrameNames('tilemap', {
        start: 153,
        end: 154,
      }),
    })

    scene.anims.create({
      key: `walk`,
      frameRate: 6,
      frames: scene.anims.generateFrameNames('tilemap', {
        start: 151,
        end: 152,
      }),
    })

    entity.walk = () => {
      if (!entity.canMove) return
      let speed = entity.speed

      if (entity.body.onFloor()) {
        if (!entity.walkEmitter.on) {
          entity.walkEmitter.flow(300 - 100)
          if (!entity.runSoundCallback) {
            entity.runSoundCallback = entity.scene.time.addEvent({
              delay: 500 - 120,
              repeat: -1,
              callback: () => {
                entity.scene.sound.play('hit2', {
                  rate: Phaser.Math.RND.between(3, 6) / 10,
                  volume: 0.2,
                })
              },
            })
          }
        }
        entity.anims.play(`walk`, true)
      }
      if (
        entity.body.onFloor() ||
        (entity.body.velocity.x < speed && entity.body.velocity.x > -speed)
      ) {
        const velo = entity.direction.left
          ? -speed
          : entity.direction.right
          ? speed
          : 0
        entity.body.setVelocityX(velo)
      }

      entity.flipX = entity.direction.left
    }

    entity.stop = () => {
      if (!entity.canMove) return
      if (entity.body.onFloor()) {
        entity.walkEmitter.stop()
        entity.anims.play(`idle`, true)
      }
    }
  },

  update(entity) {
    if (!entity.body) return

    entity.walkEmitter.setPosition(
      entity.x + (entity.flipX ? 2 : -2),
      entity.y + 6,
    )

    if (!entity.body.onFloor()) {
      if (entity.walkEmitter.on) entity.walkEmitter.stop()
    }

    if (!entity.direction.left && !entity.direction.right) {
      entity.runSoundCallback && entity.runSoundCallback.remove()
      entity.runSoundCallback = null
      entity.stop()
    } else {
      entity.walk()
    }
  },
}

const WALK_PARTICLE_CONFIG = {
  frame: 15,
  x: 0,
  y: 0,
  lifespan: { min: 300, max: 900 },
  speedX: { min: -10, max: 10 },
  speedY: { min: -10, max: -2 },
  angle: { min: 0, max: 360 },
  rotate: { min: 0, max: 360 },
  gravityY: -20,
  alpha: { start: 0.5, end: 0 },
  scale: { start: 0.2, end: 0 },
  quantity: 1,
}
