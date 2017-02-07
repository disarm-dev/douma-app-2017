import PouchDB from 'pouchdb'
PouchDB.plugin(require('pouchdb-find'))

const clusters = new PouchDB('clusters')
const tasks = new PouchDB('tasks')
const spatial_entities = new PouchDB('spatial_entities')

window.DB = {
  clusters, tasks, spatial_entities
}

export {
  clusters, tasks, spatial_entities
}