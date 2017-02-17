// Manages local DB calls

import DB from './db.js'

const clusters = {
  create: (clusters) => {},
  read: () => {
    return DB.clusters.toArray()
  },
  update: () => {},
  delete: () => {},
  clear: () => {
    return DB.clusters.clear()
  }
}

export default { clusters }