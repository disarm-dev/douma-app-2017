// Vue
import Vue from 'vue'
import VueRouter from 'vue-router'

// Material CSS
import './fonts/Roboto.css'
import './fonts/MaterialIcons.css'

// Configuration and setup
import configureThemes from './config/theme'
import App from './components/App.vue'
import getRouter from './router'
import store from './store'

// Keep track of what version we're working on
console.info('DOUMA version: ' + COMMIT_HASH)

// Create some very useful and simple global storage
window.douma = {
    data: {
      irs: {
        leMap: null,
        entities: [],
        entitiesLayer: null
      }
    }
  } // TODO: @refac Don't use this global

// Make a `router` for the `store`
let router = getRouter(store)

// Create a bunch of themes matching the routes
configureThemes()

// Make DOUMA App
const InitialiseDOUMA = Vue.component('app', App)
const DOUMA = new InitialiseDOUMA({router, store}).$mount('#app')

// Setup global listeners for network state (online/offline)
// TODO: @refac Do we need to listen to online status, and if so, where do we want to do it?
DOUMA.$store.commit('meta:setOnline', navigator.onLine)
window.addEventListener("offline", e => DOUMA.$store.commit('meta:setOnline', false));
window.addEventListener("online", e => DOUMA.$store.commit('meta:setOnline', true));


// 
// SERVICE WORKER
// 

if ('serviceWorker' in navigator && !DOUMA_DEV_MODE) {
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
            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a "Content is cached for offline use." message.
              console.log('Content is now available offline!');
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
