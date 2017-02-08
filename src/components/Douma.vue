<template>
  <div>
    <md-toolbar>
      <md-button class="md-icon-button" @click.native="toggleSideNav">
        <md-icon>menu</md-icon>
      </md-button>
      <!-- <h2 class="md-title" style="flex: 1; padding-left: 0.5em;">NMCP Swaziland | DiSARM</h2> -->
      <h2 class="md-title" style="flex: 1"><bread-crumbs></bread-crumbs></h2> 
      <!-- TODO: @feature Need to add breadcrumbs in each app -->
    </md-toolbar>

    <md-sidenav class="md-left" ref="sideNav">
      <md-toolbar class="md-medium">
        <div class="md-toolbar-container">
          <img src="/assets/nmcp.png" style="height: 50px;">

        </div>
        <div v-if="user">
          <p @click.native="navigate('meta:profile')">Logged in: {{user.email}}</p>
        </div>
        <div v-else>
          <p>Nope, not logged in.</p>
        </div>
      </md-toolbar>

      <md-list>
      <!-- TODO: @refac Render these links dynamically, based on permissions, etc. Maybe grey-out disabled ones. -->
        <md-list-item @click.native="navigate('irs')">
          <md-icon>view_compact</md-icon><span>IRS Review</span>
        </md-list-item>
        
        <md-list-item @click.native="navigate('irs')">
          <md-icon>gps_fixed</md-icon><span>IRS Plan</span>
        </md-list-item>
        
        <md-list-item @click.native="navigate('irs_record')">
          <md-icon>insert_chart</md-icon><span>IRS Record</span>
        </md-list-item>

        <md-divider class="md-inset"></md-divider>

        <md-list-item @click.native="navigate('foci')">
          <md-icon>filter_center_focus</md-icon><span>Foci</span>
        </md-list-item>

        <md-list-item @click.native="navigate('cases')">
          <md-icon>featured_play_list</md-icon><span>Cases</span>
        </md-list-item>

        <md-list-item @click.native="navigate('gps')">
          <md-icon>gps_fixed</md-icon><span>GPS</span>
        </md-list-item>

        <md-divider class="md-inset"></md-divider>

        <md-list-item @click.native="navigate('meta:profile')">
          <md-icon>person</md-icon><span>Meta</span>
        </md-list-item>
      </md-list>
    </md-sidenav>    

    <div>
      <!-- Most likely to contain the AppletContainer -->
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import BreadCrumbs from './breadCrumbs.vue'

  export default {
    name: 'DOUMA',
    components: {
      BreadCrumbs
    },
    props: ['theme'],
    data() {
      return {
        showNav: true
      }
    },
    computed: {
      user() {
        return this.$store.state.user
      }
    },
    methods: {
      navigate(name) {
        this.$router.push({name})
        this.toggleSideNav()
      },
      toggleSideNav() {
        this.$refs.sideNav.toggle();
      }
    }
  }
</script>

<style scoped>

</style>
