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
  let instance

  const subdomain = document.domain.split('.')[0]
  const instance_hash = get_hash_value('instance')

  if (subdomain !== 'localhost'){
    instance = subdomain
  } else if (subdomain === 'localhost' && instance_hash !== null) {
    instance = instance_hash
  } else {
    const msg = `You might be looking for an application which does not exist. Cannot find instance id in subdomain or hash ('#instance=xxx'). `
    alert(msg)
    throw new Error(msg)
  }



  return instance
}

export {route_table, get_hash_value, determine_instance}
