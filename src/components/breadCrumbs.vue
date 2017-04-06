<template>
  <div>
    <!-- DiSARM > -->
    <template v-for="(bread, index) in crumbs">
      <router-link :to="bread.route" class='crumb'> 
        <md-icon v-if='bread.icon'>{{bread.icon}}</md-icon>
        {{bread.title}}
      </router-link>
      <span v-if='index !== (crumbs.length - 1)'> > </span>
    </template>
  </div>
</template>

<script>
  export default {
    data() { 
      return { 
        crumbs: [] 
      }
    },
    watch: { 
      '$route': 'set_crumbs' 
    },
    mounted() {
      this.set_crumbs()
    },
    methods: {
      set_crumbs() {
        function truncString(str, max, add){
          add = add || '...';
          return (typeof str === 'string' && str.length > max ? str.substring(0,4)+add : str);
        }

        if(this.$route.matched.length === 0) return

        const applet_decorations = this.$router.options.routes.map((route) => {
          return {...route.meta, name: route.name}
        })

        let string = `${this.$route.matched[this.$route.matched.length - 1].path}`

        let array = string.split('/')
        let params = this.$route.params

        array = array.splice(1, array.length) // Remove first matched result, which seems to always be blank


        array = array.map((elem) => {
          return get_param_value(elem)
        })

        let result = array.map((part, i) => {
          if (i == 0) {
            const applet = applet_decorations.find((i) => i.name === part)
            return {
              title: applet.title, 
              icon: applet.icon,
              route: '/' + build_path(part, i + 1)
            }
          }
          let title = part[0].toUpperCase() + part.substr(1)
          title = truncString(title, 10, '...')

          return {
            title: title,
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

        this.crumbs = result
      }
    }

  }
</script>

<style scoped>
  .crumb {
    color: white !important;
    text-decoration: none !important;
  }    
</style>