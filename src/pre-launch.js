import {need_to_update} from 'lib/remote/remote.update'

console.timeStamp('pre_launch')

need_to_update().then((can_update) => {
  let message
  switch (can_update) {
    case 'CAN_UPDATE':
      message = "🔺 DiSARM version check: New version available, can/should update"
      // TODO: @important Need very good checks before FORCING a version update outside of ServiceWorker control
      break
    case 'ON_LATEST':
      message = "✅ DiSARM version check: Latest version running"
      break
    default:
      message = "🤷‍ DiSARM version check: No information on new version (network request failed)"

  }
  console.log(message)

  const {launch} = require('./launch')
  launch()
})
