import DB from './db.js'

const clusters = {
  getAll() {

  }
}

const tasks = {
  loadAll() {
    return DB.tasks.toArray()
  },
  _internalMethod() {
    
  }
}

const spatial_entities = {

}


export default { clusters, tasks, spatial_entities }