// These are all the stores and routes for all the applets in the douma world
const applets = {
  meta: require('apps/meta/index'),
  irs_record_point: require('apps/irs_record_point/index'),
  irs_monitor: require('apps/irs_monitor/index'),
  irs_plan: require('apps/irs_plan/index'),
}

export function get_instance_stores_and_routes(instance_applet_ids) {
  let stores_and_routes = {stores: {}, routes: []}

  instance_applet_ids.forEach(id => {
    if (applets[id]) {
      stores_and_routes.stores[id] = applets[id].store
      stores_and_routes.routes.push(applets[id].routes) 
    }
  })
  return stores_and_routes
}

