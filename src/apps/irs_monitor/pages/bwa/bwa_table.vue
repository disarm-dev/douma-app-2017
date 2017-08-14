<template>
  <v-client-table :data="table_data" :columns="table_columns"></v-client-table>
</template>

<script>
export default {

  name: 'bwa_table',

  data () {
    return {
      table_columns: [
        'Villages', 
        'Number of building targeted (N)', 
        'Number of people in homestead < 5 years old', 
        'Number of people in homestead => 5 years old',
        'Number of buildings visited',
        'Number of rooms visited', 
        'Total rooms sprayed',
        'Rooms sprayed with DDT (N)',
        'Rooms sprayed with Lambda-cyhalothrin (N)',
        'Number of other structures visited',
        'Total other structures sprayed',
        'Total other structures sprayed with DDT',
        'Total other structures sprayed with Lambda-cyhalothrin',
        'Number of rooms not sprayed',
        'Number of rooms not sprayed - Unsprayable (N)',
        'Number of rooms not sprayed - Unsprayable (%)',
        'Number of sprayable rooms not sprayed',
        'Number of rooms not sprayed -Locked (N)',
        'Number of rooms not sprayed -Locked (%)',
        'Number of rooms not sprayed -Nobody(N)',
        'Number of rooms not sprayed -Nobody(%)',
        'Number of rooms not sprayed -Refusal (N)',
        'Number of rooms not sprayed -Refusal (%)',
        'Number of rooms not sprayed -Baby(N)',
        'Number of rooms not sprayed -Baby (%)',
        'Number of rooms not sprayed -Patient (N)',
        'Number of rooms not sprayed -Patient (%)',
        'Number of rooms not sprayed -Funeral (N)',
        'Number of rooms not sprayed -Funeral (%)',
        'Number of rooms not sprayed -Kitchen (N)',
        'Number of rooms not sprayed -Kitchen (%)',

      ]
    };
  },
  computed: {
    table_data() {
      return ['Kachikau', 'Kavimba', 'Kazungula', 'Lesoma', 'Mabele', 'Pandamatenga', 'Parakarugu', 'Satau', 'CH5', 'CAD565'].map((area) => {
        let result = {}
        for (let field_name of this.table_columns) {
          result[field_name] = this.getRandomInt(1, 600)
        }
        result['Villages'] = area
        return result
      })
    }
  },
  methods: {
    getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  }
};
</script>

<style lang="css" scoped>
</style>