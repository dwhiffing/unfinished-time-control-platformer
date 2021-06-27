export const UNLOCK = {
  options: {},

  $create: function (entity, opts) {
    entity.unlocks = {}
    entity.unlock = (name) => {
      entity.unlocks[name] = entity.unlocks[name] || 0
      entity.unlocks[name]++

      entity.scene.sound.play('upgrade')
      entity.scene.upgradeText.setText(`${upgradeText} UPGRADE ${extraText}`)
      entity.scene.time.addEvent({
        delay: 6000,
        callback: () => entity.scene.upgradeText.setText(''),
      })
    }
  },
}
