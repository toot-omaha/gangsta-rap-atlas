/* GANGSTA RAP ATLAS — プロトタイプ
 * ユーザースタンプは localStorage(本番は Supabase 等に差し替え) */

// ---------- 言語(JA/EN) ----------
const I18N = {
  ja: {
    sub: '地図カラ掘ル、地域別ディスコグラフィ',
    intro: '撃チ込メ ─ 地図ヲ クリック',
    releases: 'RELEASES', discs: 'DISCS',
    favs: 'MY FAVS', favSub: 'お気に入りディスク',
    favEmpty: 'まだ空。ディスクの☆を押して集めよう。',
    noMatch: 'この絞り込みに合うリリースはありません。',
    rarity: '発掘度',
    notOn: 'NOT ON<br>STREAMING<br>─ 激レア ─',
    queueAll: '▶ 全曲キューニ入レル',
    qEmptyT: '再生キューハ空', qEmptyA: 'アルバムノ ▶ ヲ押ストキューニ入ル',
    preview: '30秒試聴', noAudio: '試聴音源ナシ(激レア)',
    clear: 'クリア', credit: '試聴・ジャケ写: Apple Music',
  },
  en: {
    sub: 'DIG THE MAP — REGIONAL DISCOGRAPHIES',
    intro: 'SHOOT THE MAP — CLICK A CITY',
    releases: 'RELEASES', discs: 'DISCS',
    favs: 'MY FAVS', favSub: 'Favorite discs',
    favEmpty: 'Empty. Hit ☆ on a disc to collect.',
    noMatch: 'No releases match this filter.',
    rarity: 'DIG LEVEL',
    notOn: 'NOT ON<br>STREAMING<br>─ RARE ─',
    queueAll: '▶ QUEUE ALL TRACKS',
    qEmptyT: 'QUEUE IS EMPTY', qEmptyA: 'Hit ▶ on a disc to queue it',
    preview: '30s preview', noAudio: 'No preview audio (rare!)',
    clear: 'CLEAR', credit: 'Previews & artwork: Apple Music',
  },
};
let lang = localStorage.getItem('gra.lang') || 'ja';
const t = (k) => I18N[lang][k];
const stampName = (s) => (lang === 'ja' ? s.label : s.en.toUpperCase());

// ---------- スタンプの保存 ----------
const STORE_KEY = 'gra.stamps.v1';
const myStamps = JSON.parse(localStorage.getItem(STORE_KEY) || '{}'); // { albumKey: [stampId] }
const saveStamps = () => localStorage.setItem(STORE_KEY, JSON.stringify(myStamps));

const albumKey = (a) => `${a.artist}|${a.title}`;
const trackKey = (a, name) => `${albumKey(a)}#${name}`;

const stampsAt = (key) => myStamps[key] || [];
function toggleStampAt(key, id) {
  const cur = myStamps[key] || (myStamps[key] = []);
  const i = cur.indexOf(id);
  i >= 0 ? cur.splice(i, 1) : cur.push(id);
  saveStamps();
}

// ディスクの表示合計 = レビュー分析の初期値 + 曲単位で押した自分のスタンプの集計
// (収録曲データがない激レア盤だけ、ディスク単位で直接押せるフォールバック)
function stampCount(album, id) {
  const seed = album.stampSeed?.[id] || 0;
  const disc = stampsAt(albumKey(album)).includes(id) ? 1 : 0;
  const tracks = (enrichOf(album)?.tracks || [])
    .filter((t) => stampsAt(trackKey(album, t.name)).includes(id)).length;
  return seed + disc + tracks;
}
const totalStamps = (a) => STAMPS.reduce((n, s) => n + stampCount(a, s.id), 0);
const hasStamp = (a, id) => stampCount(a, id) > 0;

// 発掘度 — スタンプが少ないほど高い(まだ誰も掘っていない)
const MAX_REF = 300;
function rarity(album) {
  const t = totalStamps(album);
  const score = Math.max(0, Math.min(1, 1 - Math.log10(t + 1) / Math.log10(MAX_REF)));
  const n = Math.max(1, Math.round(score * 5));
  return { score, stars: '★'.repeat(n) + '☆'.repeat(5 - n), total: t };
}

