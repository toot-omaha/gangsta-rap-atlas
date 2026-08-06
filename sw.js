// GANGSTA RAP ATLAS — 最小構成のService Worker。
// 目的は「PWAとしてインストール可能にする」ことだけで、本格的なオフライン対応はしない
// (Supabase/iTunes/地図タイルなど生きたデータに依存するサイトのため、キャッシュを
// 積極的に返すと古いデータを見せてしまう恐れがある)。
// アプリの殻(HTML/CSS/JS)だけキャッシュし、それ以外は素通しでネットワークに任せる。
const CACHE = 'gra-shell-v2';
const SHELL = ['./', 'index.html', 'style.css', 'app.js', 'manifest.json'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  // 同一オリジンの殻ファイルはネットワーク優先(成功したらキャッシュを更新)。
  // キャッシュ優先だとデプロイ後も古いHTML/JSを配り続けてしまうため、
  // キャッシュはオフライン時のフォールバックとしてだけ使う。
  // それ以外(API・外部リソース)は通常通りネットワークへ。
  if (url.origin === self.location.origin && SHELL.some((f) => url.pathname.endsWith(f.replace('./', '')))) {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(e.request))
    );
  }
});
