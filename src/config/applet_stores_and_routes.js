
// const applet_requires = require("dir-loader!../apps")
const applet_requires = {
  data_wizard: require('apps/data_wizard'),
  meta: require('apps/meta'),
  irs_monitor: require('apps/irs_monitor'),
  irs_plan: require('apps/irs_plan'),
  irs_record_point: require('apps/irs_record_point'),
  irs_tasker: require('apps/irs_tasker')
}


/**
 * Collect stores and routes for applets ONLY in this instance {stores: {}, routes: []}
 * Ignores user permissions
 * @param instance_config
 * @returns {{stores: {}, routes: Array}}
 */
export function get_instance_stores_and_routes(instance_config) {
  let stores_and_routes = {stores: {}, routes: []}

  // Require instance_applets
  const applet_names = Object.keys(applet_requires)

  let applets = []

  applet_names.forEach(applet_name => {
    applets[applet_name] = applet_requires[applet_name]
  })


  // Get list of applets in instance, e.g. ['irs_monitor', 'irs_plan', ...]
  const instance_applet_names = Object.keys(instance_config.applets)

  instance_applet_names.forEach(name => {
    if (applets[name]) {
      stores_and_routes.stores[name] = applets[name].store
      stores_and_routes.routes.push(applets[name].routes)
    }
  })

  return stores_and_routes
}
