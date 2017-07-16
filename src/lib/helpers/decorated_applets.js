import CONFIG from 'config/common'

/**
 * Export a `decorated_applets` object on this file, containing title and icon for each
 * @param instance_config
 */
export const decorate_applets = ({user_allowed_applets, instance_applets}) => {
  let decorations = []
  user_allowed_applets.forEach(name => {
    // Ignore 'meta' in here - this is only for decoration, and it's already included in the sidebar
    if (name === 'meta') return
    decorations.push({name, ...title_and_icon_for(name, instance_applets)})
  })

  return decorations
}

function title_and_icon_for (applet_name, instance_applets) {
  if (!applet_name) return {}

  // Find all possible configurations
  const common_config_for_applet = CONFIG.applets[applet_name]
  const instance_config_for_applet = instance_applets[applet_name]

  // Overwrite any common_config title and icon
  const {title, icon} = {...common_config_for_applet, ...instance_config_for_applet}

  return {title, icon}
}

