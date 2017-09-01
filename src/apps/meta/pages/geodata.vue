<template>
  <div class="applet_container">
    <h2>Geodata</h2>
    <div class="list">

      <md-list>
        <md-list-item v-for="level in level_names" :key="level" >
          <md-icon v-if="cache_status[level] == true">done</md-icon>
          <md-icon v-else>error</md-icon>

          <span>{{level}}</span>
          <md-button @click.native="retrieve_geodata_for(level)" class="md-dense list-button md-raised md-primary">Download</md-button>
        </md-list-item>
      </md-list>

      <div>
        <md-button class='md-primary md-raised' @click.native="back">Back</md-button>
      </div>

    </div>
  </div>
</template>

<script>

  import {get_all_spatial_hierarchy_level_names} from 'lib/geodata/spatial_hierarchy_helper'
  import {geodata_has_level} from 'lib/geodata/geodata.valid'
  import {get_geodata_for} from 'lib/remote/remote.geodata'
  import {get_and_set_geodata_for} from 'lib/remote/remote.geodata'
  import {hydrate_geodata_cache_from_idb} from "lib/geodata/local.geodata_store";

  export default {
    name: 'geodata',
    data () {
      return {
        cache_status: {},
        level_names: get_all_spatial_hierarchy_level_names()
      }
    },
    mounted() {
      this.calculate_cache_status()
    },
    methods: {
      calculate_cache_status() {
        this.level_names.forEach(level => {
          const status = geodata_has_level(level)
          this.$set(this.cache_status, level, status)
        })
      },
      retrieve_geodata_for(level) {
        get_and_set_geodata_for(level)
          .then(() => {
            return hydrate_geodata_cache_from_idb()
          })
          .then(() => {
            console.log('get here')
            this.calculate_cache_status()
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
</style>
