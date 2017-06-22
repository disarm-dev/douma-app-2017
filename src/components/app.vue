<template>
  <div>
    <!-- MAIN PAGE 'TOOLBAR' -->
    <toolbar></toolbar>

    <!-- SIDENAV -->
    <sidebar></sidebar>

    <!-- NOTIFICATIONS (snackbar and serviceWorker dialog-->
    <notifications></notifications>

    <!-- HELP -->
    <help></help>

    <!-- APPLET CONTAINER -->
    <router-view></router-view>
  </div>
</template>

<script>
  import toolbar from 'components/toolbar.vue'
  import notifications from 'components/notifications.vue'
  import sidebar from 'components/sidebar.vue'
  import help from 'components/help.vue'

  export default {
    name: 'DOUMA',
    components: {toolbar, sidebar, notifications, help},
  }
</script>

<style>
  body {
    background-color: white;
    padding-top: 64px;
  }
</style>
