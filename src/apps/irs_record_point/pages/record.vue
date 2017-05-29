<template>
  <div class='container'>

    <md-button class='md-raised' @click.native="$router.push('/irs/record_point/list')">List</md-button>
    <!-- <md-button class='md-raised' @click.native='clear_form'>Clear form</md-button> -->
    
    <!-- FORM -->
    <div>
      
      <h1>{{create_or_update}} record for {{country}} <md-chip>Unsaved data</md-chip></h1>
      
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

  export default {

    name: 'record',
    components: {location_record, form_renderer, review},
    props: ['response_id'],
    data () {
      return {
        // response: {
          location: null,
          existing_form_data: null,
          // form_data: null
        // },
        validations: {
          errors: [],
          warnings: []
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
      }
    },
    created() {
      if (this.response_id) {
        const found = this.$store.state.irs_record_point.responses.find(r => r.id === this.response_id)
        if (found) {
          this.location = found.location
          this.existing_form_data = found.form_data
        }
      }
    },
    methods: {
      clear_form() {
        console.info("TODO: @feature Implement clear_form")
      },
      update_location(location) {
        if (location.hasOwnProperty('coords') && location.coords.hasOwnProperty('accuracy')) {
          this.response.location = location
        } else {
          console.log('location error')
        }
      },
      change_form(form_data) {
        // Check against all custom validations, display results
        let response = {form_data, location: this.location}
        let validation_results = Validators[this.slug](response)

        this.errors = validation_results.filter(validation => validation.type === 'error')
        this.warnings = validation_results.filter(validation => validation.type === 'warning')
      
      },
      complete_form(form_data) {
        if (this.validation.errors.length === 0) {
          this.save_response() 
        }
      },


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
