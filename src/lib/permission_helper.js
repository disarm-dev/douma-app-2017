/**
 * Checks if next applet is included in user's applets with 'read' permission
 * @param user
 * @param applet_name
 */
export const has_permission = ({user, applet_name}) => {
  if (['meta'].includes(applet_name)) return true

  return user.allowed_apps.read.includes(applet_name)
}
