<template>
  <div>
    <strong class="title">{{title}}</strong>
      <div
        v-for="{text, colour} in entries"
        class="legend"
        :class="{'selected': selected_entry === text}"
        @click="select(text)"
      >
        <div class="legend-box" :style="{'background-color': colour}"></div>
        <div class="legend-name">{{text}}</div>
      </div>
  </div>
</template>

<script>
export default {
  props: ['entries', 'selected_entry', 'title'],
  name: 'legend',
  methods: {
    select(text) {
      this.$emit('select', text)
    }
  }
};
</script>

<style scoped>
  .selected {
    background-color: rgba(165, 165, 165, 0.3);
  }

  .title {
    padding-right: 10px;
  }

  .legend {
    cursor: pointer;
    padding:1px 6px;
    display: inline-block;
    margin-right: 10px;
    border-radius: 2px;
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