// ---------- お気に入り(ディスク単位) ----------
const FAV_KEY = 'gra.favs.v1';
const favs = new Set(JSON.parse(localStorage.getItem(FAV_KEY) || '[]'));
const saveFavs = () => localStorage.setItem(FAV_KEY, JSON.stringify([...favs]));
const updateFavCount = () => { document.getElementById('favCount').textContent = favs.size; };

// ---------- 状態 ----------
let activeFilters = new Set();
let activeRegion = null;
const shotRegions = new Set(); // 一度クリックした土地は弾痕が残る

const albumsOf = (r) =>
  activeFilters.size === 0 ? r.albums : r.albums.filter((a) => [...activeFilters].every((f) => hasStamp(a, f)));

// ---------- 地図 ----------
const map = new maplibregl.Map({
  container: 'map',
  style: {
    version: 8,
    sources: {
      base: {
        type: 'raster',
        tiles: ['https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png'],
        tileSize: 256,
        attribution: '© OpenStreetMap contributors © CARTO',
      },
    },
    layers: [{ id: 'base', type: 'raster', source: 'base' }],
  },
  center: [-97, 38],
  zoom: 3.6,
  attributionControl: { compact: true },
});

// コンテナのサイズ変化(初期レイアウト確定・左上への縮小アニメ)に必ず追従させる。
// これを怠るとキャンバスと実寸がずれ、マーカーが実座標からずれた位置に描画される。
new ResizeObserver(() => map.resize()).observe(document.getElementById('mapWrap'));

const markers = {};
REGIONS.forEach((region) => {
  const el = document.createElement('div');
  el.className = 'marker';
  // 手で押した判子風に、地域ごとに少しだけ傾ける
  const rot = (region.id.split('').reduce((n, c) => n + c.charCodeAt(0), 0) % 13) - 6;
  el.style.setProperty('--rot', `${rot}deg`);
  el.innerHTML = `
    <div class="mk">
      <svg class="grave" viewBox="0 0 24 26" aria-hidden="true">
        <path d="M5 24 V10 a7 7 0 0 1 14 0 V24 Z"/>
        <rect x="2.5" y="23" width="19" height="2.6"/>
      </svg>
      <span class="n"></span>
      <span class="nm">${region.name}</span>
    </div>`;
  el.addEventListener('click', (e) => { e.stopPropagation(); openRegion(region); });
  markers[region.id] = el;
  new maplibregl.Marker({ element: el }).setLngLat([region.lng, region.lat]).addTo(map);
});

function refreshMarkers() {
  REGIONS.forEach((r) => {
    const el = markers[r.id];
    const n = albumsOf(r).length;
    const size = 22 + Math.min(n, 6) * 5;
    el.style.width = el.style.height = `${size}px`;
    el.querySelector('.n').textContent = n || '';
    el.classList.toggle('dimmed', n === 0);
    el.classList.toggle('hit', shotRegions.has(r.id));
    el.title = `${r.name} — ${n}枚`;
  });
}

// ---------- スタンプ絞り込み ----------
const filterBar = document.getElementById('stampFilter');
function buildFilterBar() {
  filterBar.innerHTML = '';
  STAMPS.forEach((s) => {
    const b = document.createElement('button');
    b.className = 'stamp' + (activeFilters.has(s.id) ? ' on' : '');
    b.style.color = s.color;
    b.innerHTML = `<span>${stampName(s)}</span>`;
    b.addEventListener('click', () => {
      activeFilters.has(s.id) ? activeFilters.delete(s.id) : activeFilters.add(s.id);
      b.classList.toggle('on', activeFilters.has(s.id));
      refreshMarkers();
      if (activeRegion) renderList(activeRegion);
    });
    filterBar.appendChild(b);
  });
}
buildFilterBar();

// ---------- 一覧 ----------
const listEl = document.getElementById('list');

