const prepare_formal_areas = (results, country_code) => {
  const country = COUNTRY_OPTIONS.find(c => c.slug === country_code)

  let formal_areas = results.features

  // TODO @debug DEV ONLY: Make sure all formal_areas have some value we can order them by
  const max = formal_areas.reduce((max, i) => {return i.properties.MeanElev > max ? i.properties.MeanElev : max}, 0)
  const non_zero_elev_formal_areas = formal_areas.map(l => {
    if (l.properties.MeanElev === 0) l.properties.MeanElev = max
    return l
  })

  // Harmonise IDs
  formal_areas = non_zero_elev_formal_areas.map(area => {
    area.properties.formal_area_id = area.properties[country.formal_area_id]
    return area
  })


  return formal_areas
}

export default prepare_formal_areas
