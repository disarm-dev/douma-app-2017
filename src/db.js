import PouchDB from 'pouchdb'
import findPlugin from 'pouchdb-find'

PouchDB.plugin(findPlugin)

const structures = new PouchDB('structures', {auto_compaction: true})
const actions = new PouchDB('actions', {auto_compaction: true})

structures.createIndex({
  index: {
    fields: ['area']
  }
}).then((result) => {
  console.log(result)
}).catch((err) => {
  console.log(err)
});

actions.createIndex({
  index: {
    fields: ['_id']
  }
}).then((result) => {
  console.log(result)
}).catch((err) => {
  console.log(err)
});

export {
  structures, actions
}