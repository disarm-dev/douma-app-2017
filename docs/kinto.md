# Take a deep breath

```
curl -X "GET" "https://kinto.dev.mozaws.net/v1/" \
     -u bob:secret
```

Returns something like:

```
  ...
  "project_docs": "https://kinto.readthedocs.io/",
  "http_api_version": "1.14",
  "user": {
    "bucket": "aa3cf1e8-1fa3-2792-0689-9b9516b755a7",
    "id": "basicauth:7841a99958d32d729d89e8f027cdf80b3fd538051e040fbc5f74f49d09fbd257"
  },
  ...
```

Grab the `user.id` piece.

Give the `user.id` the required permissions on the bucket/collection online.

Convert to base64 with `btoa("basicauth:7841a99958d32d729d89e8f027cdf80b3fd538051e040fbc5f74f49d09")`, and send this as the Authentication header from the client.

```
const syncOptions = {
  remote: "https://kinto.dev.mozaws.net/v1",
  headers: {
    Authorization: "Basic " + "Ym9iOnNlY3JldA=="
  },
  bucket: 'disarm'
}
const db = new Kinto(syncOptions)
```