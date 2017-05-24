<template>
  <div class='container'>
    <div v-show="!submitted">
      <h1>{{create_or_update}} record for {{country}}</h1>
      <p class='validation_message' v-if='validation_message'>{{validation_message}}</p>
      <router-link class='md-button' to='/irs/record_point/list'><md-icon>list</md-icon>List</router-link>
      <location_record v-on:position='update_location' :existing_location='existing_location'></location_record>
      <form_renderer ref='form' :existing_form_data='existing_form_data'></form_renderer>
      <!--<md-button class='md-raised md-primary' @click.native='validate_location_and_form'><md-icon>save</md-icon>Save</md-button>-->
      <md-button class='md-raised md-primary' @click.native='save_response'><md-icon>save</md-icon>Save</md-button>
    </div>
    <div v-show="submitted">
      <h2>Results of custom validation</h2>
      <div v-if="errors.length !== 0">
        <p>Error messages</p>
        <ul>
          <li class="error" v-for="{warning_message, name, input_questions} in errors" :key="name">{{warning_message}}</li>
        </ul>
      </div>

      <div v-if="warnings.length !== 0">
        <p>Warning messages</p>
        <ul>
          <li class="warning" v-for="{warning_message, name, input_questions} in warnings" :key="name">{{warning_message}}</li>
        </ul>
      </div>

      <p class="all_clear" v-if="errors.length === 0 && warnings.length === 0">Passed all validations!</p>

      <md-button v-if="errors.length == 0" @click.native="save_response"><md-icon>save</md-icon>Confirm Save</md-button>
      <md-button v-if="errors.length !== 0 || warnings.length !== 0" @click.native="submitted = false"><md-icon>mode_edit</md-icon>Review response</md-button>
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
        errors: [],
        warnings: [],
        submitted: false,
        validation_message: '',
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
        return !!this.existing_response_data ? 'Update' : 'Create'
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
      update_location(location) {
        this.location = location
      },
      validate_location_and_form() {
        // TODO: @bug we want to check if the form has errors, not the page
        const valid_form = !this.$refs.form.survey.isCurrentPageHasErrors
        const valid_locn = (Object.keys(this.location).length !== 0)
        if (!valid_form && !valid_locn) {
          this.validation_message = 'You have not done anything yet.'
        } else if (valid_form && !valid_locn) {
          this.validation_message = 'Fix location'
        } else if (!valid_form && valid_locn) {
          this.validation_message = 'Fix form'
        } else if (valid_form && valid_locn) {
          Validators[this.slug](this.$refs.form.survey.data)
          this.validation_message = ''
          let validations = Validators[this.slug](this.$refs.form.survey.data)

          this.errors = validations.filter(validation => validation.stopping_power === 'hard')
          this.warnings = validations.filter(validation => validation.stopping_power === 'soft')

          this.submitted = true
        }
      },
      save_response() {
        this.form_data = this.$refs.form.survey.data
        const id = this.response_id || uuid()
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
</style>