// クリック地点に着弾エフェクトを撃ち込む
function fireShot(region) {
  const rect = map.getContainer().getBoundingClientRect();
  const p = map.project([region.lng, region.lat]);
  const s = document.getElementById('shot');
  s.style.left = `${rect.left + p.x}px`;
  s.style.top = `${rect.top + p.y}px`;
  s.classList.remove('fire');
  void s.offsetWidth; // アニメーションを毎回リスタートさせる
  s.classList.add('fire');
  document.body.classList.remove('shake');
  void document.body.offsetWidth;
  document.body.classList.add('shake');
}

function openRegion(region) {
  activeRegion = region;
  shotRegions.add(region.id);
  fireShot(region);
  refreshMarkers();
  renderList(region);
  // 着弾→揺れを見せてから誌面ポップアップ
  setTimeout(() => document.body.classList.add('detail'), 380);
}

function closeList() {
  document.body.classList.remove('detail');
  activeRegion = null;
  refreshMarkers(); // 地図の位置はリセットせずそのまま
}

// ヘッダーの実高さをCSS変数に反映(ポップアップがヘッダーに被らないように)
const topbar = document.getElementById('topbar');
const syncTopbarH = () =>
  document.documentElement.style.setProperty('--topbar-h', `${topbar.offsetHeight}px`);
new ResizeObserver(syncTopbarH).observe(topbar);
syncTopbarH();

// キャンバスの描画停止(タブ非表示・リサイズ等)から復帰した際に必ず再描画する
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) { map.resize(); map.triggerRepaint(); }
});
window.addEventListener('resize', () => map.resize());
window.addEventListener('pageshow', () => { map.resize(); map.triggerRepaint(); });
document.getElementById('mask').addEventListener('click', closeList);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeList(); });

const listHead = (title, sub, cnt) => `
  <div class="list-head">
    <h2>${title}</h2>
    <span class="sub">${sub}</span>
    <span class="cnt">${cnt}</span>
    <button class="close" title="地図へ戻る">✕</button>
  </div>`;

let listView = 'region'; // ディスクページの「◀ 戻る」の行き先
let currentDisc = null;  // 表示中のディスク(言語切替時の再描画用)

function renderList(region) {
  listView = 'region';
  currentDisc = null;
  const list = albumsOf(region).slice().sort((a, b) => a.year - b.year);
  listEl.innerHTML = `
    ${listHead(region.name, region.area, `${list.length} ${t('releases')}`)}
    <div class="grid"></div>`;
  listEl.querySelector('.close').addEventListener('click', closeList);
  const grid = listEl.querySelector('.grid');
  if (!list.length) {
    grid.innerHTML = `<p style="font-size:12px">${t('noMatch')}</p>`;
    return;
  }
  list.forEach((a) => grid.appendChild(albumCard(a)));
}

// iTunes Search API 由来の付加情報(ジャケ写・試聴・Apple Musicリンク)
const enrichOf = (a) => (typeof ENRICH !== 'undefined' && ENRICH[albumKey(a)]) || null;
const artUrl = (e, size) => e?.art ? e.art.replace('100x100bb', `${size}x${size}bb`) : null;

