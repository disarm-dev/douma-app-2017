<template>
  <div id="map"></div>
</template>

<script>
  export default {
    name: 'plan_map',
    props: ['edit'],
    data() {
      return {
        _map: null,
      }
    }
    mounted() {
      if (this.edit) {
        console.log('can edit')
      } else {
        console.log('cannot edit')
      }
    }
  }
</script>

<style>

</style>
