<template>
  <div>
    <div class='container'>    
      <h1>OperationalUnitView</h1>
      <div v-show="currentRoute === 'irs_plan:create:select_ous'">
        <md-input-container v-if='sorted_localities.length === 0'>
          <label for="country_code">Country</label>
          <md-select name="country_code" v-model="country_code">
            <md-option value="SWZ">Swaziland</md-option>
            <md-option value="ZWE">Zimbabwe (Mat-South)</md-option>
          </md-select>
          <md-button @click.native='get_ous'>Get OUs</md-button>
        </md-input-container>


        <!-- SELECTION SLIDER -->
        <div v-if='sorted_localities.length > 0'>
          <md-input-container
            <label>Select number of localities (ordered ascending by risk)</label>
            <vue-slider v-bind="slider_options" v-model="risk_slider"></vue-slider>

            <!-- START CLYSTERING BUTTON -->
            <md-button class='md-raised md-accent' :disabled='!can_start_clustering' @click.native='start_clustering'>Start clustering</md-button>
            <md-progress :md-indeterminate='$store.state.meta.sync_in_progress'></md-progress>
          </md-input-container>
        </div>
      </div>
    </div>

    <div v-show="currentRoute === 'irs_plan:create:preview'">
      <md-button @click.native="$router.push({name: 'irs_plan:create:select_ous'})">Edit localities</md-button>
      <md-button @click.native="post_clusters">Post clusters</md-button>
    </div>

    <!-- ROUTER-VIEW -->
    <router-view :selected_localities='selected_localities'></router-view>

    <!-- SNACKBAR -->
    <md-snackbar :md-position="snack_bar.vertical + ' ' + snack_bar.horizontal" ref="snackbar" :md-duration="snack_bar.duration">
      <span>Cannot reach server.</span>
    </md-snackbar>
  
  </div>
</template>

<script>
  import vueSlider from 'vue-slider-component'

  export default {
    name: 'OperationalUnitView',
    components: {vueSlider},
    data() {
      return {
        can_start_clustering: true,
        country_code: 'SWZ',
        risk_slider: 0,
        slider_options: {
          min: 1,
          max: 5,
          value: 1,
          interval: 1
        },
        snack_bar: {
          vertical: 'top',
          horizontal: 'center',
          duration: 4000
        }
      }
    },
    computed: {
      sorted_localities() {
        return this.$store.state.irs_plan.localities.sort((a,b) => a.properties.MaxRisk - b.properties.MaxRisk).reverse()
      },
      selected_localities() {
        return this.sorted_localities.slice(0, this.risk_slider)
      },
      currentRoute() {
        return this.$route.name
      }
    },
    methods: {
      get_ous() {
        return this.$store.dispatch("irs_plan:get_ous", this.country_code).then(res => {
          this.slider_options.max = res.length
          this.slider_options.value = res.length
        })
      },
      start_clustering() {
        if(this.selected_localities.length === 0) return

        this.selected_localities = this.sorted_localities.slice(0, this.risk_slider)


        this.$store.commit("irs_plan:set_selected_localities", this.selected_localities)

        this.can_start_clustering = false

        this.$store.dispatch("irs_plan:start_clustering", this.country_code)
          .then((res) => {
            this.can_start_clustering = true
            if(res.error) {
              this.$refs.snackbar.open()
            } else {
              this.$router.push({name: 'irs_plan:create:preview'})
            }
          })
          .catch(() => {
            this.can_start_clustering = true
            this.$refs.snackbar.open()
          })
      },
      post_clusters() {
        this.$store.dispatch('irs_plan:post_clusters').then(() => {
          console.log('posted clusters')  
        })
        
      }
    }
  }
</script>

<style>
  .container {
    margin: 10px;
  }
</style>