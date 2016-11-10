<template>
  <div>
    <input type="checkbox" value="Education" v-model="responses">
    <label for="jack">Education</label>
    <input type="checkbox" value="IRS" v-model="responses">
    <label for="john">IRS</label>
    <input type="checkbox" value="LLIN distribution" v-model="responses">
    <label for="mike">LLIN distribution</label>
    <input type="checkbox" value="Monitoring" v-model="responses">
    <label for="mike">Monitoring</label>

    <md-input-container>
      <label>Free text</label>
      <md-textarea></md-textarea>
    </md-input-container>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        responses: []
      }
    }
  }
</script>