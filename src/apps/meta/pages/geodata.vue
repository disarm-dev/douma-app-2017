<template>
  <div class="applet_container">
    <h2>Geodata</h2>
    <div>
      <md-list class="list">
        <md-list-item v-for="level in level_names" :key="level">
          <md-icon v-if="cache_status[level] === true">done</md-icon>
          <md-icon v-else>error</md-icon> 
          {{level}}
          <div>
            <md-button @click.native="get_geodata_for(level)" class="list-button md-raised md-primary md-list-action">Download</md-button>
          </div>
        </md-list-item>
      </md-list>
    </div>
  </div>
</template>

<script>
  
  import {get_geodata_for} from './geodata.controller.js'
  import {get_all_spatial_hierarchy_level_names} from 'lib/geodata/spatial_hierarchy_helper'
  import {geodata_has_level} from 'lib/geodata/geodata.valid'
  

  export default {
    name: 'geodata',
    data () {
      return {
        cache_status: {},
        level_names: []
      }
    },
    computed: {
      slug() {
        return this.$store.state.instance_config.instance.slug
      }
    },
    mounted() {
      this.calculate_cache_status()
      this.level_names = get_all_spatial_hierarchy_level_names()
    },
    methods: {
      calculate_cache_status(level) {
        this.level_names.forEach(level => {
          this.$set(this.cache_status, level, geodata_has_level(level))
        })
      },
      get_geodata_for(level) {
        get_geodata_for(level, this.slug).then(() => {
          this.calculate_cache_status()
        })
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
</style>