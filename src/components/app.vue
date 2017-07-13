<template>
  <div>
    <!--Global hotkey-->
    <hotkeys></hotkeys>

    <!-- Toolbar -->
    <toolbar></toolbar>

    <!-- Sidenav -->
    <sidebar></sidebar>

    <!-- Notifications (snackbar and serviceWorker dialog-->
    <notifications></notifications>

    <!-- Help -->
    <help></help>

    <!-- Applet container -->
    <router-view></router-view>
  </div>
</template>

<script>
  import hotkeys from 'components/hotkeys.vue'
  import toolbar from 'components/toolbar.vue'
  import notifications from 'components/notifications.vue'
  import sidebar from 'components/sidebar.vue'
  import help from 'components/help.vue'

  export default {
    name: 'DOUMA',
    components: {hotkeys, toolbar, sidebar, notifications, help},
  }
</script>

<style>
  body {
    background-color: white;
    padding-top: 48px;
  }

  .container {
    margin: 1em auto;
    width: 90%;
  }

  /* TODO: @refac Controls should be in a component.*/
  .controls {
    min-height: 70px;
  }


</style>
