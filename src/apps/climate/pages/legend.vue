<template>
  <div class="legend-container">
    <div class="legend">
      <p v-if="title"><b>{{title}}</b></p>
      <template v-for="(color, index) in colors">
        <div>
          <i :style="`background:  ${color} `"></i>
          <span>{{labels[index]}}</span>

          <span v-if="labels[index + 1] !== undefined"> -  {{labels[index + 1]}}</span>
          <span v-else> + </span>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {

  name: 'legend',
  props: ['layer', 'country'],
  data () {
    return {
      labels: [],
      colors: [],
      title: null
    };
  },
  watch: {'layer': 'update_legend'},
  computed: {
    palette_url() {
      const root_url = WEATHER_API_URL
      return `${root_url}/${this.country}/palettes/${this.layer.slug}_palette`
    }
  },
  methods: {
    update_legend() {
      fetch(this.palette_url)
      .then(res => res.text())
      .then(res => {
        this.colors = []
        this.labels = []

        res.split('\n').map((line) => {
          let parts = line.split(',')

          if (parts[0]) {
            this.labels.push(parts[0])
            this.colors.push(`rgb(${parts[1]}, ${parts[2]}, ${parts[3]})`)
          }
        })

        this.labels = this.labels.map((label) => {
          switch (this.layer.slug) {
            case 'LST':
              this.title = '°C'
              label = Math.round((0.02 * label) - 273.15)
              break;
            case 'PRECIP':
              this.title = 'Max daily mm'
              label = Math.round(label / 5)
              break;
            case 'EVI':
              this.title = 'Max daily mm'
              let customRound = function(number, precision) {
                  var factor = Math.pow(10, precision);
                  var tempNumber = number * factor;
                  var roundedTempNumber = Math.round(tempNumber);
                  return roundedTempNumber / factor;
              }
              label = customRound(label, 3)
              break;
          }
          return label
        })
      })
    }
  }
};
</script>

<style lang="css" scoped>
  .legend-container {
    position: absolute;
    bottom: 10px;
    right: 10px;
    z-index: 3;

    background: white; 
    border-radius: 5px; 
    padding: 10px;
  }

  .legend {
    line-height: 18px;
    color: #555;
    float: right;
  }

  .legend i {
      width: 18px;
      height: 18px;
      float: left;
      margin-right: 8px;
      opacity: 0.7;
  }
</style>