<template>
  <div class="tasks">
    <div class='md-title'>IRS Progress records</div>
    <div class="structures">
      <div>Count of loaded data/tasks/actions, etc: {{aCount}}</div>
    </div>

    <p>Please select an Area of Interest: </p>
    <p>(For now is REGION, but can will include Locality, Village, Tinkhundla)</p>
    <md-input-container>
      <label for="region">Region</label>
      <md-select name="region" v-model="region">
        <md-option value="hhohho">Hhohho</md-option>
        <md-option value="lubombo">Lubombo</md-option>
        <md-option value="manzini">Manzini</md-option>
        <md-option value="shiselweni">Shiselweni</md-option>
      </md-select>
    </md-input-container>
    <md-button @click='loadTasks'>Load tasks</md-button>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        aCount: 0,
        region: ''
      }
    },
    computed: {
    },
    methods: {
      loadTasks() {

      }
    }
  }


</script>

<style scoped>
  .tasks {
    max-width: 800px;
    margin: 1em auto;
    padding: 1em;
  }
  .structures {
    padding: 1em;
  }
</style>
