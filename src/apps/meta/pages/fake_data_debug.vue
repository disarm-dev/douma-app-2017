<template>
  <div class="applet_container">
    <md-input-container>
      <label>Number of areas (between 0 and 3 records generated for each area)</label>
      <md-input type="number" v-model="areas_count"></md-input>
      <md-button :disabled="!geodata_ready" @click.native="generate_data">Generate</md-button>
    </md-input-container>

    <div v-if="message">
      {{message}}
      <router-link to="/irs/record_point">View records</router-link>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import faker from 'faker'
import random_point_in_polygon from 'random-points-on-polygon'
import {getCoord} from '@turf/invariant'

import {get_geodata} from 'lib/remote/remote.get_geodata'
import cache from 'config/cache'
import {get_planning_level_id_field, get_planning_level_name} from 'lib/helpers/spatial_hierarchy_helper'
import {ResponseSchema} from 'lib/models/response.schema'

export default {
  name: 'fake_responses_debug',
  data () {
    return {
      areas_count: 50,
      message: ''
    }
  },
  computed: {
    ...mapState({
      user: state => state.meta.user.username,
      slug: state => state.instance_config.instance.slug,
      geodata_ready: state => state.geodata_ready,
      instance_config: state => state.instance_config,
      location_selections: state => state.instance_config.location_selection
    }),
    planning_level_name() {
      return get_planning_level_name()
    },
    planning_level_id_field() {
      return get_planning_level_id_field()
    }
  },
  mounted() {
    get_geodata(this.$store)
  },
  methods: {
    get_polygon(id) {
      const found = cache.geodata[this.planning_level_name].features.find((feature) => feature.properties[this.planning_level_id_field] == id)
      if (!found) throw new Error(`Cannot find polygon for ${this.planning_level_id_field} ${id}`)
      return found
    },
    random_number_between(min, max) {
      return parseInt(Math.random() * (max - min) + min)
    },
    select_form_data_type() {
      const desired_coverage = .75
      return (Math.random() > desired_coverage ? 0 : 1)
    },
    get_form_data() {
      const fake_form_data = this.instance_config.fake_form
      return fake_form_data[this.select_form_data_type()]
    },
    create_response(location_selection) {
      const polygon = this.get_polygon(location_selection.id)
      const point_in_polygon = getCoord(random_point_in_polygon(1, polygon)[0])

      let response = {
        "id": faker.random.uuid(),
        "country": this.slug,
        "form_data": this.get_form_data(),
        "location": {
          "coords": {
            "accuracy": 100,
            "longitude": point_in_polygon[0],
            "latitude": point_in_polygon[1],
          }
        },
        "location_selection": location_selection,
        "recorded_on": faker.date.recent(90),
        "user": this.user,
        "userAgent": navigator.userAgent,
        "synced": false
      }
      return response
    },
    generate_data() {
      let responses = []

      this.location_selections.slice(0, this.areas_count).forEach(location_selection => {
        let count = 0
        const limit = this.random_number_between(1,3)
        while (count <= limit) {
          const response = this.create_response(location_selection)
          if (ResponseSchema(response)) {
            responses.push(response)
          } else {
            console.log('Fake response failed validation', ResponseSchema.errors(response))
          }
          count += 1
        }
      })
      this.message = `Done faking. Created ${responses.length} records.`
      this.$store.commit('irs_record_point/add_responses', responses)
    }
  }
}
</script>

<style lang="css" scoped>

</style>
