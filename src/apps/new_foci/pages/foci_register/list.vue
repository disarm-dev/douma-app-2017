<template>
  <div>
    <v-client-table :data="tableData" :columns="columns" name="focis" @row-click="handleClick"></v-client-table>
  </div>
</template>

<script>
  import {Event} from 'vue-tables-2';
  export default {
    name: 'FociSummaryTable',
    watch: {
    },
    created() {
    },
    mounted() {
      let _this = this
      Event.$on('vue-tables.row-click', (data) => {
        _this.handleClick(data)
      });
    },
    data () {
      return {
        columns: ['_id', 'location', 'structures', 'status']
      }
    },
    computed: {
      tableData() {
        return this.$store.state.foci.focis.map((foci) => foci.properties)
      }
    },
    methods: {
      handleClick({event, row}) {
        this.$router.push({name: 'foci:investigation', params: {foci_id: row._id}})
      }
    }

  }
</script>