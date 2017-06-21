//
// SERVICE WORKER
//

export default (DOUMA) => {
  if (!DOUMA_PRODUCTION_MODE) return console.warn("DOUMA ServiceWorker disabled in development")

  if (DOUMA_PRODUCTION_MODE && 'serviceWorker' in navigator) {
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
                DOUMA.$store.commit("root:set_snackbar", {message: "DiSARM can now go offline. You can now go offline and use 'IRS Record'"})
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
}
