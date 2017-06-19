<template>
  <div class='container'>
    <h1>IRS Plan</h1>

    <h4>
      {{title}} plan {{current_plan_date ? `from ${current_plan_date}` : ''}}
    </h4>

    <div v-if="online">
      <!--SELECT MODE-->
      <md-checkbox v-model="edit_mode" :disabled="edit_disabled">Edit mode</md-checkbox>

      <!--VIEW MODE-->
      <md-button v-if='!edit_mode' :disabled='!geodata_ready' class='md-raised' @click.native="load_plan">Load from remote</md-button>

      <!--EDIT MODE-->
      <md-button v-if='edit_mode' :disabled="!unsaved_changes" class='md-raised md-primary' @click.native="save_plan">Save</md-button>
      <md-button v-if='edit_mode' :disabled="!unsaved_changes" class='md-raised md-warn' @click.native="load_plan">Cancel edits</md-button>
      <md-button v-if='edit_mode' :disabled='!can_clear' class='md-raised' @click.native="clear_plan">Clear plan</md-button>

      <!--PLAN MAP-->
      <md-card>
        <md-card-content>
          <plan_map :geodata_ready="geodata_ready" :edit_mode="edit_mode" v-on:map_loaded="edit_disabled = false"></plan_map>
        </md-card-content>
      </md-card>

      <!--PLAN SUMMARY-->
      <md-card class="card"><md-card-content>
        <plan_summary :geodata_ready="geodata_ready"></plan_summary>
      </md-card-content></md-card>
    </div>

    <!-- Offline -->
    <div v-else>
      <h3>Plan only available with a network connection.</h3>
    </div>

    <!-- Progress-->
    <md-dialog ref="geodata_loading_modal" :md-click-outside-to-close="false">
      <md-dialog-title>Loading base layers</md-dialog-title>

      <md-dialog-content class="centred">
        <md-spinner :md-progress="geodata_loading_progress"></md-spinner>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button :disabled='!geodata_ready' class="md-primary" @click.native="$refs.geodata_loading_modal.close()">Start planning!</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
  import {mapState, mapGetters} from 'vuex'
  import moment from 'moment'

  import plan_summary from './plan-summary.vue'
  import plan_map from './plan-map.vue'
  import cache from 'config/cache.js'
  import {Plan} from 'models/plan.model.js'

  export default {
    name: 'Plan',
    components: {plan_summary, plan_map},
    data() {
      return {
        geodata_ready: false,
        edit_mode: false,
        edit_disabled: true,
      }
    },
    computed: {
      ...mapState({
        top_level_spatial_hierarchy: state => state.instance_config.spatial_hierarchy[0],
        slug: state => state.instance_config.slug,
        unsaved_changes: state => state.irs_plan.unsaved_changes,
        online: state => state.network_online,
        geodata_loading_progress: state => state.irs_plan.geodata_loading_progress,
        current_plan_date: state =>  {
          if (state.irs_plan.current_plan) {
            return moment(state.irs_plan.current_plan.planned_at).format('hh:mm a DD MMM YYYY')
          }
        },
      }),
      ...mapGetters({
        selected_target_area_ids: 'irs_plan/all_selected_area_ids'
      }),
      title() {
        if (!this.edit_mode) return "View"
        if (this.edit_mode && !this.current_plan_date) return "Create"
        if (this.edit_mode && this.current_plan_date) return "Edit"
       },
      can_clear() {
        return this.selected_target_area_ids.length !== 0
      }
    },
    mounted() {
      this.load_geo_data()
    },
    methods: {
      load_geo_data() {
        this.$store.commit('root:set_loading', true)
        this.$store.dispatch('irs_plan/get_geodata', {
          slug: this.slug,
          level: this.top_level_spatial_hierarchy.name,
          cache: cache,
          store: this.$store
        })
          .then(() => {
            this.$store.commit('root:set_loading', false)
            this.geodata_ready = true
          })
          .catch(() => {
            this.$store.commit('root:set_loading', false)
          })

        // Only show progress modal if request taking more than 2 secs
        // (i.e. probably not coming from SW/browser cache
        setTimeout(() => {
          if (!this.geodata_ready) {
            this.$refs.geodata_loading_modal.open()
          }
        }, 1000)
      },
      load_plan() {
        this.$store.commit('root:set_loading', true)

        this.$store.dispatch('irs_plan/get_current_plan')
          .then(() => { this.$store.commit('root:set_loading', false) })
          .catch(() => { this.$store.commit('root:set_loading', false) })

      },
      save_plan() {
        const plan = new Plan().create({
          selected_target_area_ids: this.selected_target_area_ids,
          top_level_spatial_hierarchy: this.top_level_spatial_hierarchy,
          country: this.slug
        })

        this.$store.commit('root:set_loading', true)
        this.$store.dispatch('irs_plan/save_plan', plan)
          .then(() => {
            this.$store.commit('root:set_snackbar', {message: 'Successful save'})
            this.$store.commit('root:set_loading', false)
          })
          .catch(() => {
            this.$store.commit('root:set_snackbar', {message: 'Not saved. Something wrong.'})
            this.$store.commit('root:set_loading', false)
          })
      },
      clear_plan() {
        this.$store.commit('irs_plan/clear_plan')
      }
    }
  }
</script>

<style scoped>
  .container {
    margin: 0 auto;
    width: 90%;
    padding: 10px;
  }

  .card {
    margin-top: 10px;
  }

  .centred {
    margin: 0 auto;
  }

  .md-chip {
    background: orange;
    color: white;
  }


</style>
