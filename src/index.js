// CSS
import './fonts/Roboto.css'
import './fonts/MaterialIcons.css'
import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import 'lib/bootstrap-extract.css'
import 'vue-material/dist/vue-material.css'
import 'vue-multiselect/dist/vue-multiselect.min.css'


// Imports
import {get_instance_config} from 'config/load_instance_config.js'
import {configure_error_tracking, set_raven_user_context} from 'config/error_tracking.js'
import {add_network_status_watcher} from 'lib/helpers/network_status.js'
import {create_and_launch_application} from 'config/application.js'
import pubsubcache from 'lib/helpers/pubsubcache'
import {need_to_update} from 'lib/remote/remote.update'
import {configure_service_worker} from './config/service_worker_client'

// Configure service_worker
configure_service_worker()

// configure_error_tracking!!
configure_error_tracking()

// Get instance_config and launch!
get_instance_config()
  .then(instance_config => {
    const douma_app = create_and_launch_application(instance_config)

    // Configure application update
    need_to_update().then((can_update) => {
      const update_available = (can_update.status === 'CAN_UPDATE')

      pubsubcache.subscribe('service_worker/onstatechange', (topic, args) => {

        const new_service_worker_activated = (args === 'activated')
        if (update_available && new_service_worker_activated) {
          console.log("commit('root:set_sw_update_available', true)")
          douma_app.$store.commit('root:set_sw_update_available', true)
        } else {
          console.log("commit('root:set_sw_update_available', false)")
          douma_app.$store.commit('root:set_sw_update_available', false)
        }

        console.log('service_worker/onstatechange message:', args)
      })
    })


    // Add extra info to error logging
    set_raven_user_context(douma_app.$store.state)

    // Configure on/offline watcher
    add_network_status_watcher(douma_app)

    // Keep track of what version we're working on, in production at least.
    if (DOUMA_PRODUCTION_MODE) console.info('🚀 Launched DiSARM version ' + VERSION_COMMIT_HASH_SHORT)
  })
  .catch(err => console.error(err))

