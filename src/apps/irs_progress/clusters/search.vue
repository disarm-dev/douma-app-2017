<template>
  <div>
    <h2>Search list of clusters</h2>
    <md-button @click="$router.push({name: 'irs_progress:clusters'})">List</md-button>
    <md-button @click="$router.push({name: 'irs_progress:clusters:map'})">Map</md-button>
    <md-button @click="$router.push({name: 'irs_progress:clusters:search'})">Search</md-button>
    <md-button @click="$router.push({name: 'irs_progress:clusters:edit'})">Edit</md-button>
  </div>
</template>