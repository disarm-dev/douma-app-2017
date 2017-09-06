<template>
  <div class="applet_container">
    <h2>Geographic data</h2>
    <p>To continue, you need to load the geographic data.</p>
    <div class="list">

      <md-list>
        <md-list-item v-for="level in level_names" :key="level" >


          <!-- DOWNLOAD STATUS-->
          <md-avatar>
            <md-icon v-if="cache_status[level] == true" class="success">check_circle</md-icon>
            <span v-else-if="isLoading(`geodata/${level}`)"><md-spinner md-indeterminate class="md-accent" :md-size="30"></md-spinner></span>
            <md-icon v-else class="md-warn">error</md-icon>
          </md-avatar>


          <!-- LEVEL NAME -->
          <span>{{level}}</span>


          <!--DOWNLOAD BUTTON -->
          <md-button
            @click.native="retrieve_geodata_for(level)"
            :disabled="isLoading(`geodata/${level}`) || cache_status[level] == true"
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

  import {get_all_spatial_hierarchy_level_names} from 'lib/instance_data/spatial_hierarchy_helper'
  import {geodata_has_level} from 'lib/models/geodata/geodata.valid'
  import {get_geodata_for} from 'lib/models/geodata/remote'
  import {get_and_store_locally_geodata_for} from 'lib/models/geodata/remote'
  import {hydrate_geodata_cache_from_idb} from "lib/models/geodata/local.geodata_store";

  export default {
    name: 'geodata',
    data () {
      return {
        cache_status: {},
        level_names: get_all_spatial_hierarchy_level_names()
      }
    },
    computed: {
      ...mapGetters({
        isLoading: 'loading/isLoading'
      })
    },
    mounted() {
      hydrate_geodata_cache_from_idb().then(() => {
        this.calculate_cache_status()
      })
    },
    methods: {
      calculate_cache_status() {
        this.level_names.forEach(level => {
          const status = geodata_has_level(level)
          this.$set(this.cache_status, level, status)
        })
      },
      retrieve_geodata_for(level) {
        this.$startLoading(`geodata/${level}`)

        get_and_store_locally_geodata_for(level)
          .then(() => {
            return hydrate_geodata_cache_from_idb()
          })
          .then(() => {
            console.log('get here')
            this.calculate_cache_status()
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
