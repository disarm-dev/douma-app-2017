Stuff the server can serve 
Done by R + plumber?



GET /clusters - return all Clusters, without Tasks
GET /clusters/search - return Clusters which match search object [use an existing, standardised structure, e.g. Kinto or Mongo syntax]
GET /clusters/:id - return single Cluster

? PUT/POST /clusters/:id - create/update new Cluster (might not be done in our API, but the clusterer app will be doing this.)

GET /clusters/:id/tasks - return all Tasks for given Cluster (might have to use URL paramters to work with plumber)


