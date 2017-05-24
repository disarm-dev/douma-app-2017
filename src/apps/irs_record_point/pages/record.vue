<template>
  <div class='container'>
    <md-button class='md-raised' @click.native="$router.push('/irs/record_point/list')">List</md-button>
    <md-button class='md-raised' @click.native='clear_form'>Clear form</md-button>
    
    <!-- FORM -->
    <div v-show="!form_completed">
      
      <h1>{{create_or_update}} record for {{country}} <md-chip>Unsaved data</md-chip></h1>

      <md-card>
        <md-card-content>
          <location_record v-on:position='update_location' :existing_location='existing_location'>
          </location_record>
        </md-card-content>
      </md-card>
    
      <md-card>
        <md-card-content>
          <form_renderer v-on:complete='validate_location_and_form' :existing_form_data='existing_form_data' >
          </form_renderer>
        </md-card-content>
      </md-card>
    </div>

    <!-- REVIEW / VALIDATION -->
    <div v-show="form_completed">
      <h2>Review</h2>
      <div v-if="errors.length > 0">
        <p>Errors</p>
        <ul>
          <li class="error" v-for="{message, name, input_questions} in errors" :key="name">{{message}}</li>
        </ul>
      </div>

      <div v-if="warnings.length > 0">
        <p>Warnings</p>
        <ul>
          <li class="warning" v-for="{message, name, input_questions} in warnings" :key="name">{{message}}</li>
        </ul>
      </div>

      <p class="all_clear" v-if="errors.length === 0 && warnings.length === 0">Passed all validations!</p>

      <md-button v-if="errors.length == 0" @click.native="save_response" class='md-raised'>Confirm Save</md-button>
      <md-button v-if="errors.length !== 0 || warnings.length !== 0" class='md-raised md-primary' @click.native="edit_response">Edit response</md-button>

    </div>


  </div>
</template>

<script>
  import location_record from '@/components/location.vue'
  import form_renderer from './form.vue'
  import uuid from 'uuid/v4'
  import Validators from '@/lib/validations'
  import {elements_array} from '@/lib/form_helpers.js'
  export default {

    name: 'record',
    components: {location_record, form_renderer},
    props: ['response_id'],
    data () {
      return {
        form_completed: false,
        errors: [],
        warnings: [],
        form_data: {},
        location: {}
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
      existing_response_data() {
        if (this.response_id) {
          const response = this.$store.state.irs_record_point.responses.find((response) => response.id === this.response_id)
          if (typeof response === 'undefined') {
            return null
          }
          return response
        } else {
          return null
        }
      },
      existing_form_data() {
        if (this.existing_response_data && this.existing_response_data.form_data) {
          return this.existing_response_data.form_data
        }
      },
      existing_location() {
        if (this.existing_response_data && this.existing_response_data.location) {
          return this.existing_response_data.location
        }
      }
    },
    methods: {
      clear_form() {
        console.info("TODO: @feature Implement clear_form")
      },
      update_location(location) {
        this.location = location
      },
      validate_location_and_form(data) {
        // Render empty 'review' pane
        this.form_completed = true

        // Check location is set (and warn if accuracy is not acceptable)
        if (this.location) {
          this.errors.push({
            name: 'missing_location',
            message: 'Missing location',
            stopping_power: "hard"
          })
        } else {
          this.message = 'No location'
        }

        // Check against all custom validations, display results
        let validations = Validators[this.slug](data)

        this.errors = validations.filter(validation => validation.stopping_power === 'hard')
        this.warnings = validations.filter(validation => validation.stopping_power === 'soft')

        // Give user a SAVE button to complete
      },
      edit_response() {
        this.existing_form_data =
      },
      // validate_location_and_form(data) {
      //   console.log('validate_location_and_form', data)
      //   this.submitted = true
      //   // TODO: @bug we want to check if the form has errors, not the page
      //   // const valid_form = !this.$refs.form.survey.isCurrentPageHasErrors
      //   // const valid_locn = (Object.keys(this.location).length !== 0)
      //   // if (!valid_form && !valid_locn) {
      //   //   this.validation_message = 'You have not done anything yet.'
      //   // } else if (valid_form && !valid_locn) {
      //   //   this.validation_message = 'Fix location'
      //   // } else if (!valid_form && valid_locn) {
      //   //   this.validation_message = 'Fix form'
      //   // } else if (valid_form && valid_locn) {
      //   //   Validators[this.slug](this.$refs.form.survey.data)
      //   //   this.validation_message = ''
      //   //   let validations = Validators[this.slug](this.$refs.form.survey.data)

      //   //   this.errors = validations.filter(validation => validation.stopping_power === 'hard')
      //   //   this.warnings = validations.filter(validation => validation.stopping_power === 'soft')

      //   //   this.submitted = true
      //   // }
      // },
      save_response() {
        this.form_data = this.$refs.form.survey.data

        const id = this.response_id || uuid()

        // TODO: @refac Move to a proper response model, with tests. And cake.
        const response = {
          form_data: this.form_data,
          location: this.location,
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
        this.$router.push('/irs/record_point/review')
      },
      update_response(response) {
        this.$store.commit('irs_record_point/update_response', response)
        this.$router.push('/irs/record_point/review')
      }
    }
  }
</script>

<style lang="css" scoped>
  .container {
    margin: 10px;
  }

  .error {
    color: red;
  }

  .warning {
    color: orange;
  }

  .all_clear {
    color: green;
  }

  .md-card {
    margin: 10px;
  }
</style>
