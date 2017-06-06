// router-helper.js

// Mainly for debugging help
// Pass an instantiated $router object
// Log out a table of all possible route URLs

function route_table(router) {
  if (!router.hasOwnProperty('options')) throw "Sure you passed a $router object? No `options` property found"
  const routes = router.options.routes
  let output = []

  function get_routes(routes, path_prefix = '') {
    for (var i = routes.length - 1; i >= 0; i--) {
      const route = routes[i]
      const path = `${path_prefix}${route.path}`

      if (path !== '*') {
        output.push(path)
      }

      if(route.hasOwnProperty('children')) {
        get_routes(route.children, `${path}/`)
      }
    }
  }

  get_routes(routes)

  return output.reverse()
}

function get_hash_value(key) {
  var matches = location.hash.match(new RegExp(key+'=([^&]*)'));
  return matches ? matches[1] : null;
}

function determine_instance() {
  let instance = null

  const subdomain = document.domain.split('.')[0]
  const instance_hash = get_hash_value('instance')

  if (instance_hash) {
    instance = instance_hash
  } else if (subdomain) {
    instance = subdomain
  } else {
    const msg = `You might be looking for an application which does not exist. Cannot find instance id in subdomain or hash ('#instance=xxx'). `
    alert(msg)
    throw new Error(msg)
  }

  return instance
}

 function get_instance_config () {
  const instance = determine_instance()

  return fetch(`/static/instances/${instance}.instance.json`) // TODO: @refac Move this instance configuration from `static` to somewhere better
    .then(res => {
      if (res.status === 404) {
        const msg = `You might be looking for an application which does not exist. Cannot find application configuration file for subdomain "${instance}". `
        alert(msg)
        return new Error(msg)
      }
      return res.json()
    })
}


export {route_table, get_instance_config}
