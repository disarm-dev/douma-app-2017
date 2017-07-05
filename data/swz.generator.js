const faker = require('faker')
const random_point_in_polygon = require('random-points-on-polygon');
const fs = require('fs')
const getCoord = require('@turf/invariant').getCoord

const location_selections = require('../static/instances/swz.location_selector.json')
const localities = JSON.parse(fs.readFileSync('../static/geo/swz/spatial_hierarchy/swz.localities.geojson', 'utf-8'))


function create_response({id}) {
  const polygon = get_polygon(id)
  const point_in_polygon = getCoord(random_point_in_polygon(1, polygon)[0])

  let response = {
    "_id": faker.random.uuid(),
    "id": faker.random.uuid(),
    "country": "swz",
    "form_data": get_form_data(),
    "location": {
      "coords": {
        "accuracy": 100,
        "latitude": point_in_polygon[0],
        "longitude": point_in_polygon[1]
      }
    },
    "location_selection": location_selections[random_number_between(0, location_selections.length -1)],
    "recorded_on": faker.date.recent(),
    "user": faker.name.firstName(),
    "userAgent": faker.internet.userAgent()
  }
  return response
}

function get_form_data() {
  const form_data_types = [
    // Successful spray
    {
      any_structures_unsprayed: "no",
      number_of_structures_sprayed: 3,
      number_structures_total: 3,
      recorded_by: "2",
      visit_type: "mopup",
    },
    // Unsuccessful spray
    {
      number_of_structures_sprayed:0,
      number_structures_total: 5,
      ny_structures_unsprayed: "yes",
      householdheadname: "name",
      n_rooms_baby: 1,
      n_rooms_food: 0,
      n_rooms_funeral: 0,
      n_rooms_kitchen: 1,
      n_rooms_locked: 0,
      n_rooms_material: 1,
      n_rooms_nobody: 0,
      n_rooms_other: 1,
      n_rooms_patient: 0,
      n_rooms_refused: 1,
      recorded_by: "1",
      visit_type:"first_visit"
    }
  ]
  const form_data = form_data_types[select_form_data_type()]

  return form_data
}

function get_polygon(id) {
  return localities.features.find((feature) => feature.properties.AggUniCode == id)
}

function random_number_between(min, max) {
  return parseInt(Math.random() * (max - min) + min)
}

function select_form_data_type() {
  const desired_coverage = .75
  return (Math.random() > desired_coverage ? 0 : 1)
}



let responses = []

location_selections.forEach(area => {
  let count = 0
  const limit = random_number_between(1,15)
  while (count <= limit) {
    const response = create_response(area)
    responses.push(response)
    count += 1
  }
})

console.log('generated', responses.length, 'responses')

fs.writeFileSync('responses.json', JSON.stringify(responses))