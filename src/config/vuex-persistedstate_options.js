import {cloneDeep, get, set} from 'lodash'

const default_index_key_suffix = 'index'

/**
 * Designed to be called on application load
 * @param instance_stores
 * @returns {{getState, setState}}
 */
export function generate_persisted_state_options(instance_stores) {
  const unpersisted_state = generate_unpersisted_state(instance_stores)

  needs_upgrade()

  return create_options(unpersisted_state)
}

/**
 *
 * @param state
 * @param unpersisted_state
 * @param storage
 * @param root_key
 */
function persist_multiple_stores(state, unpersisted_state, storage, root_key) {
  let index = []

  for (const applet_name in state) {
    const applet_state = state[applet_name]
    for (const state_property in applet_state) {

      const key = from_path_to_key([applet_name,state_property])
      const is_persisted = !unpersisted_state.some(u => u.store_path === key)
      if (is_persisted) {
        const key_specific_state = get(state, key)
        storage.setItem(root_key + key, JSON.stringify(key_specific_state))
        index.push(key)
      }
    }
  }
  const _index_key = index_key(root_key)

  storage.setItem(_index_key, JSON.stringify(index))
}

/*
 * Generate index key for store from provided root_key
 * @param root_key
 * @returns {string}
 */
function index_key(root_key) {
  return `${root_key}_${default_index_key_suffix}`
}

export function create_options(unpersisted_state) {
  if (!unpersisted_state) throw new Error('unpersisted_state object required')

  return {
    getState: (root_key, storage) => {
      if (needs_upgrade(root_key)) {
        return migrate_single_to_multiple(root_key , storage)
      }
      return get_state_multiple(root_key, storage, unpersisted_state)
    },
    setState: (root_key, state, storage) => {
      console.log('📝 set state')
      persist_multiple_stores(state, unpersisted_state, storage, root_key)
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

var get_state_multiple = (root_key, storage, unpersisted_state) => {
  console.log('📝 get state multiple')
  let state = {}

  // extract keys from index (test_and_parse)
  //const index_key = index_key(root_key)
  const index_keys = test_and_parse(storage.getItem(index_key(root_key)))

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
}

var migrate_single_to_multiple = (root_key, storage) => {
  const value = storage.getItem(root_key);
  console.log('migrate single state ', root_key)
  //set(state, root_key, value)
  storage.clear();
  try {
    return value && value !== 'undefined' ? JSON.parse(value) : undefined;
  } catch (err) {
    return undefined;
  }
}

/**
 * utility to help upgrade from a single-store (slow) to multiple-stores (fast)
 * Single store stuck everything in a single 'vuex' property and serialised it
 * Multiple stores split out every module's top-level properties and make a property
 * for each.
 *
 * Testing for existence of 'vuex' on its own will tell us if we need to upgrade
 */
function needs_upgrade(root_key) {
  return localStorage.getItem(root_key) !== null
}

/**
 * Join array of paths into a single 'path string'
 * @param {array} path_strings
 */
function from_path_to_key (path_strings) {
  return path_strings.join('.')
}

