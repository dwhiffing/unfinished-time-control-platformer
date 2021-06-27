import Phaser from 'phaser'
import * as scenes from './scenes'
import BehaviorPlugin from './behavior'

const game = new Phaser.Game({
  scene: Object.values(scenes),
  type: navigator.userAgent.includes('Chrome') ? Phaser.WEBGL : Phaser.CANVAS,
  parent: 'phaser-example',
  width: 340,
  height: 240,
  zoom: 10,
  transparent: true,
  pixelArt: true,
  input: { activePointers: 3 },
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  physics: {
    default: 'arcade',
    arcade: { fps: 60, tileBias: 32, debug: false },
  },
  plugins: {
    global: [{ key: 'BehaviorPlugin', plugin: BehaviorPlugin, start: true }],
  },
})

export default game
