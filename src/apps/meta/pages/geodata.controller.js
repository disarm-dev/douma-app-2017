import cache from 'config/cache'
import {geodata_url_for} from 'lib/remote/remote.geodata'

export function get_geodata_for(level, slug) {
  return new Promise((resolve, reject) => {
    const url = geodata_url_for(slug, level)
    fetch(url)
      .then(res => res.json())
      .then((geodata) => {
        console.log(geodata)
        cache.geodata[level] = geodata
        resolve()
      })
  })
}