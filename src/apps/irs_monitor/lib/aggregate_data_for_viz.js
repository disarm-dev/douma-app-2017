// find the correct aggregations for the chart
import {aggregate_on} from 'lib/instance_data/aggregator'

export function aggregate_for_chart({binned_responses, options, aggregations, targets}) {

}

/**
 * Apply correct aggregation to each bin of responses in each series
 * @param options.series - Defined in instance_config
 * @param options.chart_type - 'bar', 'line', etc - see Plotly docs
 * @param binned_responses - As created by `d3.nest()`
 * @param aggregations - from config
 * @param targets - from a Plan
 * @return {array} - Array of things for a chart
 */
function aggregate_single_series({binned_responses, options, aggregations, targets}) {
  const series = {
    aggregation: aggregations.find(a => a.name === options.series.aggregation_name),
    colour: options.series.colour
  }

  return binned_responses.map(bin => {
    const value = aggregate_on({aggregation: series.aggregation, responses: bin.values, targets})

    // shape the data to return
    return {
      x: [bin.key],
      name: bin.key,
      y: [value],
      type: options.chart_type
    }
  })
}

/**
 * Apply correct aggregation to each bin of responses in each series
 * @param options.series - Defined in instance_config
 * @param options.chart_type - 'bar', 'line', etc - see Plotly docs
 * @param binned_responses - As created by `d3.nest()`
 * @param aggregations - from config
 * @param targets - from a Plan
 * @return {array} - Array of things for a chart
 */
function aggregate_multi_series({binned_responses, options, aggregations, targets}) {
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
      const value = aggregate_on({aggregation: series.aggregation, responses: bin.values, targets})
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

/**
 * For a pie chart, apply correct aggregation to each bin of responses
 * @param binned_responses
 * @param options
 * @param aggregations
 * @param targets
 * @return {array} - Array of things for a chart
 */
export function aggregate_for_pie({binned_responses, options, aggregations, targets}) {
  const series_for_chart = options.series.map(serie => {
    return {
      aggregation: aggregations.find(a => a.name === serie.aggregation_name),
      colour: serie.colour
    }
  })

  const series = series_for_chart[0]

  let output = {
    labels: [],
    values: [],
    type: options.chart_type
  }

  binned_responses.forEach(bin => {
    const value = aggregate_on({aggregation: series.aggregation, responses: bin.values, targets})
    output.labels.push(bin.key)
    output.values.push(value)
  })

  return [output]
}

export function aggregate_for_table({binned_responses, options, aggregations, targets}){
  console.warn("TODO: 'aggregate_for_table' not implemented")
  return []
}

export function aggregate_for_map({binned_responses, options, aggregations, targets}) {
  console.warn("TODO: 'aggregate_for_map' not implemented")
  return []
}
