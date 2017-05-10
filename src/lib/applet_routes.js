
function generate_applet_routes({routes, user, instance_config}) {
  const applet_decorations = routes.map((route) => {

    const instance_route = instance_config.applets[route.name]
    if (instance_route){
      if (instance_route.hasOwnProperty('title')) {
        route.meta.title = instance_route.title
      }

      if (instance_route.hasOwnProperty('icon')) {
        route.meta.icon = instance_route.icon
      }

    }
    return {...route.meta, name: route.name}
  })

  if (!user) return
  return user.allowed_apps.read.map((app) => { // TODO: @refac Change to use `write` permissions
    return applet_decorations.find((i) => i.name === app)
  })
}

export default generate_applet_routes
