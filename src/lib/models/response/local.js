// create local DB
// apply schema to local DB
// add version-migrations as required

export default {read_all, create}

async function read_all() {
  return [1,2,3]
}

async function create(records) {
  return console.log('Saving locally')
}


