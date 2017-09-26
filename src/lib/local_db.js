import Dexie from 'dexie'

const db = new Dexie('disarm')

const fields = {
  v1: {
    responses: 'id',
    plan: 'id',
    assignment_plan: 'id'
  }
}

db.version(1).stores({
  geodata_collection: `disarm_geodata_key, geodata`, // geodata_collection has two columns, called 'disarm_geodata_key' and 'geodata'

  "monitor/responses": fields.v1.responses,
  "record/responses": fields.v1.responses,

  "monitor/assignment_plan": fields.v1.assignment_plan,
  "tasker/assignment_plan": fields.v1.assignment_plan,

  "monitor/plan": fields.v1.plan,
  "plan/plan": fields.v1.plan,
  
})

// db.version(2)
//   .stores({
//     geodata_collection: `disarm_geodata_key, geodata`, // geodata_collection has two columns, called 'disarm_geodata_key' and 'geodata'
//     responses: 'id',
//
//     "monitor/responses": 'id',
//     "monitor/plan": 'id',
//     "monitor/assignment_plan": 'id',
//
//     "record/responses": 'id',
//
//     "plan/plan": 'id',
//
//     "tasker/assignment_plan": 'id',
//   })
//   .upgrade((db) => {
//     const a = {
//       "monitor/responses": upgrade_responses,
//       "record/responses": upgrade_responses
//     }
//
//     a.forEach(key, line => db[line].toCollection().modify(a[key]))
//
//
//     function upgrade_responses(friend) {
//       friend.birthdate = new Date(Date.now() - (friend.age * YEAR));
//       delete friend.age;
//     }
//
//   })


clean_up()

export {db}

function clean_up() {
  // TODO: @feature remove 'disarm_geodata' db
}