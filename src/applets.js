const applets = {
  meta: require('./apps/meta'), 
  irs_record_point: require('./apps/irs_record_point')
}

function register_applets(instance_applet_ids) {
  let output = {stores: {}, routes: {}}

  instance_applet_ids.forEach(id => {
    output.stores[id] = applets[id].store
    output.routes[id] = applets[id].routes
  })

  return output
}

export default register_applets
