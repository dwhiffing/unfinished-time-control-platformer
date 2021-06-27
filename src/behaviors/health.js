export const HEALTH = {
  options: {},

  $create: function (entity, opts) {
    entity.maxHealth = 100
    entity.health = entity.maxHealth
    entity.scene.hud.healthText.text = entity.health.toString()

    entity.heal = (amount) => {
      entity.health += amount
      if (entity.health > entity.maxHealth) {
        entity.health = entity.maxHealth
      }

      entity.scene.hud.healthText.text = entity.health.toString()
    }

    entity.damage = (amount) => {
      if (entity.justDamaged) return

      entity.justDamaged = true
      entity.scene.cameras.main.shake(100, 0.015)
      entity.health -= amount
      entity.setTintFill(0xffffff)
      entity.scene.sound.play('hit', {
        rate: Phaser.Math.RND.between(8, 10) / 10,
      })
      if (entity.health <= 0) entity.die()

      entity.scene.hud.healthText.text = entity.health.toString()
      entity.setVelocity(entity.flipX ? 100 : -100, -100)
      entity.canMove = false
      entity.scene.time.addEvent({
        delay: 250,
        callback: () => {
          entity.canMove = true
          entity.clearTint()
        },
      })
      entity.scene.time.addEvent({
        delay: 1000,
        callback: () => {
          entity.justDamaged = false
        },
      })
    }

    entity.die = () => {
      entity.scene.cameras.main.shake(200, 0.02)
      entity.scene.time.addEvent({
        delay: 500,
        callback: () => {
          entity.scene.scene.restart()
          entity.destroy()
        },
      })
    }
  },

  update(entity) {},
}
