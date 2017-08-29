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
        console.log('this.options.text', this.options.text)
        const converter = new showdown.Converter({simpleLineBreaks: true})
        let makeHtml = converter.makeHtml(this.options.text)
        console.log('makeHtml', makeHtml)
        return makeHtml
      }
    }
  }
</script>

<style scoped>

</style>
