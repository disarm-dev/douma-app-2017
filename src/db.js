import Kinto from 'kinto'

const syncOptions = {
  remote: "https://kinto.dev.mozaws.net/v1",
  headers: {
    Authorization: "Basic " + "basicauth:842ba3f6b700d048458dcdb203805df2df12877819389513352cad3afb92bf0c"
  },
  bucket: 'disthing',
  collection: 'actions'
}
const db = new Kinto(syncOptions)

const structures = require('./data_bootstrap/structures_5.json')
const actions = db.collection('actions')


window.db = {
  structures, actions, syncOptions
}

export {
  structures, actions, syncOptions
}