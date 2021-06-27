import { WALK, JUMP, SHOOT, HEALTH } from '../behaviors'

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, object) {
    super(scene, object.x, object.y, 'tilemap')
    this.scene = scene
    this.direction = { left: false, right: false, up: false, down: false }

    this.type = object.name
    this.name = 'player'

    this.scene.add.existing(this)
    this.scene.physics.world.enable(this)
    this.setSize(7, 11).setOffset(5, 5).setDepth(2).setAlpha(1)
    this.scene.cameras.main.startFollow(this, true, 0.1, 0.1, 0, 5)

    this.scene.behavior.enable(this)
    this.behaviors.set('walk', WALK)
    this.behaviors.set('jump', JUMP)
    this.behaviors.set('shoot', SHOOT)
    this.behaviors.set('health', HEALTH)
  }
}
