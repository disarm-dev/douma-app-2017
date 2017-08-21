export default {
  get_data(input_data) {
    // make a request to aggregator
    // 
    const data = [
      {
        x: ['Team 2'],
        y: [750],
        name: 'Team 2',
        type: 'bar'
      }, {
        x: ['Team 1'],
        y: [1340],
        name: 'Team 1',
        type: 'bar'
      }
    ]
    return data
  },

  get_layout() {
    const layout =  {
      "showlegend": true,
      "title": "Performance versus target",
      "yaxis": {
        "title": "# of rooms"
      },
      "xaxis": {
        "title": "Teams"
      }
    }
    return layout
  }
}

