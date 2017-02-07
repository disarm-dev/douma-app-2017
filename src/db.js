import PouchDB from 'pouchdb'

const clusters = new PouchDB('clusters')
const tasks = new PouchDB('tasks')
const spatial_entities = new PouchDB('spatial_entities')

window.db = {
  clusters, tasks, spatial_entities
}

export {
  clusters, tasks, spatial_entities
}