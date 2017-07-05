<template>
  <div>
    <md-button :disabled="disabled" @click.native="generate_data">Generate</md-button>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import faker from 'faker'
import random_point_in_polygon from 'random-points-on-polygon'
import {getCoord} from '@turf/invariant'

import fake_form_data from 'lib/fake_form_data'
import {get_geodata} from 'lib/data/remote'
import cache from 'config/cache'
import {get_planning_level_id_field, get_planning_level_name} from 'lib/spatial_hierarchy_helper'

export default {
  name: 'fake_responses_debug',
  data () {
    return {
      disabled: true,
    }
  },
  computed: {
    ...mapState({
      slug: state => state.instance_config.slug,
      instance_config: state => state.instance_config,
      location_selections: state => state.instance_config.location
    }),
    planning_level_name() {
      return get_planning_level_name(this.instance_config)
    },
    planning_level_id_field() {
      return get_planning_level_id_field(this.instance_config)
    }
  },
  mounted() {
    get_geodata(this.$store).then(() => {
      this.disabled = false
    })
  },
  methods: {
    get_polygon(id) {
      return cache.geodata[this.planning_level_name].features.find((feature) => feature.properties[this.planning_level_id_field] == id)
    },
    random_number_between(min, max) {
      return parseInt(Math.random() * (max - min) + min)
    },
    select_form_data_type() {
      const desired_coverage = .75
      return (Math.random() > desired_coverage ? 0 : 1)
    },
    get_form_data() {
      return fake_form_data[this.slug][this.select_form_data_type()]
    },
    create_response({id}) {
      const polygon = this.get_polygon(id)
      const point_in_polygon = getCoord(random_point_in_polygon(1, polygon)[0])

      let response = {
        "_id": faker.random.uuid(),
        "id": faker.random.uuid(),
        "country": this.slug,
        "form_data": this.get_form_data(),
        "location": {
          "coords": {
            "accuracy": 100,
            "latitude": point_in_polygon[0],
            "longitude": point_in_polygon[1]
          }
        },
        "location_selection": this.location_selections.splice(0,50)[this.random_number_between(0, this.location_selections.splice(0,50).length -1)],
        "recorded_on": faker.date.recent(),
        "user": faker.name.firstName(),
        "userAgent": faker.internet.userAgent(),
        "synced": false
      }
      return response
    },
    generate_data() {
      let responses = []

      this.location_selections.splice(0, 50).forEach(area => {
        let count = 0
        const limit = this.random_number_between(1,3)
        while (count <= limit) {
          const response = this.create_response(area)
          responses.push(response)
          count += 1
        }
      })

      this.$store.commit('irs_record_point/add_responses', responses)
    }
  }
}
</script>

<style lang="css" scoped>
</style>