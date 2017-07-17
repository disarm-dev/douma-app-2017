import cache from 'config/cache'
import {geodata_valid} from 'lib/geodata/geodata.valid'

const decorate_geodata = () => {
  if (!geodata_valid()) {
    throw new Error('Invalid geodata')
  }



}

export {decorate_geodata}
