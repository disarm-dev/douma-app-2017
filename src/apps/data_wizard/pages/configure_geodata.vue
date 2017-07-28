<template>
  <div class="applet_container">
    <md-card class="card">

      <md-card-header>
        <div class="md-title">Select a country below</div>
      </md-card-header>
      <md-card-content>
        
        <md-input-container>
          <label for="country">Country</label>
          <md-select name="country" id="country" v-model="country">
            <md-option value="namibia">Namibia</md-option>
            <md-option value="botswana">Botswana</md-option>
            <md-option value="swaziland">Swaziland</md-option>
            <md-option value="zimbabwe">Zimbabwe</md-option>
          </md-select>
        </md-input-container>

      </md-card-content>
      <md-card-actions>
        <md-button>
          Continue
        </md-button>
      </md-card-actions>
    </md-card>

    <md-card class="card">
      <md-card-header>
        <div class="md-title">Select admin levels to include</div>
      </md-card-header>
      <md-card-content>
        <md-list>
          <md-list-item>
            <span><b>Admin level</b></span>
            <div><b>Include</b></div>
            <div><b>Planning level</b></div>
          </md-list-item>
          <md-list-item>
            <span>Admin 1</span>
            <md-checkbox v-model="include_areas.one"></md-checkbox>

            <md-radio v-model="planning_level" md-value="one"></md-radio>
          </md-list-item>

          <md-list-item>
            <span>Admin 2</span>
            <md-checkbox v-model="include_areas.two"></md-checkbox>

            <md-radio v-model="planning_level" md-value="two"></md-radio>
          </md-list-item>

          <md-list-item>
            <span>Admin 3</span>
            <md-checkbox v-model="include_areas.three"></md-checkbox>

            <md-radio v-model="planning_level" md-value="three"></md-radio>
          </md-list-item>
        </md-list>
      </md-card-content>
      <md-card-actions>
        <md-button @click.native="$router.push({name: 'data_wizard:create_form'})">Continue</md-button>
      </md-card-actions>
    </md-card>


  </div>
</template>

<script>
export default {
  name: 'configure_geodata',
  data () {
    return {
      country: '',
      planning_level: '',
      include_areas: {
        one: '',
        two: '',
        three: '',
      }
    }
  }
};
</script>

<style lang="css" scoped>
  .card {
    margin: 1em auto;
  }
</style>