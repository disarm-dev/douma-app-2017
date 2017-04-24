/**
 * Find clusters within the selected areas of interest
 * @param all_clusters Array of all the clusters
 * @param all_selected_area_ids Array of area_ids for selected areas of interest
 * @return Array Clusters
 */
function cluster_results(all_clusters, all_selected_area_ids) {
  return all_clusters.filter(cluster => {
    return all_selected_area_ids.includes(cluster.properties.area_id)
  })
}

export default cluster_results