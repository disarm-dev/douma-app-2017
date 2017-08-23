// find the correct aggregations for the chart
import {aggregate_on} from 'lib/instance_data/aggregator'
import {has} from 'lodash'

export function decorate_for_chart({binned_responses, options, aggregations, targets}) {
  // Figure what to do

  if (has(options, 'single_series')) {
    return decorate_single_series({binned_responses, options, aggregations, targets})
  } else if (has(options, 'multi_series')) {
    return decorate_multi_series({binned_responses, options, aggregations, targets})
  }
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
function decorate_single_series({binned_responses, options, aggregations, targets}) {
  const series = {
    aggregation: aggregations.find(a => a.name === options.single_series.aggregation_name)
  }

  let cumulative_value = 0 // Only used for cumulative counts

  return binned_responses.map(bin => {
    let value = aggregate_on({aggregation: series.aggregation, responses: bin.values, targets})

    if (options.cumulative) {
      value += cumulative_value
      cumulative_value = value
    }

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
function decorate_multi_series({binned_responses, options, aggregations, targets}) {
  const series_for_chart = options.multi_series.map(serie => {
    return {
      aggregation: aggregations.find(a => a.name === serie.aggregation_name),
      colour: serie.colour
    }
  })

  // calculate rolled-up value for each bin
  const data = series_for_chart.map(series => {
    const x = []
    const y = []


    let cumulative_value = 0// Only used for cumulative counts

    binned_responses.forEach(bin => {
      let value = aggregate_on({aggregation: series.aggregation, responses: bin.values, targets})

      if (options.cumulative) {
        value += cumulative_value
        cumulative_value = value
      }

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

  return data

}


/**
 * For a pie chart, apply correct aggregation to each bin of responses
 * @param binned_responses
 * @param options
 * @param aggregations
 * @param targets
 * @return {array} - Array of things for a chart
 */
export function decorate_for_pie({binned_responses, options, aggregations, targets}) {
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

export function decorate_for_table({binned_responses, options, aggregations, targets}){

  const found_aggregations = options.aggregation_names.map(aggregation_name => {
    return aggregations.find(a => a.name === aggregation_name)
  })

  return binned_responses.map((bin) => {
    let row = {row_name: bin.key}
    for (let aggregation of found_aggregations) {
      row[aggregation.name] = aggregate_on({aggregation: aggregation, responses: bin.values, targets})
    }
    return row
  })
}

export function decorate_for_map({binned_responses, options, aggregations, targets}) {
  console.warn("TODO: 'aggregate_for_map' not implemented")
  return []
}
