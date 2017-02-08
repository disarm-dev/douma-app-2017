<template>
  <span>
    <strong>{{distance}}</strong> {{task.osm_id}}
  </span>
</template>

<script>
  export default {
    props: ['task'],
    computed: {
      distance() {
        if (!this.task.distance) return ''
        return this.task.distance.toFixed(2) + "kms"
      }
    }
  }
</script>