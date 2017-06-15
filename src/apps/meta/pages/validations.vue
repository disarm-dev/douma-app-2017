<template>
	<div class="container">
	  <md-input-container>
      <label>Upload validations</label>
      <md-file @selected="upload_validations"></md-file>
    </md-input-container>
    <md-button class="md-raised md-primary" @click.native="download"> Download </md-button>
    <div v-if="validations">
      <md-list>
        <md-list-item v-for="validation in validations" :key="validation.name" @click.native="set_active_validation(validation)">
           {{validation.name}}
        </md-list-item>
      </md-list>
    </div>

    <md-card v-if="active_validation">
      <md-card-header>
        <md-card-header-text>
          <div class="md-title">{{active_validation.name}}</div>
        </md-card-header-text>
      </md-card-header>
      <md-card-content>
        <md-input-container>
          <label>Precondition</label>
          <md-input v-model="active_validation.precondition"></md-input>
        </md-input-container>
        <md-input-container>
          <label>Expression</label>
          <md-input v-model="active_validation.expression"></md-input>
        </md-input-container>
      </md-card-content>
      <md-card-actions>
        <md-button class="md-primary md-raised" @click.native="save_validation">Save</md-button>
        <md-button @click.native="active_validation = null">Close</md-button>
      </md-card-actions>
    </md-card>

    <md-card v-if="active_validation">
      <md-card-header>
        <md-card-header-text>
          <div class="md-title">Form question names</div>
          <div class="md-subhead">For reference</div>
        </md-card-header-text>
      </md-card-header>
      <md-card-content>
        <md-chip v-for="element in form_elements" :key="element.name">{{element.name}}</md-chip>
      </md-card-content>
    </md-card>

	</div>
</template>
<script type="text/javascript">
  import yaml from 'js-yaml'
  import download from 'downloadjs'
  import moment from 'moment'

  import {elements_array} from 'lib/form_helpers'


  export default {
    data() {
      return {
        raw_validations: [],
        active_validation: null
      }
    },
    computed: {
      instance_config() {
        return this.$store.state.instance_config
      },
      form_elements() {
        return elements_array(this.$store.state.instance_config.form)
      },
      validations() {
        let warnings = this.raw_validations.find((i) => i.type === 'warnings')
        if (warnings && warnings.hasOwnProperty('validations') && warnings.validations.length) {
          warnings = warnings.validations.map((i) => {
            i.type = "warning"
            return i
          })
        } else {
          warnings = []
        }

        let errors = this.raw_validations.find((i) => i.type === 'errors')
        if (errors && errors.hasOwnProperty('validations') && errors.validations.length) {
          errors = errors.validations.map((i) => {
            i.type = "error"
            return i
          })
        } else {
          errors = []
        }

        return errors.concat(warnings)
      }
    },
    mounted() {
      this.raw_validations = require("json-loader!yaml-include-loader!lib/validations/" + this.instance_config.slug  + ".validations.yaml")
    },
    methods: {
      set_active_validation(validation) {
        this.active_validation = validation
      },
      save_validation() {
        let index = this.validations.findIndex((i) => i.name === this.active_validation.name)
        this.validations.splice(index, this.active_validation)
        this.active_validation = null
      },
      upload_validations(e) {
        if (e.length === 0) return

        const file = e.item(0)
        const file_reader = new FileReader();

        file_reader.onload = (f) => {
          this.raw_validations = yaml.load(f.target.result)
        }


        file_reader.readAsText(file)
      },
      download() {
        let result = [
          {
            type: "errors",
            validations: this.validations.filter((i) => i.type === 'error').map(i => {
              delete i.type
              return i
            })
          },
          {
            type: 'warnings',
            validations: this.validations.filter((i) => i.type === 'warning').map(i => {
              delete i.type
              return i
            })
          }
        ]


        const content = yaml.safeDump(result)
        const date = moment().format('YYYY-MM-DD_HHmm')
        download(content, `${this.instance_config.slug}_validations_${date}.yml`)
      }
    }
  }
</script>
<style>
  .md-card {
    margin: 1em 0;
  }
  .md-chip {
    margin: 2px;
  }
</style>
