<template>
  <div class='container'>
    <h1>RECORD {{country}}</h1>
    <p class='validation_message' v-if='validation_message'>{{validation_message}}</p>
    <md-button @click.native='save_location_and_form'>Save</md-button>
    <md-tabs>
      <md-tab md-label="Form">
        <form_renderer ref='form'></form_renderer>
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

  export default {

    name: 'record',
    components: {location_record, form_renderer},
    data () {
      return {
        validation_message: '',
        location: {},
        form_response: {}
      }
    },
    computed: {
      country() {
        return this.$store.state.instance_config.name
      },
    },
    methods: {
      update_location(location) {
        this.location = location
      },
      save_location_and_form() {
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
          this.form_response = this.$refs.form.survey.data
          this.$store.commit('irs_record_point/create_response', {form_response: this.form_response, location: this.location, date: new Date()})
          console.log('save_location_and_form', this.form_response, this.location)
        }
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
