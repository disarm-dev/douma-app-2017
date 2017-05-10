<template>
  <div class='container'>
    <h1>RECORD {{country}}</h1>
    <h3>Type: {{type}}</h3>
    <div id="surveyContainer"><survey :survey="survey"></survey></div>
  </div>
</template>

<script>
  import * as Survey from 'survey-vue'
  export default {
    name: 'home',
    data () {
      return {
        survey: {},
      }
    },
    computed: {
      country() {
        return this.$store.state.instance_config.name
      },
      type() {
        return this.$store.state.instance_config.applets.irs_record_point.location_type
      },
      form() {
        return this.$store.state.instance_config.form
      }
    },
    watch: {
      'form': 'create_form'
    },
    mounted() {
      this.create_form()
    },
    methods: {
      create_form() {
        this.survey = new Survey.Model(this.form)
      }
    }
  }
</script>

<style lang="css" scoped>
  .container {
    margin: 10px;
  }
</style>
