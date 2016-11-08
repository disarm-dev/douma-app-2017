<template>
  <div>
    <h1 class="md-title">{{$route.fullPath}}</h1>
    <div id="alpaca-form"></div>
  </div>
</template>

<script>
  // import $ from 'jquery'
  export default {
    data() {
      return {
        form: {
          "data": "coffee",
          "schema": {
            "enum": ["vanilla", "chocolate", "coffee", "strawberry", "mint"]
          },
          "options": {
            "label": "Crème Glacée",
            "helper": "Quelle saveur de crème glacée préférez-vous?",
            "optionLabels": ["Vanille", "Chocolat", "Café", "Fraise", "Comme"],
          }
        }
      }
    },
    mounted() {
      $('#alpaca-form').alpaca(this.form)
    }
  }
</script>