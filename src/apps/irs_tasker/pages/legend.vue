<template>
  <div>
      <div v-for="{team_name, colour} in decorated_teams" class="legend" :class="{'selected': selected_team_name === team_name}" @click="select_team(team_name)">
        <div class="legend-box" :style="{'background-color': colour}"></div>
        <div class="legend-name">{{team_name}}</div>
      </div>
  </div>
</template>

<script>
export default {
  props: ['decorated_teams', 'selected_team_name'],
  name: 'legend',
  methods: {
    select_team(team_name) {
      this.$emit('selected_team', team_name)
    }
  }
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