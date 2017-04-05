function download_filename(cluster_collection_id){
  return `clusters-${cluster_collection_id}.zip`
}

function download_url(cluster_collection_id){
  return DOUMA_API_URL + '/clusters/shapefile?cluster_collection_id=' + cluster_collection_id
}


export {download_filename, download_url}