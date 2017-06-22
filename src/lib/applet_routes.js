import array_unique from 'array-unique'
import common_config from 'config/common_config'

function get_authorised_routes({routes, user, instance_config}) {
  if (!user) return

  const decorated_routes = routes.map((route) => {
    route = {...route, ...title_and_icon_for(route.name, instance_config)}
    return route
  })
  
  const user_apps = array_unique([...user.allowed_apps.read, ...user.allowed_apps.write]).sort()

  return user_apps.map((app) => {
    return decorated_routes.find((i) => i.name === app)
  }).filter(a => a)
}

export default get_authorised_routes


function title_and_icon_for (name, instance_config) {
  if (!name) return {}

  const applet_name = name.split(':')[0]
  const instance_config_for_applet = instance_config.applets[applet_name]
  const common_config_for_applet = common_config.applets[applet_name]
  return {meta: {...common_config_for_applet, ...instance_config_for_applet}}
}