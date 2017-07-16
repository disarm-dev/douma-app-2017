<template>
  <div>
    Checking status of data...
    <md-list>
      <md-list-item><span>instance_config</span></md-list-item>
      <md-list-item><span>form</span></md-list-item>

      <md-list-item><span>geodata (lots!)</span></md-list-item>
      <md-list-item><span>location_selector</span></md-list-item>

      <md-list-item><span>validations</span></md-list-item>
      <md-list-item><span>aggregations</span></md-list-item>
      <md-list-item><span>fake_form_data (not yet in separate files)</span></md-list-item>
    </md-list>

    <md-button @click.native="log_form_elements"><md-icon>assignment</md-icon>log form fields</md-button>
  </div>
</template>

<script>
  import { mapState, mapActions, mapMutations } from 'vuex'
  import {form_elements} from 'lib/instance_data/form_helpers'
  import {fields_for_aggregations_exist_in_form} from 'lib/instance_data/aggregations.instance_assertions.js'
  import {fields_for_validations_exist_in_form} from 'lib/instance_data/validations.instance_assertions'


  export default {
    name: 'check_data_status',
    mounted() {
    },
    data() {
      return {}
    },
    computed: {
      ...mapState({
        instance_config: state => state.instance_config
      })
    },
    mounted() {
      const aggregation_result = fields_for_aggregations_exist_in_form({aggregations: this.instance_config.aggregations, form: this.instance_config.form})
      console.log('fields_for_aggregations_exist_in_form', aggregation_result )

      const validation_result = fields_for_validations_exist_in_form({validations: this.instance_config.validations, form: this.instance_config.form})
      console.log('fields_for_validations_exist_in_form', validation_result)
    },
    methods: {
      log_form_elements() {
        console.table(form_elements(this.instance_config.form))
      },
    }
  }
</script>

<style scoped>

</style>
