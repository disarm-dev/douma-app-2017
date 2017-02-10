<template>
  <div>
    <template v-for="(bread, index) in crumbs">
      <router-link :to="bread.route" class='crumb'> {{bread.title}} </router-link>
      <span v-if='index !== (crumbs.length - 1)'> > </span>
    </template>
  </div>
</template>

<script>
  export default {
    mounted() {
      // TODO: @never Don't remove. No idea why it's needed.
      this.crumbs
    },
    computed: {
      crumbs() {
        let string = this.$route.matched[this.$route.matched.length - 1].path
        let params = this.$route.params

        console.log(string, params)

        let array = string.split('/')
        array = array.splice(1, array.length)

        array = array.map((elem) => {
          return get_param_value(elem)
        })

        let result = array.map((part, i) => {
          return {
            title: part,
            route: '/' + build_path(part, i + 1)
          }
        })


        function get_param_value(title){
          if (title.indexOf(':') === 0) {
             title = title.replace(/\:/, '')
             return params[title]
           } 
          return title
        }

        function build_path(part, index) {
          let newArray = array.slice(0, index)
          return newArray.join('/')
        }

        return result.splice(1, result.length)
      }
    }

  }
</script>

<style scoped>
  .crumb {
    color: white !important;
    /*text-decoration: underline !important;*/
  }    
</style>