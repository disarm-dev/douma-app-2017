<template>
  <div class='container'>
    <md-button class='md-raised' @click.native="$router.push('/irs/record_point/list')">List</md-button>
    <!-- <md-button class='md-raised' @click.native='clear_form'>Clear form</md-button> -->
    
    <!-- FORM -->
    <div v-if="!form_is_filled_out">
      
      <h1>{{create_or_update}} record for {{country}} <md-chip>Unsaved data</md-chip></h1>

<!--       <md-card>
        <md-card-content>
          <location_record v-on:position='update_location' :existing_location='existing_location'>
          </location_record>
        </md-card-content>
      </md-card>
 -->    
      <md-card>
        <md-card-content>
          <form_renderer v-on:complete='complete_form' :existing_form_data='response.form_data' >
          </form_renderer>
        </md-card-content>
      </md-card>
    </div>

    <!-- REVIEW / VALIDATION -->
    <div v-else>
      <review v-on:validation_result='next_step' :response='response'></review>
    </div>

  </div>
</template>

<script>
  import uuid from 'uuid/v4'

  import location_record from '@/components/location.vue'
  import review from './review.vue'
  import form_renderer from './form.vue'

  export default {

    name: 'record',
    components: {location_record, form_renderer, review},
    props: ['response_id'],
    data () {
      return {
        form_is_filled_out: false,
        response: {
          location: null,
          form_data: null
        },
        // don't need below
        form_completed: false,
        location_completed: false,
        response_completed: false
      }
    },
    computed: {
      country() {
        return this.$store.state.instance_config.name
      },
      slug() {
        return this.$store.state.instance_config.slug.toLowerCase()
      },
      create_or_update() {
        return this.response_id ? 'Update' : 'Create'
      },
    },
    created() {
      if (this.response_id) {
        const found = this.$store.state.irs_record_point.responses.find(r => r.id === this.response_id)
        if (found) this.response = found
      }
    },
    methods: {
      clear_form() {
        console.info("TODO: @feature Implement clear_form")
      },
      complete_form(form_data) {
        this.response.form_data = form_data
        this.form_is_filled_out = true
      },

      update_location(location) {
        this.response.location = location
      },

      next_step(validation_result) {
        if (validation_result === 'pass') {
          this.save_response()
        } else {
          this.form_is_filled_out = false
        }
      },

      save_response() {

        const id = this.response_id || uuid()

        // TODO: @refac Move to a proper response model, with tests. And cake.
        const response = {
          form_data: this.response.form_data,
          // location: this.response.location,
          recorded_on: new Date(),
          id: id,
          synced: false,
          userAgent: navigator.userAgent,
          instance_slug: this.slug
        }

        if (this.response_id) {
          this.update_response(response)
        } else {
          this.create_response(response)
        }
      },

      create_response(response) {
        this.$store.commit('irs_record_point/create_response', response)
        this.$router.push('/irs/record_point/')
      },
      update_response(response) {
        this.$store.commit('irs_record_point/update_response', response)
        this.$router.push('/irs/record_point/')
      }
    }
  }
</script>

<style lang="css" scoped>
  .container {
    margin: 10px;
  }

  .md-card {
    margin: 10px;
  }
</style>
