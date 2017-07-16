<template>
  <div>
    <md-list>
      <md-list-item><span>instance_config (check is valid against schema?)</span></md-list-item>

      <md-list-item>
        <md-icon>assignment</md-icon>
        <span>things which rely on form fields</span>

        <md-list-expand>
          <md-list-item @click="log_form_elements"><span>form (check against what?)</span></md-list-item>
          <md-list-item @click="check_validations_fields"><span>validations</span><md-icon v-if="success.validations">check</md-icon></md-list-item>
          <md-list-item @click="check_aggregations_fields"><span>aggregations</span><md-icon v-if="success.aggregations">check</md-icon></md-list-item>
          <md-list-item @click="check_presenters_fields"><span>presenters</span><md-icon v-if="success.presenters">check</md-icon></md-list-item>
          <md-list-item @click="check_fake_form_fields"><span>fake_form</span><md-icon v-if="success.fake_form">check</md-icon></md-list-item>
        </md-list-expand>
      </md-list-item>
      <md-divider class="md-inset"></md-divider>


      <md-list-item>
        <md-icon>explore</md-icon>
        <span>geodata (lots!)</span>
        <md-list-expand>
          <md-list-item><span>location_selector</span></md-list-item>
          <md-list-item>Check data exists</md-list-item>
          <md-list-item>Check data is valid</md-list-item>
        </md-list-expand>
      </md-list-item>
    </md-list>
  </div>
</template>

<script>
  import { mapState, mapActions, mapMutations } from 'vuex'

  import {get_form_elements} from 'lib/instance_data/form_helpers'
  import {fields_for_aggregations_exist_in_form} from 'lib/instance_data/aggregations.instance_assertions.js'
  import {fields_for_validations_exist_in_form} from 'lib/instance_data/validations.instance_assertions'
  import {fields_for_presenters_exist_in_form} from 'lib/instance_data/presenters.instance_assertions'
  import {fields_for_fake_form_exist_in_form} from 'lib/instance_data/fake_form.instance_assertions'

  export default {
    name: 'check_data_status',
    mounted() {
    },
    data() {
      return {
        success: {
          validations: false,
          aggregations: false,
          presenters: false,
          fake_form: false
        }
      }
    },
    computed: {
      ...mapState({
        instance_config: state => state.instance_config
      })
    },
    mounted() {
    },
    methods: {
      log_form_elements() {
        console.table(get_form_elements(this.instance_config.form))
      },
      check_validations_fields() {
        const result = fields_for_aggregations_exist_in_form({aggregations: this.instance_config.aggregations, form: this.instance_config.form})
        this.success.validations = result
      },
      check_aggregations_fields() {
        const result = fields_for_validations_exist_in_form({validations: this.instance_config.validations, form: this.instance_config.form})
        this.success.aggregations = result
      },
      check_presenters_fields() {
        const result = fields_for_presenters_exist_in_form({presenters: this.instance_config.presenters, form: this.instance_config.form})
        this.success.presenters = result
      },
      check_fake_form_fields() {
        const result = fields_for_fake_form_exist_in_form({fake_form: this.instance_config.fake_form, form: this.instance_config.form})
        this.success.fake_form = result
      },
    }
  }
</script>

<style scoped>

</style>
