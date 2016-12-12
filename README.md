# DOUMA

![OfflineIcon.png](https://bitbucket.org/repo/7qBnaL/images/3197852267-OfflineIcon.png)

> DiSARM Offline Universal Multi-device Application

>> "If your app isn’t a steak knife, it should be."

## Deploying

Uses [surge.sh](http://surge.sh).

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).



```
var a = {
  modules: [
    {
      name: 'meta',
      tasks: [
        {
          name: 'user',
          views: ['login', 'logout']
        },
        {
          name: 'aoi',
          views: ['map_pin']
        },
        {
          name: 'sync',
          views: ['status']
        }
      ]
    },
    {
      name: 'foci',
      tasks: [
        {
          name: 'monitor', // multiple focis
          views: ['map', 'list']
        },
        {
          name: 'identify', // multiple focis
          views: ['map (focis)', 'list']
        },
        {
          name: 'investigate', // individual foci
          views: ['map', 'map_edit', 'detail']
        },
        {
          name: 'classify', // individual foci
          views: ['form', 'detail']
        },
        {
          name: 'respond', // individual foci
          views: ['form', 'detail']
        }
      ]
    },
    {
      name: 'irs', 
      tasks: [
        {}
      ]
    }
  ],
}
```