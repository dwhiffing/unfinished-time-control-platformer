import { HEALTH } from '../behaviors'
import { ObjectSprite } from './Object'

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, props) {
    super(scene, props.x, props.y - 8, 'tilemap')

    this.object = props
    this.scene = scene
    this.scene.add.existing(this)
    this.scene.physics.world.enable(this)
    this.scene.behavior.enable(this)
    this.behaviors.set('health', HEALTH, {
      maxHealth: 50,
      onDestroy: this.onDestroy,
    })

    this.type = +getPropValue(props, 'type', 0) || +props.gid - 76
    this.delay = getPropValue(props, 'delay', 0)
    this.direction = getPropValue(props, 'direction', 1)
    this.speed = getPropValue(props, 'speed', 1) * 50
    this.setSize(8, 9)
    this.setOffset(4, 8)
    this.setFrame(this.type + 75)
  }

  update() {
    const { x, y } = this.scene.level.player

    if (Phaser.Math.Distance.Between(this.x, this.y, x, y) < 200) {
      this.setActive(true)
      this.spawn()
    } else {
      this.setActive(false)
      this.setPosition(this.object.x, this.object.y - 8)
    }
  }

  spawn = () => {
    if (this.spawned) return
    this.spawned = true

    this.body.setGravityY(800)
    this.setVelocity(-this.speed, 0)
    this.callback = this.scene.time.addEvent({
      delay: 1000 + this.delay * 500,
      repeat: -1,
      callback: () => {
        this.setVelocityX(this.speed * this.direction)
        this.setFlipX(this.direction === 1)
        this.direction = this.direction === 1 ? -1 : 1

        if (!this.active) return this.setVelocity(0)
      },
    })
  }

  onDestroy = () => {
    this.callback && this.callback.remove()
    this.scene?.sound.play('enemyDead')

    const roll = Phaser.Math.RND.integerInRange(0, 10)
    if (roll <= 3) return
    this.scene.level.coins.add(
      new ObjectSprite(this.scene, {
        x: this.x,
        y: this.y + 10,
        type: 'health',
        gid: 48,
      }),
    )
  }
}

const getPropValue = (props, n, value = 0) =>
  (props.properties || []).find((p) => p.name === n)?.value || value
