import pick from 'lodash/pick'
const HISTORY_RATE = 30
export const TRACKABLE = {
  options: {},

  $create: function (entity, opts) {
    entity.history = []
    entity.last_frame = 0
  },

  preUpdate: function (entity) {
    let current_frame = Math.floor((entity.scene._time / 1000) * HISTORY_RATE)

    if (entity.isClone) {
      entity.body.setGravityY(0)
      let current_state = entity.history[current_frame]
      if (current_state) {
        entity.last_frame = current_frame
        Object.entries(current_state).forEach(([k, v]) => (entity[k] = v))
        console.log(current_state)
      }
    } else {
      while (current_frame > entity.last_frame && !entity.isClone) {
        entity.body.setGravityY(500)

        entity.history.push(
          pick(entity, ['x', 'y', 'flipX', 'active', 'visible']),
        )
        entity.last_frame += 1
      }

      while (entity.last_frame > current_frame && entity.history.length > 0) {
        entity.body.setGravityY(0)
        let current_state = entity.history.pop()
        Object.entries(current_state).forEach(([k, v]) => (entity[k] = v))
        entity.last_frame -= 1
      }
    }
  },
}
