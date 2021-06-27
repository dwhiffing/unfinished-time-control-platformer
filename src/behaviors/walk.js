export const WALK = {
  options: {
    speed: 20,
    maxSpeed: 100,
    drag: 0.9,
    sound: true,
    emitter: true,
  },

  $create: function (entity, opts) {
    entity.body.setMaxVelocity(opts.maxSpeed, opts.maxSpeed * 2)
    entity.body.useDamping = true
    entity.setDrag(opts.drag, 1)
    entity.speed = opts.speed

    const playWalkSound = () => {
      if (!opts.sound) return
      const rate = Phaser.Math.RND.between(3, 6) / 10
      entity.scene.sound.play('hit2', { rate, volume: 0.2 })
    }

    if (opts.emitter)
      entity.walkEmitter = entity.scene.add
        .particles('tilemap')
        .createEmitter(WALK_PARTICLE_CONFIG)
        .stop()

    entity.walk = (isLeft) => {
      if (entity.tintFill) return

      entity.flipX = isLeft
      entity.anims.play(`walk`, true)

      const s = entity.body?.onFloor() ? entity.speed : entity.speed / 3
      entity.body.velocity.x += isLeft ? -s : s

      if (!entity.body?.onFloor()) return

      if (!entity.walkEmitter.on) entity.walkEmitter.flow(200)

      if (!entity.runSoundCallback)
        entity.runSoundCallback = entity.scene.time.addEvent({
          delay: 380,
          repeat: -1,
          callback: playWalkSound,
        })
    }

    entity.stop = () => {
      if (entity.tintFill || !entity.body?.onFloor()) return

      entity.walkEmitter.stop()
      entity.runSoundCallback?.remove()
      entity.runSoundCallback = null
      entity.anims.play(`idle`, true)
    }
  },

  update(entity) {
    const { x, y, flipX } = entity

    entity.walkEmitter?.setPosition(x + (flipX ? 2 : -2), y + 6)

    if (!entity.body?.onFloor() && entity.walkEmitter.on)
      entity.walkEmitter.stop()

    const { left, right } = entity.scene.inputService.direction
    if (left || right) {
      entity.walk(left)
    } else {
      entity.stop()
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
