<template>
  <div>
    <h2>Search list of clusters</h2>
    <md-chips v-model="searchOptions" md-input-placeholder="Add filter/search option">
      <template scope="chip">{{ chip.value }}</template>
    </md-chips>
  </div>
</template>