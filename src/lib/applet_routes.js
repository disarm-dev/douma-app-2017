
export default function(routes, user) {
  const applet_decorations = routes.map((route) => {
    return {...route.meta, name: route.name}
  })

  if (!user) return
  return user.allowed_apps.read.map((app) => {
    return applet_decorations.find((i) => i.name === app)
  })
}        
