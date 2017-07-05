/**
 * Checks if next page is included in user's applets with 'read' permission
 * @param user
 * @param page
 */
export const has_permission = ({user, page}) => {
  return user.allowed_apps.read.includes(page)
}
