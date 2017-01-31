// Vue
import Vue from 'vue'
import VueRouter from 'vue-router'

// Material CSS
import './fonts/Roboto.css'
import './fonts/MaterialIcons.css'

// Configuration and setup
import configureThemes from './config/theme'
import Douma from './components/Douma.vue'
import {createRouter} from './router'
import store from './store'

// Keep track of what version we're working on
console.info('DOUMA version: ' + COMMIT_HASH)

// Create some very useful and simple global storage, especially for Maps
// TODO: @refac Replace `douma.data` global with something else. Another global of some kind?
window.douma = {
    data: {
      irs_progress: {
        entities: [],
        entitiesLayer: null,

        // Leaflet Map
        leMap: null,
        userCoordsMarker: null,
      }
    }
}

// Create a bunch of themes matching the routes
configureThemes()

// Make DOUMA App
const InitialiseDOUMA = Vue.component('douma', Douma)
const router = createRouter()
const DOUMA = new InitialiseDOUMA({
  router, store
}).$mount('#douma')

// Setup global listeners for network state (online/offline)
// TODO: @refac Do we need to listen to online status, and if so, where do we want to do it?
// DOUMA.$store.commit('meta:setOnline', navigator.onLine)
// window.addEventListener("offline", e => DOUMA.$store.commit('meta:setOnline', false));
// window.addEventListener("online", e => DOUMA.$store.commit('meta:setOnline', true));


// 
// SERVICE WORKER
// 

function getParameterByName(name, url) {
  if (!url) {
    url = window.location.href;
  }
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

let res = getParameterByName('sw');
let disableSW = res === 'false'

// TODO: @refac Need to be clearer about the logic for activating SW below!
if ('serviceWorker' in navigator && !DOUMA_DEV_MODE && !disableSW) {
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
