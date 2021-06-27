import pick from 'lodash/pick'
const HISTORY_RATE = 60
export const TRACKABLE = {
  options: {},

  $create: function (entity, opts) {
    entity.history = []
    entity.last_frame = 0
  },

  preUpdate: function (entity) {
    let current_frame = Math.floor((entity.scene._time / 1000) * HISTORY_RATE)

    while (current_frame > entity.last_frame) {
      entity.history.unshift(
        pick(entity, ['x', 'y', 'flipX', 'active', 'visible']),
      )
      entity.last_frame += 1
    }

    while (entity.last_frame > current_frame && entity.history.length > 0) {
      let current_state = entity.history.shift()
      Object.entries(current_state).forEach(([k, v]) => (entity[k] = v))
      entity.last_frame -= 1
    }
  },
}
