export class ObjectSprite extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, object) {
    super(scene, object.x, object.y, 'tilemap')
    this.overlap = this.overlap.bind(this)

    this.scene = scene
    this.type = object.type
    this.name = object.name
    this.gid = object.gid
    this.scene.physics.world.enable(this)
    this.scene.add.existing(this)

    this.setOrigin(0, 1)
    this.setFrame(this.gid - 1)

    setTimeout(() => {
      if (this.body && this.type === 'coin') {
        entity.body.setDamping(true)
        this.setSize(15, 15)
        this.setOffset(1, 1)
      }
      if (this.body && this.type === 'upgrade') {
        this.setSize(15, 15)
        this.setOffset(1, 1)
      }
    }, 0)
  }

  overlap(player) {
    // if (this.type === 'coin')
    if (this.type === 'upgrade') {
      player.unlock(this.name)
    }
    if (this.type === 'health') {
      this.scene.sound.play('pickup')
      player.heal(20)
    }

    this.destroy()
  }
}
