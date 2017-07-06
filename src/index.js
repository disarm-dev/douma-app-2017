// CSS
import './fonts/Roboto.css'
import './fonts/MaterialIcons.css'
import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import 'lib/bootstrap-extract.css'
import 'vue-material/dist/vue-material.css'

// Imports
import {get_instance_config} from './lib/instance_config'
import {configure_error_tracking} from 'config/error-tracking.js'
import {configure_service_worker} from 'config/service-worker-client'
import {add_network_status_watcher} from 'lib/network-status.js'
import {create_and_launch_application} from 'config/application.js'

// configure_error_tracking!!
configure_error_tracking()

//
get_instance_config()
  .then(instance_config => {
    const douma_app = create_and_launch_application(instance_config)

    // ServiceWorker
    configure_service_worker(douma_app)

    // Configure on/offline watcher
    add_network_status_watcher(douma_app)

    // Keep track of what version we're working on
    console.info('🚀  Launching DOUMA version: ' + COMMIT_HASH)
  })
  .catch(err => console.error(err))
