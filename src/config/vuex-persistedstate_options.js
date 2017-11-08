import {cloneDeep, get, set} from 'lodash'

export function generate_persisted_state_options(instance_stores) {
  const unpersisted_state = generate_unpersisted_state(instance_stores)

  return create_options(unpersisted_state)
}

export function create_options(unpersisted_state) {
  if (!unpersisted_state) throw new Error('unpersisted_state object required')

  return {
    getState: (root_key, storage) => {
      let state = {}

      // extract keys from index (test_and_parse)
      const index_key = root_key + 'index'
      const index_keys = test_and_parse(storage.getItem(index_key))

      if (!index_keys) return state
      // iterate each key and extract value from storage (test_and_parse)
      index_keys.forEach(key => {
        // get value from storage
        const value = test_and_parse(storage.getItem(root_key + key))
        set(state, key, value)
      })
      // reconstruct state object

      unpersisted_state.forEach(({store_path, default_value}) => {
        set(state, store_path, default_value)
      })


      function test_and_parse(value) {
        try {
          return value && value !== 'undefined' ? JSON.parse(value) : undefined;
        } catch (err) {
          return undefined;
        }
      }

      return state
    },
    setState: (root_key, state, storage) => {
      let index = []

      for (const applet_name in state) {
        const applet_state = state[applet_name]
        for (const state_property in applet_state) {
          const key = `${applet_name}.${state_property}`
          const is_persisted = !unpersisted_state.some(u => u.store_path === key)
          if (is_persisted) {
            const key_specific_state = get(state, key)
            storage.setItem(root_key + key, JSON.stringify(key_specific_state))
            index.push(key)
          }
        }
      }
      const index_key = root_key + 'index'
      console.warn('setting state')
      storage.setItem(index_key, JSON.stringify(index))
    }
  }
}

export function generate_unpersisted_state(instance_stores) {
  let unpersisted_state = [{store_path: 'sw_update_available', default_value: false}, {
    store_path: 'sw_message',
    default_value: {message: null, title: null}
  }]

  for (const store_name in instance_stores) {
    const store = instance_stores[store_name]
    const paths = get(store, 'unpersisted_state_keys', [])

    paths.forEach(path => {
      const store_path = `${store_name}.${path}`
      const default_value = get(store.state, path, null)
      unpersisted_state.push({store_path, default_value})
    })
  }

  return unpersisted_state
}