const staticCacheName = 'site-static-v11';
const dynamicCacheName = 'site-dynamic-v13';
const assets = [
  '/',
  '/index.html',
  '/assets/js/app.js',
  '/assets/js/ui.js',
  '/assets/css/style.css',
  '/img/icons/icon-72x72.png',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  '/404.html',
  'https://netdna.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/6.11.1/sweetalert2.all.min.js',
  '/assets/js/jquery.ajaxchimp.min.js',
  '/assets/js/functions.js',
  '/assets/js/plugins.js',
  '/assets/js/modernizr-2.8.0.min.js',
  '/assets/js/jquery-2.1.0.min.js'
];

// cache size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

// install event
self.addEventListener('install', evt => {
  //console.log('service worker installed');
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log('caching shell assets');
      cache.addAll(assets);
    })
  );
});

// activate event
self.addEventListener('activate', evt => {
  // console.log('service worker activated');
  evt.waitUntil(
    caches.keys().then(keys => {
      //console.log(keys);
      return Promise.all(keys
        .filter(key => key !== staticCacheName && key !== dynamicCacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});

// // fetch events
self.addEventListener('fetch', evt => {
  // if (evt.request.url.indexOf('firestore.googleapis.com') === -1) {
  //   evt.respondWith(
  //     caches.match(evt.request).then(cacheRes => {
  //       return cacheRes || fetch(evt.request).then(fetchRes => {
  //         return caches.open(dynamicCacheName).then(cache => {
  //           cache.put(evt.request.url, fetchRes.clone());
  //           // check cached items size
  //           limitCacheSize(dynamicCacheName, 15);
  //           return fetchRes;
  //         })
  //       });
  //     }).catch(() => {
  //       if (evt.request.url.indexOf('.html') > -1) {
  //         return caches.match('/pages/fallback.html');
  //       }
  //     })
  //   );
  // }
});

