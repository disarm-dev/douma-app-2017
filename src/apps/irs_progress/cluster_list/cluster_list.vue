<template>
  <div style="margin: 0 auto; max-width: 700px;">
    <span class="md-headline">Clusters</span>
    <md-list>
      <md-list-item v-for="cluster in clusters">
        <md-icon>move_to_inbox</md-icon> <span>No. #{{cluster}}</span>
      </md-list-item>
    </md-list>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        clusters: ['67812387123', '61812371911', '75178121312']
      }
    }
  }
</script>