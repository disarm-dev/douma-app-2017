import {merge} from 'lodash'
import geobuf from "geobuf";
import Pbf from "pbf";


import {request_handler} from 'lib/remote/request-handler.js'
import {get_all_spatial_hierarchy_level_names, get_slug, get_data_version} from 'lib/instance_data/spatial_hierarchy_helper'
import {save_geodata_to_idb} from 'lib/models/geodata/local.geodata_store'

/**
 * Simple string-interpolation to generate a URL
 * @param slug
 * @param level_name
 * @returns {string}
 */
function geodata_url_for(level_name) {
  const slug = get_slug()
  return `/static/instances/${slug}/spatial_hierarchy/${slug}.${level_name}.pbf`
}

function get_geodata_for(level_name, update_progress) {
  const {url} = _get_geodata_for(level_name, update_progress)

  return fetch(url).then((response) => {

    if (!response.ok) {
      return console.log('error')
    }

    return response.blob().then(blob => {
      var reader = new FileReader()
      return new Promise(resolve => {
        reader.addEventListener("loadend", () => {
          var pbf = new Pbf( reader.result )
          return resolve(geobuf.decode(pbf))
        })
        reader.readAsArrayBuffer(blob)
      })
    })
  })

}

function _get_geodata_for(level_name, update_progress) {
  const data_version = get_data_version()

  const url = geodata_url_for(level_name)

  return {
    url,
    timeout: 300000,
    params: {
      data_version
    },
    data: {
      level_name
    },
    onDownloadProgress: (progress_event) => {
      const extended_progress_event = merge(progress_event, {level_name})
      return update_progress(extended_progress_event)
    }
  }
}

function store_geodata({level_name, level_geodata}) {
  return save_geodata_to_idb({level_name, level_geodata})
}

/**
 * retrieve from remote and store on IndexedDB
 * @param level_name
 */
export function get_and_store_locally_geodata_for(level_name, update_progress) {
  return get_geodata_for(level_name, update_progress)
    .then((level_geodata) => {
      return store_geodata({level_name, level_geodata})
    })
}

export function get_and_set_all_geodata() {
  const levels = get_all_spatial_hierarchy_level_names()

  const promises = levels.map(get_and_set_all_geodata)

  return Promise.all(promises)
}
