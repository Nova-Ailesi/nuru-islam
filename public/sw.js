// Nur-u İslam - Service Worker for Background Prayer Time Notifications
const CACHE_NAME = 'nur-u-islam-sw-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Handle notification click: focus open window or open prayer guide
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const clickAction = event.action;
  const prayerKey = event.notification.data?.prayerKey;

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Focus existing open window if possible
      for (const client of clientList) {
        if ('focus' in client) {
          client.focus();
          if (prayerKey) {
            client.postMessage({
              type: 'NOTIFICATION_CLICKED',
              action: clickAction,
              prayerKey
            });
          }
          return;
        }
      }
      // If no window open, open the root
      if (self.clients.openWindow) {
        return self.clients.openWindow('/');
      }
    })
  );
});

// Support for background push / sync events
self.addEventListener('push', (event) => {
  if (event.data) {
    try {
      const data = event.data.json();
      const options = {
        body: data.body || 'Namaz vakti yaklaşıyor.',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        vibrate: [200, 100, 200, 100, 300],
        data: data.data || {},
        tag: data.tag || 'prayer-time-alert'
      };
      event.waitUntil(self.registration.showNotification(data.title || 'Namaz Vakti Bildirimi', options));
    } catch {
      // Fallback
    }
  }
});
