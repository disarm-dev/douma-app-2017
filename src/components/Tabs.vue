<template>
  <div>
  
    <md-tabs class="tabs" @change="onTabChange" :md-centered="true">
      <md-tab v-for="(route, index) in routes" :md-label="route.title" :md-active="isTabActive(route)"></md-tab>
    </md-tabs>
    
    <md-toolbar class="select">
      <md-input-container>
        <md-select name="navigation" :value="selectValue" @change="onSelectChange">
          <md-option v-for="route in routes" :value="route.name">{{route.title}}</md-option>
        </md-select>
      </md-input-container>
    </md-toolbar>

  </div>
</template>

<script> 
  import {find} from 'lodash'

  export default {
    props: ['value'], // the current route's name
    data() {
      return {
        initialTabStateSet: false,
      }
    },
    methods: {
      onTabChange(i) {
        // // `initialTabStateSet` is required to override the default
        // //  functionality of the md-tabs component, which would otherwise 
        // // do something bad, but I can't figure exactly what...
        // if (this.initialTabStateSet) {
        //   console.log('!initialTabStateSet')
        //   this.initialTabStateSet = !!this.initialTabStateSet
        //   return
        // }
        this.$router.push({name: this.routes[i].name})
      },
      onSelectChange(e) {
        this.$router.push({name: e})
      },
      isTabActive(route) {
        // the tab has the value foci:monitor, but the route is foci:monitor:map
        // check if the current route contains the value of the tab
        return this.value.indexOf(route.name) !== -1
      }
    },
    computed: {
      selectValue() {
        // find the value displayed by the select component
        const route = find(this.$router.options.routes, {name: this.value})
        return route.title
      },
      routes () {
        const numberOfColons = (this.value.match(/:/g) || []).length

        // get the first part of the name (foci/meta/irs)
        const namespace = (numberOfColons ? this.value.split(':')[0] : this.value)

        return this.$router.options.routes
        .filter((r) => {
          // only get routes for this namespace
          return r.name.indexOf(namespace) !== -1
        })
        .filter((r) => {
          // return root routes (foci:investigate, irs:monitor, meta:login)
          return (r.name.match(/:/g) || []).length === 1
        })
      },
    }
  }
</script>

<style>
  .md-select-value {
    text-transform: capitalize;
  }

  .md-tabs .md-tabs-content {
    height: 0 !important;
  }

  .md-select .md-select-menu {
    left: auto !important;
    right: 20px !important;
  }

  .select .md-input-container {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
  }

  .tabs {
    display: none;
  }

  .select {
    display: block;
    padding-right: 2em;
    padding-left: 2em;
    z-index: 2;
  }

  @media screen and (min-width: 500px) {
    .tabs {
      display: flex;
    }

    .select {
      display: none;
    }
  }
  
</style>