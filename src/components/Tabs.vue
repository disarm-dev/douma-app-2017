<template>
  <div>
    <md-tabs class="tabs" @change="onTabChange"  :md-centered="true">
      
      <md-tab v-for="value in routes" :md-label="value.title" :md-active="current == value.name"></md-tab>

    </md-tabs>
    
    <md-toolbar class="select">
      <md-input-container>
        <md-select name="navigation" :value="current" @change="onSelectChange">

          <md-option v-for="value in routes" :value="value.name">{{value.name}}</md-option>

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
        firstClick: true,
        // TODO: get `selected` from state, not set arbitrary
        selected:  '',
        routes: [
          {
            title: 'Monitor',
            name: 'monitor'
          },
          {
            title: 'Identify',
            name: 'identify'
          },
          {
            title: 'Investigate',
            name: 'investigate'
          },
          {
            title: 'Classify',
            name: 'classify'
          },
          {
            title: 'Respond',
            name: 'respond'
          }
        ]
      }
    },
    methods: {
      onTabChange(i) {
        if (this.firstClick) {
          this.firstClick = false;
          return;
        }
        this.$emit('change', this.routes[i].name)
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