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
  import {elements_array} from 'lib/helpers/form_helpers'

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
    methods: {
      log_form_elements() {
        console.table(elements_array(this.instance_config.form))
      },
    }
  }
</script>

<style scoped>

</style>
