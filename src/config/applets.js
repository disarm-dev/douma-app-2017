import common_config from 'config/common_config'

// These are all the stores and routes for all the applets in the douma world
// const applets = {
//   data_wizard: require('apps/data_wizard/index'),
//   meta: require('apps/meta/index'),
//   irs_record_point: require('apps/irs_record_point/index'),
//   irs_monitor: require('apps/irs_monitor/index'),
//   irs_plan: require('apps/irs_plan/index'),
//   irs_tasker: require('apps/irs_tasker/index'),
// }

const applet_requires = require("dir-loader!../apps")
const applet_names = Object.keys(applet_requires)

let applets = []
applet_names.forEach(applet_name => {
  applets[applet_name] = applet_requires[applet_name].src
})

export const decorated_applets = []

/**
 * Collect stores and routes for applets ONLY in this instance {stores: {}, routes: []}
 * Ignores user permissions
 * @param instance_config
 * @returns {{stores: {}, routes: Array}}
 */
export function get_instance_stores_and_routes(instance_config) {
  let stores_and_routes = {stores: {}, routes: []}

  // Get list of applets in instance, e.g. ['irs_monitor', 'irs_plan', ...]
  const instance_applet_names = Object.keys(instance_config.applets)

  instance_applet_names.forEach(name => {
    if (applets[name]) {
      stores_and_routes.stores[name] = applets[name].store
      stores_and_routes.routes.push(applets[name].routes)
    }
  })

  // This is kind-of piggy-backing in here, but it's an ok place for a piggy-back
  decorate_applets(instance_config)

  return stores_and_routes
}


/**
 * Export a `decorated_applets` object on this file, containing title and icon for each
 * @param instance_config
 */
function decorate_applets(instance_config) {
  const instance_applet_names = Object.keys(instance_config.applets)

  instance_applet_names.forEach(name => {
    // Ignore 'meta' in here - this is only for decoration, and it's already included in the sidebar
    if (name === 'meta') return
    decorated_applets.push({name, ...title_and_icon_for(name, instance_config)})
  })
}

function title_and_icon_for (applet_name, instance_config) {
  if (!applet_name) return {}

  // Find all possible configurations
  const common_config_for_applet = common_config.applets[applet_name]
  const instance_config_for_applet = instance_config.applets[applet_name]

  // Overwrite any common_config title and icon
  const {title, icon} = {...common_config_for_applet, ...instance_config_for_applet}

  return {title, icon}
}
