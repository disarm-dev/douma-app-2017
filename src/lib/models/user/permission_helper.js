/**
 * Checks if next applet is included in user's applets with 'read' permission
 * @param user
 * @param applet_name
 */
export const has_permission = ({user, applet_name}) => {
  if (['meta'].includes(applet_name)) return true

  const list_of_applets = user.permissions.map(p => p.replace('write:', '').replace('read:', ''))
  return list_of_applets.includes(applet_name)
}
