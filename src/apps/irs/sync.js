// Sync logic shared across IRS applets

class IRSSync {
  constructor(demo_instance_id){
    this.demo_instance_id = demo_instance_id
  }

  get_clusters() {
    // Try to read from LocalDB
    // If Clusters, then return Clusters (??and trigger a background refresh)
    // If no Clusters, then trigger a background/foreground refresh
    // When refresh complete, notify user and ask if they want to update
  }

  _notify_user() {

  }

}