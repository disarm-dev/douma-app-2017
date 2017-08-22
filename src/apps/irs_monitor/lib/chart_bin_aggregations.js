// find the correct aggregations for the chart
import {aggregate_on} from 'lib/instance_data/aggregator'

/**
 * Apply correct aggregation to each bin of responses in each series
 * @param options.series - Defined in instance_config
 * @param options.chart_type - 'bar', 'line', etc - see Plotly docs
 * @param binned_responses - As created by `d3.nest()`
 */
export function aggregate_series_for_chart({binned_responses, options}) {
  const series_for_chart = options.series.map(serie => {
    return {
      aggregation: aggregations.find(a => a.name === serie.aggregation_name),
      colour: serie.colour
    }
  })

// calculate rolled-up value for each bin
  return series_for_chart.map(series => {
    const x = []
    const y = []

    binned_responses.forEach(bin => {
      const value = aggregate_on({aggregation: series.aggregation, responses: bin.values, denominators})
      x.push(bin.key)
      y.push(value)
    })

    // shape the data to return
    return {
      x: x,
      name: series.aggregation.name,
      y: y,
      type: options.chart_type,
      marker: {color: series.colour}
    }
  })
}
