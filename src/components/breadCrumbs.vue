<template>
  <div>
    <md-button v-for="bread in crumbs" @click="$router.push(bread.route)">
      {{bread.title}}
    </md-button>
  </div>
</template>
<script>
  export default {
    props: ['crumbs']
  }
</script>