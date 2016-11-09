<template>
  <div>
    <h1 class="md-title">{{$route.fullPath}}</h1>
    <div>
      <p>Schema</p>
      <textarea cols="60" rows="10" :value="form" @change="handleChange"></textarea>
    </div>
    <md-button @click="update">Create form</md-button>
    <div id="alpaca-form"></div>
  </div>
</template>

<script>
  // Alpaca & dependencies
  import 'jquery' 
  import 'bootstrap/dist/js/bootstrap.js'
  import 'bootstrap/dist/css/bootstrap.css'
  import 'alpaca/dist/alpaca/bootstrap/alpaca.min.js'
  import 'alpaca/dist/alpaca/bootstrap/alpaca.min.css'
  
  import fociForm from './foci_investigation_form.js'

  export default {
    data() {
      return {
        alpaca: fociForm
      }
    },
    mounted() {
      console.log($('#alpaca-form').alpaca(this.alpaca))
    },
    computed: {
      form() {
        return JSON.stringify(this.alpaca)
      }
    },
    methods: {
      handleChange(e) {
        this.alpaca = JSON.parse(e.target.value)
      },
      update() {
        $('#alpaca-form').empty()
        $('#alpaca-form').alpaca(this.alpaca)
      }
    }
  }
</script>