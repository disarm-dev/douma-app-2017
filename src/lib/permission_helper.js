/**
 * Checks if next applet is included in user's applets with 'read' permission
 * @param user
 * @param applet
 */
export const has_permission = ({user, applet}) => {
  if (applet === 'meta') return true

  return user.allowed_apps.read.includes(applet)
}
