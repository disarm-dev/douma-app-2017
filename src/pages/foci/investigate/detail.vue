<template>
  <div>
    <div class="switch-container">
      <md-switch class="switch" v-model="editing" @change="update" name="my-test0">Edit</md-switch>
    </div>

    <div v-show="!editing" id="alpaca-form"></div>

    <div v-show="editing" class="editor">
      <md-input-container>
        <label>Form</label>
        <md-textarea ref="textarea" :value="form" @change="handleChange"></md-textarea>
      </md-input-container>
    </div>
  </div>
</template>

<script>
  // Alpaca & dependencies
  import 'jquery' 
  import 'bootstrap/dist/js/bootstrap.js'
  import 'bootstrap/dist/css/bootstrap.css'
  import 'alpaca/dist/alpaca/bootstrap/alpaca.min.js'
  import 'alpaca/dist/alpaca/bootstrap/alpaca.min.css'
  
  import fociForm from './foci_investigation_form.json'
  console.log(fociForm)

  export default {
    data() {
      return {
        editing: false,
        alpaca: fociForm
      }
    },
    mounted() {
      $('#alpaca-form').alpaca(this.alpaca) 
    },
    computed: {
      form() {
        return JSON.stringify(this.alpaca, undefined, 2)
      }
    },
    methods: {
      handleChange(e) {
        this.alpaca = JSON.parse(e)
      },
      update() {
        if (this.editing) {
          $('#alpaca-form').empty()
          $('#alpaca-form').alpaca(this.alpaca)
        } else {
          this.$nextTick(() => {
            this.$refs.textarea.$el.dispatchEvent(new Event('input'));
          })
        }
      }
    }
  }
</script>

<style>
  .editor {
    padding: 1em;
  }

  .switch-container {
    overflow: hidden;
  }

  .switch {
    float: right;
  }
</style>