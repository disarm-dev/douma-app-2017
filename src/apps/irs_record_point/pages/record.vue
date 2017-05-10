<template>
  <div class='container'>
    <h1>RECORD {{country}}</h1>
    <md-tabs>
      <md-tab md-label="Form">
        <form_renderer v-on:change='update_form_response'></form_renderer>
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
      update_form_response(form_response) {
        this.form_response = form_response
      }
    }
  }
</script>

<style lang="css" scoped>
  .container {
    margin: 10px;
  }
</style>
