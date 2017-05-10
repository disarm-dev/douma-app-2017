<template>
  <div class='container'>
    <h1>{{create_or_update}} record for {{country}}</h1>
    <p class='validation_message' v-if='validation_message'>{{validation_message}}</p>
    <md-button @click.native='validate_location_and_form'>Save</md-button>
    <router-link to='/irs/record_point/review'>Review</router-link>
    <md-tabs>
      <md-tab md-label="Form">
        <form_renderer ref='form' :existing_response_data='existing_response_data'></form_renderer>
      </md-tab>
      <md-tab md-label="Location">
        <location_record v-on:change='update_location'></location_record>
      </md-tab>
    </md-tabs>
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
      // location: {
      //   get(){
      //     if (this.existing_response_data) {
      //       this.existing_response_data.location
      //     }          
      //   },
      //   set(value){
      //   }
      // },
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
          id: id
        }

        if (this.response_id) {
          this.update_response(response)
        } else {
          this.create_response(response)
        }
      },
      create_response(response) {
        this.$store.commit('irs_record_point/create_response', response)
      },
      update_response(response) {
        this.$store.commit('irs_record_point/update_response', response)
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
