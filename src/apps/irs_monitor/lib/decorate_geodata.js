import cache from "config/cache"
import {aggregate_on} from "lib/models/response/aggregations/aggregator"
import flow from "lodash/fp/flow"
import map from "lodash/fp/map"
import compact from "lodash/fp/compact"
import {featureCollection} from "@turf/helpers"

/**
 *
 * @param binned_responses
 * @param targets
 * @param {string[]} options.aggregations - list of aggregation_names to use to calculate aggregations
 * @param {object[]} aggregations - array of Aggregations
 * @returns {{}}
 */
export function decorate_geodata({binned_responses, targets, aggregations, options}) {
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
  const decorated_features = flow(
    map((feature) => {

      const found_bin = binned_aggregations.find((bin) => {
        return bin.key === String(feature.properties.__disarm_geo_id)
      })

      if (found_bin) {
        feature.properties = {
          ...feature.properties,
          ...found_bin.values
        }
      } else {
        // Decorate the feature with the aggregations and set values to 0

        const empty_aggregations = aggregations_for_map.reduce((acc, aggregation) => {
          acc[aggregation.name] = 0
          return acc
        }, {})

        feature.properties = {
          ...feature.properties,
          ...empty_aggregations
        }
      }

      return feature
    }),
    compact
  )(selected_geodata_level_fc.features)


  // return a featureCollection
  return featureCollection(decorated_features)
}