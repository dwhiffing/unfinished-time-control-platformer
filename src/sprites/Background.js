import { SCROLL } from '../behaviors'

export default class extends Phaser.GameObjects.TileSprite {
  constructor(
    scene,
    x = 0,
    y = 0,
    width = window.innerWidth,
    height = window.innerHeight,
    key = 'background',
  ) {
    super(scene, x, y, width, height, key)
    scene.add.existing(this)
    scene.behavior.enable(this)
    this.behaviors.set('scroll', SCROLL)
  }
}
