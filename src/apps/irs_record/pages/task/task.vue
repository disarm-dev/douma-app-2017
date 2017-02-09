<template>
  <div>
    <div>Task view - form for {{task_id}}</div>
    <md-button @click.native='save'>Save</md-button>
    <md-button @click.native='cancel' class='md-warn'>Cancel</md-button>
  </div>
</template>

<script>
  export default {
    name: 'Task',
    computed: {
      task_id() {
        return this.$route.params.task_id
      }
    },
    methods: {
      save() {
        this.$router.back()
      },
      cancel() {
        this.$router.back()
      }
    }
  }
</script>