<template>
  <span>
    <md-card-header>
      <div class="md-title">{{options.title}}</div>
    </md-card-header>
    <md-card-content v-html="formatted_text">
    </md-card-content>
  </span>
</template>

<script>
  import showdown from 'showdown'

  export default {
    name: 'text-widget',
    props: ['chart_id', 'responses', 'targets', 'aggregations', 'options'],
    computed: {
      formatted_text() {
        const converter = new showdown.Converter({simpleLineBreaks: true})
        return converter.makeHtml(this.options.text)
      }
    }
  }
</script>

<style scoped>

</style>
