function retrieve_docs_from_remote_server_and_store_in_local_db() {
  // make remote request and handle errors
  // save_docs_retrieved_from_remote_db_to_local_db(docs)
}

function create_new_doc_on_remote_server() {
  // POST to remote and handle errors
  // save_docs_retrieved_from_remote_db_to_local_db(doc) --> or multiple?
}

function save_docs_retrieved_from_remote_db_to_local_db(docs) {
  // save to Dexie
}

function load_docs_from_local_db_into_frozen_object_in_vue_store() { // used for rehydrating?
  // grab out of Dexie
}
