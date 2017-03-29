import country_options from '../config/countries.json'

const prepare_formal_areas = (results, country_code) => {
  const country = country_options.find(c => c.slug === country_code)

  // Harmonise IDs
  const formal_areas = results.features.map(area => {
    area.properties.area_id = area.properties[country.area_id]
    return area
  })
  return formal_areas
}

export default prepare_formal_areas
