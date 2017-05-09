const prepare_formal_areas = (results, country_area_id) => {

  // Harmonise IDs
  const formal_areas = results.features.map(area => {
    area.properties.area_id = area.properties[country.area_id]
    return area
  })
  return formal_areas
}

export default prepare_formal_areas
