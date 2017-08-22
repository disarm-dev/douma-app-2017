import {nest} from 'd3-collection'
import {ascending} from 'd3-array'
import get from 'lodash.get'
import {aggregate_series_for_chart} from '../../lib/chart_bin_aggregations'

export default function get_data({responses, denominators, aggregations, options}) {
    // from configuration/options
    const defaults = {
      // options also needs 'bin_by' as a field on the response, can be nested
      chart_type: 'bar',
    }

    options = {...defaults, ...options}

    // split/bin into series
    const binned_responses = nest()
      .key(f => get(f, options.bin_by))
      .sortKeys(ascending)
      .entries(responses)

    return aggregate_series_for_chart({binned_responses, options, aggregations, denominators})
  }