function albumCard(album) {
  const card = document.createElement('div');
  card.className = 'album';
  const r = rarity(album);
  const e = enrichOf(album);
  const art = artUrl(e, 300);
  const artHtml = art
    ? `<div class="album-art has-img"><img src="${art}" alt="${album.title}" loading="lazy"></div>`
    : `<div class="album-art"><span>${t('notOn')}</span></div>`;

  card.innerHTML = `
    <div class="album-head">
      ${artHtml}
      <div class="album-info">
        <p class="t">${album.title}</p>
        <p class="a">${album.artist}</p>
        <p class="m">${album.year} / ${album.label} / ${album.format || 'CD'}</p>
      </div>
      <button class="fav-btn${favs.has(albumKey(album)) ? ' on' : ''}" title="お気に入り">${favs.has(albumKey(album)) ? '★' : '☆'}</button>
      <button class="play-btn" title="このディスクをキューに追加">▶</button>
    </div>
    <div class="rarity">
      <span class="lab">${t('rarity')} ${r.stars}</span>
      <span class="bar"><i style="width:${Math.round(r.score * 100)}%"></i></span>
      <span class="n">STAMP ${r.total}</span>
    </div>
    <div class="album-stamps"></div>`;

  const rerender = () => { card.replaceWith(albumCard(album)); refreshMarkers(); };

  // ディスクのスタンプ = 曲スタンプ+分析初期値の集計(表示のみ。押すのは専用ページで)
  const wrap = card.querySelector('.album-stamps');
  STAMPS.filter((s) => stampCount(album, s.id) > 0)
    .forEach((s) => wrap.appendChild(discChip(album, s, true, null)));

  // カードのどこを押してもディスク専用ページへ(ボタン類は除く)
  card.addEventListener('click', (ev) => {
    if (ev.target.closest('button, a')) return;
    renderDisc(album);
  });

  card.querySelector('.play-btn').addEventListener('click', () => playAlbum(album));
  card.querySelector('.fav-btn').addEventListener('click', () => {
    const k = albumKey(album);
    favs.has(k) ? favs.delete(k) : favs.add(k);
    saveFavs();
    updateFavCount();
    rerender();
  });
  return card;
}

// ---------- ディスク専用ページ(大ジャケ+曲一覧+曲単位スタンプ) ----------
function renderDisc(album) {
  currentDisc = album;
  const e = enrichOf(album);
  const r = rarity(album);
  const region = REGIONS.find((rr) => rr.albums.includes(album));
  const art = artUrl(e, 600);
  const fav = favs.has(albumKey(album));
  const rerender = () => renderDisc(album);
  const tracks = e?.tracks || [];

  listEl.innerHTML = `
    <div class="list-head">
      <button class="close back" title="一覧へ戻る">◀</button>
      <h2>${album.title}</h2>
      <span class="sub">${album.artist}${region ? ` / ${region.name}` : ''}</span>
      <span class="cnt">${album.year}</span>
      <button class="close x" title="地図へ戻る">✕</button>
    </div>
    <div class="disc">
      <div class="disc-art">${art
        ? `<img src="${art}" alt="${album.title}">`
        : `<span>${t('notOn')}</span>`}</div>
      <div class="disc-side">
        <p class="m">${album.year} / ${album.label} / ${album.format || 'CD'}${
          e?.link ? ` / <a class="apple" href="${e.link}" target="_blank" rel="noopener">Apple Music ↗</a>` : ''}</p>
        <div class="disc-actions">
          <button class="tr-toggle fav-d">${fav ? '★' : '☆'} FAV</button>
          <button class="tr-toggle play-d">${t('queueAll')}</button>
        </div>
        <div class="rarity">
          <span class="lab">${t('rarity')} ${r.stars}</span>
          <span class="bar"><i style="width:${Math.round(r.score * 100)}%"></i></span>
          <span class="n">STAMP ${r.total}</span>
        </div>
        <div class="album-stamps"></div>
      </div>
    </div>
    <div class="tracks"></div>`;

  // ◀ も ✕ も「元のディスク一覧」へ戻る(地図まで一気に閉じない)
  const backToList = () =>
    listView === 'favs' ? renderFavs() : renderList(activeRegion || region);
  listEl.querySelector('.back').addEventListener('click', backToList);
  listEl.querySelector('.x').addEventListener('click', backToList);

  const wrap = listEl.querySelector('.album-stamps');
  if (tracks.length) {
    // スタンプは曲側で押す(ここは集計表示)
    STAMPS.filter((s) => stampCount(album, s.id) > 0)
      .forEach((s) => wrap.appendChild(discChip(album, s, true, null)));
  } else {
    // 曲データのない激レア盤はディスクに直接押せる
    STAMPS.forEach((s) => wrap.appendChild(discChip(album, s, false, rerender)));
  }

  listEl.querySelector('.play-d').addEventListener('click', () => playAlbum(album));
  listEl.querySelector('.fav-d').addEventListener('click', () => {
    const k = albumKey(album);
    favs.has(k) ? favs.delete(k) : favs.add(k);
    saveFavs();
    updateFavCount();
    rerender();
  });

  const tracksEl = listEl.querySelector('.tracks');
  tracks.forEach((t, i) => tracksEl.appendChild(trackRow(album, t, i, rerender)));
}

