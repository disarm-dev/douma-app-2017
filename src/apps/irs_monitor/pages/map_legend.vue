<template>
  <div class="legend">
    <div v-for="entry in entries" :key="entry.string">
      <div :style="{'background-color': entry.colour}"></div>
      <span>{{entry.string}}</span>
    </div>
  </div>
</template>

<script>
export default {

  name: 'map_legend',

  data () {
    return {
      entries: [
        {colour: 'red', string: 'red'},
        {colour: 'green', string: 'green'},
        {colour: 'blue', string: 'blue'}
      ]
    };
  }
};
</script>

<style lang="css" scoped>
</style>