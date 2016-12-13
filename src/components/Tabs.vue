<template>
  <div>
  
    <md-tabs class="tabs" @change="onTabChange" :md-centered="true">
      <md-tab v-for="(route, index) in routes" :md-label="route.title" :md-active="isActive(route)"></md-tab>
    </md-tabs>
    
    <md-toolbar class="select">
      <md-input-container>
        <md-select name="navigation" :value="$route.name" @change="onSelectChange">
          <md-option v-for="route in routes" :value="route.name">{{route.title}}</md-option>
        </md-select>
      </md-input-container>
    </md-toolbar>

  </div>
</template>

<script> 
  export default {
    props: [
      'routes'
    ],
    data() {
      return {
        initialTabStateSet: false,
      }
    },
    methods: {
      onTabChange(i) {
        this.$router.push({name: this.routes[i].name})
      },
      onSelectChange(e) {
        this.$router.push({name: e})
      },
      isActive(route) {
        return this.$route.name.indexOf(route.name) >= 0
      }
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