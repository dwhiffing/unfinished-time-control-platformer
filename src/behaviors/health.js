export const HEALTH = {
  options: {
    maxHealth: 100,
    onDamageSoundKey: 'hit',
    screenShake: false,
    knockback: 0,
    onHealthChange: () => {},
    onDestroy: () => {},
  },

  $create: function (entity, opts) {
    entity.maxHealth = opts.maxHealth
    entity.health = entity.maxHealth
    opts.onHealthChange(entity.health)

    entity.heal = (amount) => {
      entity.health += amount
      if (entity.health > entity.maxHealth) {
        entity.health = entity.maxHealth
      }
      opts.onHealthChange(entity.health)
    }

    entity.damage = (amount) => {
      if (entity.tintFill) return

      entity.health -= amount
      opts.onHealthChange(entity.health)

      if (entity.health <= 0) entity.die()

      entity.setTintFill(0xffffff)
      entity.scene.time.addEvent({
        delay: 400,
        callback: entity.clearTint.bind(entity),
      })

      entity.setVelocity(
        entity.flipX ? opts.knockback : -opts.knockback,
        -opts.knockback,
      )

      if (opts.screenShake) entity.scene.cameras.main.shake(100, 0.015)

      if (opts.onDamageSoundKey) entity.scene.playSound(opts.onDamageSoundKey)
    }

    entity.die = () => {
      if (opts.screenShake) entity.scene.cameras.main.shake(200, 0.02)

      entity.scene.time.addEvent({
        delay: 500,
        callback: () => {
          opts.onDestroy()
          entity.destroy()
        },
      })
    }
  },
}
