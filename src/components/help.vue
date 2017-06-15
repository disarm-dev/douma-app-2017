<template>
  <div class="container">
    <h3>
      <md-icon>help</md-icon>
      Help
    </h3>
    <md-input-container>
      <label>Search</label>
      <md-input v-model="search_term"></md-input>
    </md-input-container>

    <div class='section' v-for="section in sections" :key="section">
      <h4>{{section}}</h4>
        <div class="item" v-for="{title, image, content} in items_for_section(section)" :key="title">
          <h5>{{title}}</h5>
          <div>{{content}}</div>
        </div>
    </div>
  </div>
</template>

<script>
  import array_unique from 'array-unique'
  import Fuse from 'fuse.js'

  const help_content = require("json-loader!yaml-include-loader!../help_articles/help.yaml")

  export default {
    name: 'help',
    data() {
      return {
        search_term: '',
        flat_help: []
      }
    },
    computed: {
      filtered_help_content() {
        if (this.search_term === '') return this.flat_help

        const options = {
          shouldSort: true,
          threshold: 0.4,
          location: 0,
          distance: 100,
          maxPatternLength: 32,
          minMatchCharLength: 2,
          keys: [
            {name: 'content', weight: 0.7},
            {name: 'title', weight: 0.2},
            {name: 'section_title', weight: 0.1}
          ]
        }
        const fuse = new Fuse(this.flat_help, options)

        return fuse.search(this.search_term)

      },
      sections() {
        return array_unique(this.filtered_help_content.map(c => c.section_title))
      },
    },
    created() {
      const section_titles = help_content.map(section => {
        return section.section_title
      })

      section_titles.forEach(section_title => {
        help_content.find(section => section.section_title === section_title).articles.forEach(article => {
          article.section_title = section_title
          this.flat_help.push(article)
        })
      })
    },
    methods: {
      items_for_section(section_title) {
        return this.filtered_help_content.filter(c => c.section_title === section_title)
      },
    }
  }
</script>

<style>
  .container {
    margin: 10px;
  }
</style>
