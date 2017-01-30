# DOUMA

DiSARM Offline Universal Multi-device Application

> "If your app isn’t a steak knife, it should be."

## Development

``` bash
npm run dev
```


## Deployment

Uses [surge.sh](http://surge.sh).

``` bash
# Build it
npm run build 

# Create service worker
npm run service-worker 

# Deploy to surge
npm run deploy 
```

## Service Worker

Disable the service worker in production by appending `?sw=false` to the url.