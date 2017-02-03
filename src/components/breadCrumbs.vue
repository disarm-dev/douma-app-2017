<template>
  <div>
    <router-link v-for="bread in crumbs" :to="bread.route">
      {{bread.title}}
    </router-link>
  </div>
</template>
<script>
  export default {
    computed: {
      crumbs() {
        return this.$route.matched
          .filter((match) => match.meta.hasOwnProperty('breadcrumb'))
          .map((match) => {
            let title
            let route

            if (match.meta.hasOwnProperty('prependBreadcrumb')) {
              title = this.$route.params[match.meta.prependBreadcrumb] + " " + match.meta.breadcrumb
            } else {
              title = match.meta.breadcrumb
            }

            route = match.path.split('/').map((part) => {
              if (part.indexOf(':') === 0) {
                return this.$route.params[part.slice(1,part.length)]
              } else {
                return part
              }
            }).join("/")

            return {
              title: title,
              route: route
            }
        })
      }
    }

  }
</script>

<style>
    

</style>