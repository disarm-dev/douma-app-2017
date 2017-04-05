// 
// SERVICE WORKER
// 

export default (DOUMA) => {
  const getParameterByName = (name) => {
    const url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  let DISABLE_SW = getParameterByName('sw') === 'false'

  // DOUMA_DEV_MODE is `process.env.NODE_ENV !== 'production'` (set in webpack.config.js)
  // DISABLE_SW is true if the query string 'sw=false' is present in the URL
  if ('serviceWorker' in navigator && !DOUMA_DEV_MODE && !DISABLE_SW) {
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
                DOUMA.$store.commit("root:set_sw_message", {title: 'DiSARM has updated', message: "Please refresh browser to start using the newer version."})
              } else {
                // At this point, everything has been precached.
                // It's the perfect time to display a "Content is cached for offline use." message.
                DOUMA.$store.commit("root:set_sw_message", {title: 'DiSARM can now go offline', message: "You can now go offline and use 'IRS Record'"})
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
  } else {
    console.warn("DOUMA ServiceWorker disabled by development flags")
  }
}
