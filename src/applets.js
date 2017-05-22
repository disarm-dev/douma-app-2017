const applets = {
  meta: require('./apps/meta'), 
  irs_record_point: require('./apps/irs_record_point'),
  irs_monitor: require('./apps/irs_monitor'),
  irs_plan: require('./apps/irs_plan'),
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
