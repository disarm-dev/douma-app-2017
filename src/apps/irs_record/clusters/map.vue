<template>
  <div>
    <h2>Map list of clusters</h2>
    <md-button @click.native="$router.push({name: 'irs_record:clusters'})">List</md-button>
    <md-button @click.native="$router.push({name: 'irs_record:clusters:map'})">Map</md-button>
    <md-button @click.native="$router.push({name: 'irs_record:clusters:search'})">Search</md-button>
    <md-button @click.native="$router.push({name: 'irs_record:clusters:edit'})">Edit</md-button>
  </div>
</template>