import { Bullet } from '../sprites/Bullet'

export const SHOOT = {
  options: {
    poolSize: 10,
    delay: 200,
  },

  $create: function (entity, opts) {
    entity.canShoot = true
    entity.gun = entity.scene.add
      .image(entity.x, entity.y, 'tilemap', 52)
      .setDepth(99)

    entity.bullets = entity.scene.add.group({
      classType: Bullet,
      maxSize: opts.poolSize,
      runChildUpdate: true,
    })

    entity.shoot = () => {
      if (!entity.canShoot) return
      entity.canShoot = false
      entity.scene.time.addEvent({
        delay: opts.delay,
        callback: () => (entity.canShoot = true),
      })

      const bullet = entity.bullets.get()
      if (!bullet) return

      const { up, down, left, right } = entity.scene.inputService.direction
      const dX = up || (down && !(left || right)) ? 0 : entity.flipX ? -1 : 1
      bullet.fire(entity.x, entity.y + 2, dX, up ? -1 : down ? 1 : 0, 50)

      entity.scene.playSound('shoot', [8, 10])
    }
  },

  update(entity) {
    entity.gun.setPosition(entity.x + (entity.flipX ? -5 : 5), entity.y + 3)
    entity.gun.flipX = entity.flipX
  },
}
