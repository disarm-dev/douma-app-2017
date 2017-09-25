<template>
  <div>
    <!-- Toolbar -->
    <toolbar></toolbar>

    <!-- Sidenav -->
    <sidebar></sidebar>

    <!-- Notifications (snackbar and serviceWorker dialog) -->
    <notifications></notifications>

    <!-- Help -->
    <help></help>

    <!-- Applet container -->
    <router-view></router-view>
  </div>
</template>

<script>
  import toolbar from 'components/toolbar.vue'
  import notifications from 'components/notifications.vue'
  import sidebar from 'components/sidebar.vue'
  import help from 'components/help.vue'

  import {read_all_network, read_all_cache} from 'lib/models/response'

  export default {
    name: 'DOUMA',
    components: {toolbar, sidebar, notifications, help},
    created() {
      window.read_all_network = read_all_network
      window.read_all_cache = read_all_cache
    }
  }
</script>

<style>
  body {
    background-color: white;
    padding-top: 48px;
  }

  .applet_container {
    margin: 0.6em auto;
    width: 100%;
  }

  @media screen and (min-width: 600px) {
    .applet_container {
      width: 90%;
    }
  }



</style>
