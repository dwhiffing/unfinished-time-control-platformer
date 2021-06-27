import { WALK, FALL, JUMP, SHOOT, HEALTH } from '../behaviors'

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, object) {
    super(scene, object.x, object.y, 'tilemap')
    this.scene = scene
    this.direction = { left: false, right: false, up: false, down: false }
    this.type = object.name
    this.name = 'player'

    this.scene.add.existing(this)
    this.scene.physics.world.enable(this)
    this.scene.cameras.main.startFollow(this, true, 0.1, 0.1, 0, 5)
    this.scene.behavior.enable(this)

    this.setSize(7, 11)
    this.setOffset(5, 5)
    this.setDepth(2)
    this.setAlpha(1)

    const getFrames = (start, end) =>
      scene.anims.generateFrameNames('tilemap', { start, end })

    scene.anims.create({
      key: `idle`,
      frameRate: 4,
      repeat: -1,
      frames: getFrames(153, 154),
    })

    scene.anims.create({
      key: `walk`,
      frameRate: 6,
      frames: getFrames(151, 152),
    })

    scene.anims.create({
      key: 'jump',
      frameRate: 5,
      frames: getFrames(155, 156),
    })

    this.behaviors.set('walk', WALK)
    this.behaviors.set('jump', JUMP)
    this.behaviors.set('fall', FALL)
    this.behaviors.set('shoot', SHOOT)
    this.behaviors.set('health', HEALTH, {
      maxHealth: 100,
      screenShake: true,
      knockback: 100,
      onHealthChange: (v) => this.scene.hud?.healthText.setText(v),
      onDestroy: () => this.scene.scene.restart(),
    })
  }
}
