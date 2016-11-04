<template>
  <div>
    <md-tabs class="tabs" @change="onTabChange"  :md-centered="true">
      
      <md-tab v-for="value in routes" :md-label="value.name" :md-active="current == value.routeName"></md-tab>

    </md-tabs>
    
    <md-toolbar class="select">
      <md-input-container>
        <md-select name="navigation" :value="current" @change="onSelectChange">

          <md-option v-for="value in routes" :value="value.routeName">{{value.name}}</md-option>

        </md-select>
      </md-input-container>
    </md-toolbar>

  </div>

</template>

<script> 

  export default {
    props: ['value'],
    data() {
      return {
        selected:  'Monitor',
        routes: [
          {
            name: 'Monitor',
            routeName: 'monitor'
          },
          {
            name: 'Identify',
            routeName: 'identify'
          },
          {
            name: 'Investigate',
            routeName: 'investigate'
          },
          {
            name: 'Classify',
            routeName: 'classify'
          },
          {
            name: 'Respond',
            routeName: 'respond'
          }
        ]
      }
    },
    methods: {
      onTabChange(i) {
        this.$emit('change', this.routes[i].routeName)
      },
      onSelectChange(e) {
        this.$emit('change', e)
      }
    },
    computed: {
      current() {
        if (this.value.indexOf(':') !== -1) {
          return this.value.split(':')[0];
        } else {
          return this.value;
        }
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