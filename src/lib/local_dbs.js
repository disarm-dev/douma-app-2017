import RxDB from 'rxdb';
import PouchIDB from 'pouchdb-adapter-idb'

RxDB.plugin(PouchIDB);


async function create_db() {
  const db = await RxDB.create({
    name: 'disarm',
    adapter: 'pouchdb-adapter-idb'
  });

  return db
}

const douma_db = create_db()
console.log('douma_db', douma_db)



export {douma_db}