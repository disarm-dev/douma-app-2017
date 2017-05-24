
function generate_applet_routes({routes, user, instance_config}) {
  if (!user) return

  // applet_decorations are {icon, title}
  const applet_decorations = routes.map((route) => {

    const instance_route = instance_config.applets[route.name]

    if (typeof instance_route !== 'undefined'){
      if (instance_route.hasOwnProperty('title')) {
        route.meta.title = instance_route.title
      }

      if (instance_route.hasOwnProperty('icon')) {
        route.meta.icon = instance_route.icon
      }
    }
    return {...route.meta, name: route.name}
  })

  const user_apps = arrayUnique([...user.allowed_apps.read, ...user.allowed_apps.write])

  return user_apps.map((app) => {
    return applet_decorations.find((i) => i.name === app)
  }).filter(a => a)
}

export default generate_applet_routes

function arrayUnique(array) {
  var a = array.concat();
  for(var i=0; i<a.length; ++i) {
    for(var j=i+1; j<a.length; ++j) {
      if(a[i] === a[j])
        a.splice(j--, 1);
    }
  }

  return a;
}