// ---------- お気に入りリスト表示 ----------
function renderFavs() {
  listView = 'favs';
  currentDisc = null;
  document.body.classList.add('detail');
  activeRegion = null;
  refreshMarkers();
  const items = [];
  REGIONS.forEach((r) => r.albums.forEach((a) => { if (favs.has(albumKey(a))) items.push({ a, r }); }));
  listEl.innerHTML = `
    ${listHead(t('favs'), t('favSub'), `${items.length} ${t('discs')}`)}
    <div class="grid"></div>`;
  listEl.querySelector('.close').addEventListener('click', closeList);
  const grid = listEl.querySelector('.grid');
  if (!items.length) {
    grid.innerHTML = `<p style="font-size:12px">${t('favEmpty')}</p>`;
    return;
  }
  items.forEach(({ a, r }) => {
    const c = albumCard(a);
    c.querySelector('.album-info .m').insertAdjacentHTML('beforeend', ` / <b>${r.name}</b>`);
    grid.appendChild(c);
  });
}
document.getElementById('favBtn').addEventListener('click', renderFavs);
updateFavCount();

// 墓石メニュー(狭い画面): スタンプ絞り込みの開閉
document.getElementById('stampMenuBtn').addEventListener('click', () => {
  document.body.classList.toggle('stamps-open');
});

// ディスクのチップ。曲データがある盤では集計表示(押すのは曲側)、ない盤ではトグル可
function discChip(album, s, readonly, rerender) {
  const key = albumKey(album);
  const b = document.createElement('button');
  b.className = 'stamp' + (stampsAt(key).includes(s.id) ? ' mine' : '') + (readonly ? ' agg' : '');
  b.style.color = s.color;
  b.innerHTML = `<span>${stampName(s)}</span><span class="count">${stampCount(album, s.id)}</span>`;
  if (!readonly) b.addEventListener('click', () => { toggleStampAt(key, s.id); rerender(); });
  return b;
}

function trackRow(album, track, idx, rerender) {
  const key = trackKey(album, track.name);
  const row = document.createElement('div');
  row.className = 'track';
  const mine = stampsAt(key);
  row.innerHTML = `
    <button class="tp" title="この曲を再生">▶</button>
    <span class="no">${String(idx + 1).padStart(2, '0')}</span>
    <span class="name">${track.name}</span>
    <span class="mini"></span>
    <button class="add" title="この曲にスタンプ">＋</button>`;

  const mini = row.querySelector('.mini');
  mine.forEach((id) => {
    const s = STAMPS.find((x) => x.id === id);
    if (s) { const m = document.createElement('i'); m.style.background = s.color; m.title = stampName(s); mini.appendChild(m); }
  });

  row.querySelector('.tp').addEventListener('click', () => playAlbum(album, idx));
  row.querySelector('.add').addEventListener('click', () => {
    const picker = document.createElement('div');
    picker.className = 'picker';
    STAMPS.forEach((s) => {
      const b = document.createElement('button');
      b.className = 'stamp' + (mine.includes(s.id) ? ' mine' : '');
      b.style.color = s.color;
      b.innerHTML = `<span>${stampName(s)}</span>`;
      b.addEventListener('click', () => { toggleStampAt(key, s.id); rerender(); });
      picker.appendChild(b);
    });
    row.after(picker);
    row.querySelector('.add').disabled = true;
  });
  return row;
}

// ---------- 再生キュー ----------
// iTunes の30秒試聴(previewUrl)を HTML5 Audio で連続再生する。
// 曲が終わると ended → next() で次の曲へ。アルバム単位でキューに積む。
// ※フル再生に広げるときは YouTube IFrame API / Spotify 埋め込みをここに足す。
let queue = [], cursor = -1;
const audio = new Audio();
audio.addEventListener('ended', () => next());

const $title = document.getElementById('playerTitle');
const $artist = document.getElementById('playerArtist');
const $count = document.getElementById('queueCount');
const $art = document.querySelector('.player-art');
const $play = document.getElementById('playBtn');

