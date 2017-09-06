<template>
  <div class="applet_container">
    <h2>Geographic data</h2>
    <p>To continue, you need to load the geographic data.</p>
    <div class="list">

      <md-list>
        <md-list-item v-for="level in level_names" :key="level" >


          <!-- DOWNLOAD STATUS-->
          <md-avatar>
            <md-icon v-if="loading_progress[level].status == 'complete'" class="success">check_circle</md-icon>
            <span v-else-if="isLoading(`geodata/${level}`)"><md-spinner md-indeterminate class="md-accent" :md-size="30"></md-spinner></span>
            <md-icon v-else class="md-warn">error</md-icon>
          </md-avatar>


          <!-- LEVEL NAME -->
          <span>
            {{level}}
            <span v-if="loading_progress[level].total">{{loading_progress[level].total}}</span>
            <span v-if="loading_progress[level].progress">{{loading_progress[level].progress}}</span>
          </span>


          <!--DOWNLOAD BUTTON -->
          <md-button
            @click.native="retrieve_geodata_for(level)"
            :disabled="isLoading(`geodata/${level}`) || loading_progress[level].status == 'complete'"
            class="md-dense list-button md-raised md-primary"
          >
            Download
          </md-button>

        </md-list-item>
      </md-list>

      <div>
        <md-button class='md-primary md-raised' @click.native="back">Back</md-button>
      </div>

    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import numeral from 'numeral'
  import bytes from 'bytes'

  import {get_all_spatial_hierarchy_level_names} from 'lib/instance_data/spatial_hierarchy_helper'
  import {geodata_has_level} from 'lib/models/geodata/geodata.valid'
  import {get_geodata_for} from 'lib/models/geodata/remote'
  import {get_and_store_locally_geodata_for} from 'lib/models/geodata/remote'
  import {hydrate_geodata_cache_from_idb} from "lib/models/geodata/local.geodata_store";

  export default {
    name: 'geodata',
    data () {
      return {
        loading_progress: {},
        level_names: get_all_spatial_hierarchy_level_names()
      }
    },
    computed: {
      ...mapGetters({
        isLoading: 'loading/isLoading'
      })
    },
    created() {
      for (let level_name of this.level_names) {
        this.$set(this.loading_progress, level_name,  {
          status: '',
          progress: '',
          total: ''
        })
      }
    },
    mounted() {
      hydrate_geodata_cache_from_idb().then(() => {
        this.calculate_loading_progress()
      })
    },
    methods: {
      calculate_loading_progress() {
        this.level_names.forEach(level => {
          const status = geodata_has_level(level) ? 'complete' : 'none'
          console.log('level, status', level, status)
          this.loading_progress[level].status = status
          console.log('this.loading_progress', this.loading_progress)
        })
      },
      retrieve_geodata_for(level) {
        this.$startLoading(`geodata/${level}`)

        get_and_store_locally_geodata_for(level, this.update_progress)
          .then(() => {
            return hydrate_geodata_cache_from_idb()
          })
          .then(() => {
            this.calculate_loading_progress()
            this.$endLoading(`geodata/${level}`)
          })
          .catch((err) => {
            this.$endLoading(`geodata/${level}`)
            console.error(err)
          })

      },
      back() {
        this.$router.push('/')
      },
      update_progress(progress_event) {
        const progress = numeral(progress_event.loaded / progress_event.total).format('0%')
        this.loading_progress[progress_event.level_name].progress = progress

        const total = bytes(progress_event.total)
        this.loading_progress[progress_event.level_name].total = total

        console.log('progress', progress_event, progress)
      }
    }
  }
</script>

<style lang="css" scoped>
  .list {
    max-width: 600px;
    margin: 0 auto;
  }

  .list-button {
    float: right;
  }

  .success {
    color: #689F38;
  }
</style>
