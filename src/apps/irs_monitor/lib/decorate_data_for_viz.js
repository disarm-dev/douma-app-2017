// find the correct aggregations for the chart
import {has} from 'lodash'
import flow from 'lodash/fp/flow'
import map from 'lodash/fp/map'
import compact from 'lodash/fp/compact'
import {featureCollection} from '@turf/helpers'

import cache from 'config/cache'
import {aggregate_on} from 'lib/models/response/aggregations/aggregator'
import {get_planning_level_name} from 'lib/instance_data/spatial_hierarchy_helper'

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
export function decorate_for_pie({binned_responses, targets, aggregations, options}) {
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

export function decorate_for_table({binned_responses, targets, aggregations, options}){

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

/**
 *
 * @param binned_responses
 * @param targets
 * @param {string[]} options.aggregations - list of aggregation_names to use to calculate aggregations
 * @param {object[]} aggregations - array of Aggregations
 * @returns {{}}
 */
export function decorate_for_map({binned_responses, targets, aggregations, options}) {
  const selected_geodata_level_fc = cache.geodata[options.spatial_aggregation_level]

  // collect the aggregations from options.aggregation_names
  const aggregations_for_map = options.aggregation_names.map(string => {
    const found = aggregations.find(aggregation => aggregation.name === string)

    if (!found) console.warn(`Missing aggregation for ${string}`)
    return found
  })
  // calculate all aggregations for responses in each bin
  const binned_aggregations = binned_responses.map(bin => {
    let result = {key: bin.key, values: {}}
    aggregations_for_map.forEach(aggregation => {
      const value = aggregate_on({aggregation: aggregation, responses: bin.values, targets})
      result.values[aggregation.name] = value
    })
    return result
  })

  // create featureCollection, matching geodata with response bins
  let geodata_features


  if (options.limit_to_plan) {
    const target_ids = targets.map(t => t.id)
    geodata_features = selected_geodata_level_fc.features.filter((feature) => {
      return target_ids.includes(feature.properties.__disarm_geo_id)
    })
  } else {
    geodata_features = selected_geodata_level_fc.features
  }

  geodata_features = geodata_features.map((feature) => {
    aggregations_for_map.forEach(aggregation => {
      feature.properties[aggregation.name] = 0
    })
    return feature
  })

  const decorated_features = flow(
    map((feature) => {

      const found_bin = binned_aggregations.find((bin) => {
        return bin.key === feature.properties.__disarm_geo_id
      })

      if (found_bin) {
        feature.properties = {
          ...feature.properties,
          ...found_bin.values
        }
      }

      return feature
    }),
    compact
  )(geodata_features)


  // return a featureCollection
  return featureCollection(decorated_features)
}
