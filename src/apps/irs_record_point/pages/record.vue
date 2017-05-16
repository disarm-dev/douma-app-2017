<template>
  <div class='container'>
    <h1>{{create_or_update}} record for {{country}}</h1>
    <p class='validation_message' v-if='validation_message'>{{validation_message}}</p>
    <router-link class='md-button' to='/irs/record_point/list'><md-icon>list</md-icon>List</router-link>
    <location_record v-on:change='update_location' :existing_location='existing_location'></location_record>
    <form_renderer ref='form' :existing_form_data='existing_form_data'></form_renderer>
    <md-button class='md-raised md-primary' @click.native='validate_location_and_form'><md-icon>save</md-icon>Review/Save</md-button>
  </div>
</template>

<script>
  import location_record from '@/components/location.vue'
  import form_renderer from './form.vue'
  import uuid from 'uuid/v4'

  export default {

    name: 'record',
    components: {location_record, form_renderer},
    props: ['response_id'],
    data () {
      return {
        validation_message: '',
        form_data: {},
        location: {}
      }
    },
    computed: {
      country() {
        return this.$store.state.instance_config.name
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
        const valid_form = !this.$refs.form.survey.isCurrentPageHasErrors
        const valid_locn = (Object.keys(this.location).length !== 0)
        if (!valid_form && !valid_locn) {
          this.validation_message = 'You have not done anything yet.'
        } else if (valid_form && !valid_locn) {
          this.validation_message = 'Fix location'
        } else if (!valid_form && valid_locn) {
          this.validation_message = 'Fix form'
        } else if (valid_form && valid_locn) {
          this.validation_message = ''
          this.save_response()
        }
      },
      save_response() {
        this.form_data = this.$refs.form.survey.data
        const id = this.response_id || uuid()
        const response = {
          form_data: this.form_data, 
          location: this.location,
          updated_at: new Date(),
          id: id,
          synced: false,
          userAgent: navigator.userAgent
        }

        if (this.response_id) {
          this.update_response(response)
        } else {
          this.create_response(response)
        }
      },
      create_response(response) {
        this.$store.commit('irs_record_point/create_response', response)
        this.$store.commit('irs_monitor/create_response', response)
        this.$router.push('/irs/record_point/review')
      },
      update_response(response) {
        this.$store.commit('irs_record_point/update_response', response)
        this.$store.commit('irs_monitor/update_response', response)
        this.$router.push('/irs/record_point/review')
      }
    }
  }
</script>

<style lang="css" scoped>
  .container {
    margin: 10px;
  }

  .validation_message {
    color: red;
  }
</style>
