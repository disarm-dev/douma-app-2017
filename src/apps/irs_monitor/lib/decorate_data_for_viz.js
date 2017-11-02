// find the correct aggregations for the chart
import {get, has} from 'lodash'
import {aggregate_on} from 'lib/models/response/aggregations/aggregator'
import {decorate_geodata} from "apps/irs_monitor/lib/decorate_geodata"

export function decorate_for_chart({binned_responses, targets, aggregations, options}) {

  // Figure what to do
  if (has(options, 'single_series')) {
    return decorate_single_series({binned_responses, targets, aggregations, options})
  } else if (has(options, 'multi_series')) {
    return decorate_multi_series({binned_responses, targets, aggregations, options})
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
function decorate_single_series({binned_responses, targets, aggregations, options}) {
  const series = {
    aggregation: aggregations.find(a => a.name === options.single_series.aggregation_name)
  }

  let cumulative_value = 0 // Only used for cumulative counts
  let previous_aggregations = {}
  return binned_responses.map(bin => {

    let value = aggregate_on({aggregation: series.aggregation, responses: bin.values, targets, previous_aggregations, options})
    previous_aggregations[series.aggregation.name] = value

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
function decorate_multi_series({binned_responses, targets, aggregations, options}) {
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
    let previous_aggregations = {}
    binned_responses.forEach(bin => {

      let value = aggregate_on({aggregation: series.aggregation, responses: bin.values, targets, previous_aggregations, options})
      previous_aggregations[series.aggregation.name] = value

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
 * @param responses
 * @param options
 * @param aggregations
 * @param targets
 * @return {array} - Array of things for a chart
 */
export function decorate_for_pie({responses, targets, aggregations, options}) {
  const series_for_chart = options.multi_series.map(serie => {
    return {
      aggregation: aggregations.find(a => a.name === serie.aggregation_name),
      colour: serie.colour
    }
  })

  let output = {
    labels: [],
    values: [],
    type: options.chart_type
  }

  let previous_aggregations = {}
  series_for_chart.forEach(({aggregation, colour}) => {

    const value = aggregate_on({aggregation, responses, targets, previous_aggregations, options})
    previous_aggregations[aggregation.name] = value
    output.labels.push(aggregation.name)
    output.values.push(value)
  })

  return [output]
}

export function decorate_for_table({binned_responses, targets, aggregations, options}){
  const static_fields = get(options, 'property_layers', [])
  const aggregation_names = get(options, 'aggregation_names', [])

  const decorated_feature_collection = decorate_geodata({binned_responses, targets, aggregations, options})

  const table_rows = decorated_feature_collection.features.map(f => {
    const row = {}
    for (const field of static_fields) {
      row[field.label] = f.properties[field.property]
    }

    for (const aggregation_name of aggregation_names) {
      row[aggregation_name] = f.properties[aggregation_name]
    }
    return row
  })

  return table_rows
}

export function decorate_for_map({binned_responses, targets, aggregations, options}) {
  return decorate_geodata({binned_responses, targets, aggregations, options})
}

