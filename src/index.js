import Vue from 'vue'
import VueRouter from 'vue-router'
import { sync } from 'vuex-router-sync'
import './fonts/Roboto.css'
import './fonts/MaterialIcons.css'

import configure from './config'
import App from './components/App.vue'
import router from './router'
import store from './store'

configure()

sync(store, router)

let DOUMA = Vue.component('app', App)
const handleTheme = (route) => {
  if (route.name.indexOf('foci') >= 0) {
    DOUMA.theme = 'cyan'
  } else if (route.name.indexOf('irs') >= 0) {
    DOUMA.theme = 'indigo'
  } else if (route.name.indexOf('cases') >= 0) {
    DOUMA.theme = 'teal'
  } else {
    DOUMA.theme = 'default'
  }
}

DOUMA = new DOUMA({router, store}).$mount('#app')

handleTheme(router.currentRoute)

router.afterEach((route) => {
  handleTheme(route)
})

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js').then(function(reg) {

    reg.onupdatefound = function() {
      var installingWorker = reg.installing;
      installingWorker.onstatechange = function() {
        switch (installingWorker.state) {
          case 'installed':
            if (navigator.serviceWorker.controller) {
              // At this point, the old content will have been purged and the fresh content will
              // have been added to the cache.
              // It's the perfect time to display a "New content is available; please refresh."
              // message in the page's interface.
              console.log('New or updated content is available.');
              DOUMA.sw = {title: 'Update available', message: "An update is available, please refresh"}
            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a "Content is cached for offline use." message.
              console.log('Content is now available offline!');
              DOUMA.sw = {title: 'Available offline', message: "Content is available offline"}
            }
            break;

          case 'redundant':
            console.error('The installing service worker became redundant.');
            break;
        }
      };
    };
  }).catch(function(e) {
    console.error('Error during service worker registration:', e);
  });

  window.addEventListener('beforeinstallprompt', function(e) {
    // beforeinstallprompt Event fired

    // e.userChoice will return a Promise.
    // For more details read: https://developers.google.com/web/fundamentals/getting-started/primers/promises
    e.userChoice.then(function(choiceResult) {

      console.log(choiceResult.outcome);

      if(choiceResult.outcome == 'dismissed') {
        console.log('User cancelled home screen install');
      }
      else {
        console.log('User added to home screen');
      }
    });
  });
}