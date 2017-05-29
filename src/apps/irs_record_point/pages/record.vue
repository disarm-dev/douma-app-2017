<template>
  <div class='container'>

    <md-button class='md-raised' @click.native="$router.push('/irs/record_point/list')">List</md-button>
    <!-- <md-button class='md-raised' @click.native='clear_form'>Clear form</md-button> -->

    <!-- FORM -->
    <div>

      <h1>{{page_title}} record<md-chip>Unsaved data</md-chip></h1>

      <md-card>
        <md-card-content>
          <review :errors='validation.errors' :warnings='validation.warnings'></review>
        </md-card-content>
      </md-card>

      <md-card>
        <md-card-content>
          <location_record v-on:position='update_location' :existing_location='location'>
          </location_record>
        </md-card-content>
      </md-card>

      <md-card>
        <md-card-content>
          <form_renderer @complete='complete_form' @change="change_form" :existing_form_data='existing_form_data'></form_renderer>
        </md-card-content>
      </md-card>
    </div>


  </div>
</template>

<script>
  import uuid from 'uuid/v4'

  import location_record from '@/components/location.vue'
  import review from './review.vue'
  import form_renderer from './form.vue'
  import Validators from '@/lib/validations'

  export default {

    name: 'record',
    components: {location_record, form_renderer, review},
    props: ['response_id'],
    data () {
      return {
        response: {
          location: null,
          form_data: null
        },

        // Validation result will return object looking like this:
        validation_result: {
          errors: [],
          warning: []
        }
      }
    },
    computed: {
      slug() {
        return this.$store.state.instance_config.slug.toLowerCase()
      },
      page_title() {
        return this.response_id ? 'Update' : 'Create'
      },
      existing_form_record() {
        if (this.response_id) {
          return this.$store.state.irs_record_point.responses.find(r => r.id === this.response_id)
        }
      },
      record_is_valid() {
        return (this.validation_result.errors.length === 0)
      },
    },
    methods: {
      on_form_change(form_data) {
        this.validation_result = Validators[this.slug](this.response)
      },
      on_form_complete(form_data) {
        if (this.record_is_valid) {
          save_response()
        } else {
          console.log('No idea what we do here.')
        }
      },
      // TODO: @feature Implement clear_form"
//      complete_form(form_data) {
//        this.response.form_data = form_data
//        this.form_is_filled_out = true
//      },
//
//      update_location(location) {
//        if (location.hasOwnProperty('coords') && location.coords.hasOwnProperty('accuracy')) {
//          this.response.location = location
//        } else {
//          console.log('location error')
//        }
//      },
//
//      next_step(validation_result) {
//        if (validation_result === 'pass') {
//          this.save_response()
//        } else {
//          this.form_is_filled_out = false
//        }
//      },
//
      save_response() {
        // TODO: @refac Move to a proper response model, with tests. And cake.
        const id = this.response_id || uuid()
        const recorded_on = this.response.recorded_on || new Date()

        const response = {
          form_data: this.response.form_data,
          location: this.response.location,
          recorded_on: recorded_on,
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
    margin: 0 auto;
    width: 90%;
  }

  .md-card {
    margin: 10px;
  }
</style>