// ▶ を押したディスクをその場で再生する(キューは丸ごと差し替え)
// startIndex を渡すとそのディスクの指定曲から始まり、以降も続けて流れる
function playAlbum(album, startIndex = 0) {
  const e = enrichOf(album);
  const art = artUrl(e, 100);
  if (e?.tracks?.length) {
    queue = e.tracks.map((tr) => ({ title: tr.name, artist: album.artist, preview: tr.preview, art }));
    cursor = Math.min(startIndex, queue.length - 1);
  } else {
    queue = [{ title: album.title, artist: album.artist, preview: null, art: null }];
    cursor = 0;
  }
  playCurrent();
}

function playCurrent() {
  const q = queue[cursor];
  if (q?.preview) {
    audio.src = q.preview;
    audio.play().catch(() => {}); // 自動再生ブロック時はユーザーの▶待ち
  } else {
    audio.pause(); audio.removeAttribute('src');
  }
  paint();
}

function paint() {
  const q = queue[cursor];
  $count.textContent = `${queue.length} 曲`;
  $play.textContent = audio.paused ? '▶' : '⏸';
  if (!q) {
    $title.textContent = t('qEmptyT');
    $artist.textContent = t('qEmptyA');
    $art.innerHTML = '♪';
    return;
  }
  $title.textContent = q.title;
  $artist.textContent = q.preview
    ? `${q.artist} — ${cursor + 1}/${queue.length} (${t('preview')})`
    : `${q.artist} — ${t('noAudio')}`;
  $art.innerHTML = q.art ? `<img src="${q.art}" alt="">` : '♪';
}

function next() { if (cursor < queue.length - 1) { cursor++; playCurrent(); } else paint(); }
function prev() { if (cursor > 0) { cursor--; playCurrent(); } }

audio.addEventListener('play', paint);
audio.addEventListener('pause', paint);
document.getElementById('nextBtn').addEventListener('click', next);
document.getElementById('prevBtn').addEventListener('click', prev);
$play.addEventListener('click', () => {
  if (!queue[cursor]?.preview) return;
  audio.paused ? audio.play().catch(() => {}) : audio.pause();
});
document.getElementById('clearQueue').addEventListener('click', () => {
  queue = []; cursor = -1;
  audio.pause(); audio.removeAttribute('src');
  paint();
});

// ピンをズームへ忠実に追従させる。
// 'zoom' はアニメーション中も毎フレーム発火するので、そこでスケールを更新する。
const BASE_ZOOM = 3.6;
function syncMarkerScale() {
  const z = map.getZoom();
  const s = Math.max(0.6, Math.min(2.1, Math.pow(2, (z - BASE_ZOOM) * 0.45)));
  Object.values(markers).forEach((el) => el.style.setProperty('--s', s.toFixed(3)));
  document.body.classList.toggle('zoomed-in', z >= 4.6);
}
map.on('zoom', syncMarkerScale);
syncMarkerScale();

// ---------- 言語切り替え ----------
function applyLang() {
  document.documentElement.lang = lang;
  document.querySelector('.brand p').textContent = t('sub');
  document.querySelector('.intro p').textContent = t('intro');
  document.getElementById('clearQueue').textContent = t('clear');
  document.querySelector('.player-queue .credit').textContent = t('credit');
  document.getElementById('langBtn').textContent = lang === 'ja' ? 'EN' : 'JA';
  buildFilterBar();
  paint();
  // 開いている画面を同じ状態のまま描き直す
  if (document.body.classList.contains('detail')) {
    if (currentDisc) renderDisc(currentDisc);
    else if (listView === 'favs') renderFavs();
    else if (activeRegion) renderList(activeRegion);
  }
}
document.getElementById('langBtn').addEventListener('click', () => {
  lang = lang === 'ja' ? 'en' : 'ja';
  localStorage.setItem('gra.lang', lang);
  applyLang();
});
applyLang();

refreshMarkers();
map.on('load', () => { map.resize(); refreshMarkers(); });
