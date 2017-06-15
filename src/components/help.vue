<template>
  <div class="container">
    <md-input-container>
      <label>Search</label>
      <md-input v-model="search_term"></md-input>
    </md-input-container>

    <div class='section' v-for="section in sections" :key="section">
      <h4>
        {{section}}
      </h4>
        <div
          class="item"
          v-for="{title, image, content, excerpt, show_excerpt} in items_for_section(section)"
          :key="title"
          @click="toggle_show_excerpt(title, section)"
        >
          <h5>• {{title}}</h5>
          <div v-if="show_excerpt">{{excerpt}}</div>
          <div v-else>{{content}}</div>
        </div>
      <hr>
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
      this.prepare_help_items()
    },
    methods: {
      prepare_help_items() {
        const truncate_at = 150
        const section_titles = help_content.map(section => {
          return section.section_title
        })

        section_titles.forEach(section_title => {
          help_content.find(section => section.section_title === section_title).articles.forEach(article => {
            article.section_title = section_title
            article.excerpt = article.content.length > truncate_at ? article.content.slice(0, truncate_at) + "..." : article.content
            article.show_excerpt = true
            this.flat_help.push(article)
          })
        })
      },
      items_for_section(section_title) {
        return this.filtered_help_content.filter(c => c.section_title === section_title)
      },
      toggle_show_excerpt(title, section) {
        const item = this.filtered_help_content.filter(item => {
          return item.section_title == section && item.title == title
        })[0]

        if (item) {
          item.show_excerpt = !item.show_excerpt
        }
      }
    }
  }
</script>

<style>
  .container {
    padding: 10px;
    width: 100%;
  }
</style>
