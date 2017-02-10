<template>
  <div>
    <h1>TaskShow</h1>

    <md-list class="md-double-line">
      <template v-for='key in Object.keys(task)'>
        <md-list-item>
          <div class="md-list-text-container">
            <span>{{task[key]}}</span>
            <span>{{key}}</span>
          </div>
        </md-list-item>
      </template>
    </md-list>

  </div>
</template>

<script>
  export default {
    name: 'TaskShow',
    props: ['cluster_id', 'task_id', 'task'],
    computed: {
    }
  }
</script>