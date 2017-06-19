const applets = {
  meta: require('../apps/meta/index'),
  irs_record_point: require('../apps/irs_record_point/index'),
  irs_monitor: require('../apps/irs_monitor/index'),
  irs_plan: require('../apps/irs_plan/index'),
}

function register_applets(instance_applet_ids) {
  let output = {stores: {}, routes: {}}

  instance_applet_ids.forEach(id => {
    if (applets[id]) {
      output.stores[id] = applets[id].store
      output.routes[id] = applets[id].routes
    }
  })
  return output
}

export default register_applets
