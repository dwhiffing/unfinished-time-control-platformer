import { Bullet } from '../sprites/Bullet'
export const SHOOT = {
  options: {},

  $create: function (entity, opts) {
    entity.canShoot = true
    entity.gun = entity.scene.add
      .image(entity.x, entity.y, 'tilemap', 52)
      .setDepth(99)

    entity.bullets = entity.scene.add.group({
      classType: Bullet,
      maxSize: 10,
      runChildUpdate: true,
    })

    entity.shoot = () => {
      if (!entity.canShoot) return

      const bullet = entity.bullets.get()
      if (!bullet) return

      entity.canShoot = false
      entity.direction.shoot = 0

      entity.scene.time.addEvent({
        delay: 200,
        callback: () => (entity.canShoot = true),
      })

      const { up, down, left, right } = entity.direction
      const dX = up || (down && !(left || right)) ? 0 : entity.flipX ? -1 : 1

      bullet.fire(entity.x, entity.y + 2, dX, up ? -1 : down ? 1 : 0, 50)
      entity.scene.sound.play('shoot', {
        rate: Phaser.Math.RND.between(8, 10) / 10,
      })
    }
  },

  update(entity) {
    entity.gun.setPosition(entity.x + (entity.flipX ? -5 : 5), entity.y + 3)
    entity.gun.flipX = entity.flipX

    if (entity.direction.shoot) {
      entity.shoot(1, entity.direction.shoot)
    }
  },
}
