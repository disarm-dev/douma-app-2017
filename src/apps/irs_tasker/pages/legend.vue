<template>
  <div>
      <div v-for="{name, colour} in teams" class="legend" :class="{'selected': selected_team.name === name}" @click="selected_team = {name, colour}">
        <div class="legend-box" :style="{'background-color': colour}"></div>
        <div class="legend-name">{{name}}</div>
      </div>
  </div>
</template>

<script>
export default {
  props: ['teams'],
  name: 'legend'
};
</script>

<style scoped>
  .selected {
    background-color: rgba(0,0,0,0.3);
  }

  .legend {
    cursor: pointer;
    padding:1px 6px;
    display: inline-block;
    margin-right: 30px;
  }

  .legend-box {
    width: 10px;
    height: 10px;
    display: inline-block;

  }

  .legend-name {
    display: inline-block;
  }
</style>