export const SCROLL = {
  options: {},

  $create: function (entity, opts) {
    entity.iter = 0
    entity.setScrollFactor(0)
  },

  update(entity) {
    entity.iter += 0.001
    entity.tilePositionX = Math.floor(Math.cos(-entity.iter) * 100)
    entity.tilePositionY = Math.floor(Math.sin(-entity.iter) * 400)
  },
}
