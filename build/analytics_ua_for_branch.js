const production_ua = 'UA-88844641-2'
const staging_ua = 'UA-88844641-3'

module.exports = (gitRevisionPlugin) => {
  const branch = JSON.stringify(gitRevisionPlugin.branch())
  if (branch === 'master') {
    return production_ua
  } else {
    return staging_ua
  }
}
