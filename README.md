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

# Notes

## How to update map

1. Click entity on map => setActiveEntity in $store
2. Select entity from list => setActiveEntity in $store
3. Watch activeEntity from map, onchange => find geojson layer (layerId), re-render
4. On view form => clone activeEntity
5. On form submit => updateActiveEntity (list reactive, map will re-render)
