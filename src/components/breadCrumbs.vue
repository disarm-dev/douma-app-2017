<template>
  <div>
    <template v-for="(bread, index) in crumbs">
      <router-link :to="bread.route"> {{bread.title}} </router-link><span v-if='index !== (crumbs.length - 1)'> > </span>
    </template>
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

            if (match.meta.hasOwnProperty('prependBreadcrumb') && match.meta.prependBreadcrumb !== '') {
              title = this.$route.params[match.meta.prependBreadcrumb] + " " + match.meta.breadcrumb
            } else if (match.meta.hasOwnProperty('appendBreadcrumb') && match.meta.appendBreadcrumb !== '') {
              title = match.meta.breadcrumb + " " + this.$route.params[match.meta.appendBreadcrumb]
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