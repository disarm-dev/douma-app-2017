
const selected_clusters = (all_clusters, all_selected_area_ids) => {
  console.log('all_selected_area_ids', all_selected_area_ids.length)
  return all_clusters.filter(cluster => {
    return  all_selected_area_ids.includes(cluster.properties.area_id)
  })
}


export default selected_clusters