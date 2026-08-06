/* GANGSTA RAP ATLAS — プロトタイプ
 * ユーザースタンプは localStorage(本番は Supabase 等に差し替え) */

// ---------- 言語(JA/EN) ----------
const I18N = {
  ja: {
    sub: '地図カラ掘ル、地域別ディスコグラフィ',
    intro: '撃チ込メ ─ 地図ヲ クリック',
    releases: 'RELEASES', discs: 'DISCS',
    favs: 'MY FAVS', favSub: 'お気に入りディスク',
    have: '持ッテル', want: 'ホシイ',
    haveSection: '持ッテルディスク', wantSection: 'ホシイディスク',
    exportCsv: '⬇ CSV保存', importCsv: '⬆ CSV読込',
    importOk: (n) => `${n}件反映シタ`, importNone: '一致スルディスクガナカッタ',
    favEmpty: 'まだ空。ディスクの☆を押して集めよう。',
    noMatch: 'この絞り込みに合うリリースはありません。',
    rarity: '発掘度',
    notOn: 'NOT ON<br>STREAMING<br>─ 激レア ─',
    queueAll: '▶ 全曲キューニ入レル',
    qEmptyT: '再生キューハ空', qEmptyA: 'アルバムノ ▶ ヲ押ストキューニ入ル',
    preview: '30秒試聴', noAudio: '試聴音源ナシ(激レア)',
    clear: 'クリア', credit: '試聴・ジャケ写: Apple Music',
    submit: '✚ 投稿', submitTitle: 'タレコミ', submitSub: 'ディスク情報ヲ投稿(承認後ニ掲載)',
    fArtist: 'アーティスト *', fTitle: 'タイトル *', fYear: '年', fLabel: 'レーベル',
    fRegion: '地域(例: Compton)', fFormat: 'フォーマット', fComment: 'コメント・出典など',
    noPii: '⚠ 個人情報(名前・連絡先など)ハ書キ込マナイコト',
    send: '送信スル', sending: '送信中…', sent: '感謝!承認後ニ地図ニ刻マレル。', sendErr: '送信失敗。時間ヲ置イテ再度。',
    needFields: 'アーティストとタイトルは必須です',
    streetName: 'STREET NAME', streetNameHint: 'コレデ他端末ト持ッテル/ホシイヲ同期デキル',
    reroll: '🎲 再生成', linkTitle: '別端末ノSTREET NAMEヲ入力シテ連携',
    linkPlaceholder: '例: SHADOW-REAPER', link: '連携スル',
    syncOk: '同期完了', syncErr: '同期失敗。時間ヲ置イテ再度。', linking: '連携中…',
    linkNotFound: 'STREET NAMEカ連携コードガ違ウ(コードハ発行後10分有効)',
    rerollConfirm: '再生成スルト今ノSTREET NAMEハ無効ニナル(持ッテル/ホシイハ引キ継ガレル)。ヨロシイ？',
    issueCode: '連携コード発行', codeHint: '他端末デ連携スルニハ、元端末デ発行シタコードモ必要(10分有効・1回限リ)',
    codePlaceholder: '連携コード', codeIssued: (c) => `連携コード: ${c} (10分有効)`,
  },
  en: {
    sub: 'DIG THE MAP — REGIONAL DISCOGRAPHIES',
    intro: 'SHOOT THE MAP — CLICK A CITY',
    releases: 'RELEASES', discs: 'DISCS',
    favs: 'MY FAVS', favSub: 'Favorite discs',
    have: 'HAVE', want: 'WANT',
    haveSection: 'Discs I have', wantSection: 'Discs I want',
    exportCsv: '⬇ Export CSV', importCsv: '⬆ Import CSV',
    importOk: (n) => `${n} matched and applied`, importNone: 'No matching discs found',
    favEmpty: 'Empty. Hit ☆ on a disc to collect.',
    noMatch: 'No releases match this filter.',
    rarity: 'DIG LEVEL',
    notOn: 'NOT ON<br>STREAMING<br>─ RARE ─',
    queueAll: '▶ QUEUE ALL TRACKS',
    qEmptyT: 'QUEUE IS EMPTY', qEmptyA: 'Hit ▶ on a disc to queue it',
    preview: '30s preview', noAudio: 'No preview audio (rare!)',
    clear: 'CLEAR', credit: 'Previews & artwork: Apple Music',
    submit: '✚ SUBMIT', submitTitle: 'DROP A DIME', submitSub: 'Submit a disc (published after review)',
    fArtist: 'Artist *', fTitle: 'Title *', fYear: 'Year', fLabel: 'Label',
    fRegion: 'Region (e.g. Compton)', fFormat: 'Format', fComment: 'Comment / source',
    noPii: '⚠ Do not include personal information (names, contacts, etc.)',
    send: 'SEND', sending: 'Sending…', sent: 'Respect! It will be carved on the map after review.', sendErr: 'Failed. Try again later.',
    needFields: 'Artist and Title are required',
    streetName: 'STREET NAME', streetNameHint: 'Use this to sync have/want across devices',
    reroll: '🎲 Reroll', linkTitle: 'Enter another device\'s Street Name to link',
    linkPlaceholder: 'e.g. SHADOW-REAPER', link: 'Link',
    syncOk: 'Synced', syncErr: 'Sync failed. Try again later.', linking: 'Linking…',
    linkNotFound: 'Street Name or link code is wrong (codes last 10 min)',
    rerollConfirm: 'Rerolling retires your current Street Name (have/want carry over). Continue?',
    issueCode: 'Issue link code', codeHint: 'Linking on another device also requires a code issued on this one (valid 10 min, single use)',
    codePlaceholder: 'Link code', codeIssued: (c) => `Link code: ${c} (valid 10 min)`,
  },
};
let lang = localStorage.getItem('gra.lang') || 'ja';
const t = (k) => I18N[lang][k];
const stampName = (s) => (lang === 'ja' ? s.label : s.en.toUpperCase());

// ---------- Supabase(共有データ) ----------
// anonキーは「投稿とスタンプの書き込み+集計の読み取り」しかできない公開用キー
const SB_URL = 'https://xqtoyvhupioztljkejnw.supabase.co/rest/v1';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxdG95dmh1cGlvenRsamtlam53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5Mjc2MDgsImV4cCI6MjEwMTUwMzYwOH0.gW4xkwC3GzdKcnTT-490-75Sssx49wIIBcVOEW-MKHw';
const SB_HEADERS = { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json' };

// 端末ごとの匿名ID(重複スタンプ防止用)
const CLIENT_ID = (() => {
  let v = localStorage.getItem('gra.client');
  if (!v) { v = crypto.randomUUID(); localStorage.setItem('gra.client', v); }
  return v;
})();

// みんなのスタンプ集計 { targetKey: { stampId: n } }
const SHARED = {};

async function loadSharedStamps() {
  try {
    const res = await fetch(`${SB_URL}/stamp_counts?select=target_key,stamp_id,n`, { headers: SB_HEADERS });
    if (!res.ok) return;
    (await res.json()).forEach((r) => { (SHARED[r.target_key] ||= {})[r.stamp_id] = r.n; });
    // 過去にローカルだけに保存したスタンプをサーバーへ移行
    Object.entries(myStamps).forEach(([key, ids]) =>
      ids.forEach((id) => { if (!SHARED[key]?.[id]) bumpShared(key, id); }));
    refreshMarkers();
    if (activeRegion) renderList(activeRegion);
  } catch { /* オフラインでもローカルだけで動く */ }
}

function bumpShared(key, id) {
  (SHARED[key] ||= {})[id] = (SHARED[key]?.[id] || 0) + 1;
  // 素のINSERT。重複はunique制約が409で弾くので無視する
  // (on_conflict方式はSELECT権限が必要になり、生データ公開につながるため使わない)
  fetch(`${SB_URL}/stamps`, {
    method: 'POST',
    headers: { ...SB_HEADERS, Prefer: 'return=minimal' },
    body: JSON.stringify({ client_id: CLIENT_ID, target_key: key, stamp_id: id }),
  }).catch(() => {});
}

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
  if (i >= 0) {
    cur.splice(i, 1); // 取り消しはローカルのみ(共有集計には残る)
  } else {
    cur.push(id);
    bumpShared(key, id); // みんなの集計へ反映
  }
  saveStamps();
}

// ディスクの表示合計 = レビュー実測シード + みんなのスタンプ集計(ディスク+収録曲)
// stampSeed は seedSrc(出典URL群)を持つアルバムのみ有効。
// 出典なしのシードは推定値なのでカウントしない(実測データが揃い次第 seedSrc 付きで再生成される)
function stampCount(album, id) {
  const key = albumKey(album);
  const seed = (album.seedSrc?.length ? album.stampSeed?.[id] : 0) || 0;
  let n = seed + (SHARED[key]?.[id] || 0);
  (enrichOf(album)?.tracks || []).forEach((tr) => { n += SHARED[trackKey(album, tr.name)]?.[id] || 0; });
  // 共有集計に未反映のローカル分(オフライン時)を補完
  if (!SHARED[key]?.[id] && stampsAt(key).includes(id)) n += 1;
  return n;
}
const totalStamps = (a) => STAMPS.reduce((n, s) => n + stampCount(a, s.id), 0);
const hasStamp = (a, id) => stampCount(a, id) > 0;

// 発掘度 — Discogsのコレクション登録数(have)による実測レア度。
// have が少ない盤ほど現物を持っている人が少ない=発掘し甲斐がある。
// have<=10 ≒ ★5 / 100前後 ≒ ★2-3 / 1000超のメジャー盤 ≒ ★1。
// rarity.js 未取得の盤はスタンプ数による旧ロジックへフォールバック。
const MAX_REF = 300;
// Discogs最安値(USD)を円換算し、実際の取引価格帯で発掘度を判定する。
// 円レートは目安(実勢の概算、都度APIは叩かない)。出品が無い盤=市場に出回っていない
// ということなので最高評価とする。
const USD_JPY = 150;
const PRICE_BANDS_JPY = [2000, 5000, 10000, 30000]; // これを超えるごとに★+1、最後を超えたら★5
function rarity(album) {
  const t = totalStamps(album);
  const r = (typeof RARITY !== 'undefined') ? RARITY[albumKey(album)] : null;
  if (r) {
    const priceJpy = r.price > 0 ? r.price * USD_JPY : null;
    let n;
    if (priceJpy == null) {
      // 出品なし。ただしhaveが多い(=よく知られた盤)場合はただの一時的な品切れの
      // 可能性が高いので、have数のログスケールにフォールバックして誤って★5にしない。
      n = r.have <= 15
        ? 5
        : Math.max(1, Math.round((1 - Math.log10(r.have + 1) / Math.log10(500)) * 4) + 1);
    } else {
      n = 1;
      for (const band of PRICE_BANDS_JPY) { if (priceJpy > band) n++; }
    }
    const score = (n - 1) / 4;
    return { score, stars: '★'.repeat(n) + '☆'.repeat(5 - n), total: t, have: r.have, sale: r.sale, price: r.price, priceJpy };
  }
  const score = Math.max(0, Math.min(1, 1 - Math.log10(t + 1) / Math.log10(MAX_REF)));
  const n = Math.max(1, Math.round(score * 5));
  return { score, stars: '★'.repeat(n) + '☆'.repeat(5 - n), total: t };
}

// ---------- お気に入り(ディスク単位) — 持ってる/ほしい の2系統 ----------
const HAVE_KEY = 'gra.favs.have.v1';
const WANT_KEY = 'gra.favs.want.v1';
// 旧・単一★お気に入り(gra.favs.v1)は「持ってる」として引き継ぐ
const legacyFavs = JSON.parse(localStorage.getItem('gra.favs.v1') || 'null');
const favsHave = new Set(legacyFavs || JSON.parse(localStorage.getItem(HAVE_KEY) || '[]'));
const favsWant = new Set(JSON.parse(localStorage.getItem(WANT_KEY) || '[]'));
if (legacyFavs) { localStorage.setItem(HAVE_KEY, JSON.stringify([...favsHave])); localStorage.removeItem('gra.favs.v1'); }

const saveFavs = () => {
  localStorage.setItem(HAVE_KEY, JSON.stringify([...favsHave]));
  localStorage.setItem(WANT_KEY, JSON.stringify([...favsWant]));
};
const toggleFav = (set, key) => { set.has(key) ? set.delete(key) : set.add(key); saveFavs(); pushFavSync(); };
const updateFavCount = () => {
  const all = new Set([...favsHave, ...favsWant]);
  document.getElementById('favCount').textContent = all.size;
};

// ---------- Street Name — 端末間で持ってる/ほしいを同期する匿名合言葉 ----------
// 名前は完全ランダム生成のみ(手入力での新規作成は不可)。個人情報は一切紐づけない。
const STREET_KEY = 'gra.streetName';
let streetName = localStorage.getItem(STREET_KEY) || null;

const SN_ADJ = ['SHADOW', 'CONCRETE', 'MIDNIGHT', 'SMOKE', 'RUSTY', 'COLD', 'IRON', 'SILENT',
  'CRIMSON', 'HOLLOW', 'STREET', 'RAGGED', 'DUSTY', 'BROKEN', 'STONE', 'GOLDEN', 'RUTHLESS',
  'LOW', 'DIRTY', 'HEAVY', 'GHOST', 'GRIMY', 'GUTTER', 'ROLLIN', 'SLICK', 'GRITTY', 'BLACKTOP',
  'CHROME', 'ASPHALT', 'CURBSIDE', 'BACKALLEY', 'DEADEND', 'RAW', 'SAVAGE', 'FROSTBIT', 'GRAVEL'];
const SN_NOUN = ['REAPER', 'HUSTLA', 'PHANTOM', 'OUTLAW', 'RIDER', 'PREACHER', 'SOLDIER', 'VETERAN',
  'RENEGADE', 'DRIFTER', 'GAMBLER', 'GANGSTA', 'KINGPIN', 'SNIPER', 'PROPHET', 'WANDERER',
  'VANDAL', 'ROLLER', 'MENACE', 'STALKER', 'CRUSADER', 'MOBSTER', 'BANDIT', 'WARLORD', 'JUDGE',
  'DEALER', 'LEGEND', 'ASSASSIN', 'SURVIVOR', 'MAVERICK', 'PIRATE', 'SHOOTER', 'HITTA', 'CHIEF'];
const randPick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const genStreetNameCandidate = () => `${randPick(SN_ADJ)}-${randPick(SN_NOUN)}`;

// DBのunique制約が衝突を弾く(重複登録の防止だけが目的。衝突自体は稀で許容)
async function reserveStreetName(name) {
  try {
    const res = await fetch(`${SB_URL}/fav_sync`, {
      method: 'POST',
      headers: { ...SB_HEADERS, Prefer: 'return=minimal' },
      body: JSON.stringify({ gangsta_name: name, have: [...favsHave], want: [...favsWant] }),
    });
    return res.ok || res.status === 201;
  } catch { return false; }
}

async function ensureStreetName() {
  if (streetName) return streetName;
  for (let i = 0; i < 3; i++) {
    const candidate = genStreetNameCandidate();
    if (await reserveStreetName(candidate)) {
      streetName = candidate;
      localStorage.setItem(STREET_KEY, streetName);
      return streetName;
    }
  }
  return null; // オフライン等で確保できなかった場合は同期なしで動く
}

async function pushFavSync() {
  if (!streetName) await ensureStreetName();
  if (!streetName) return;
  try {
    await fetch(`${SB_URL}/fav_sync?gangsta_name=eq.${encodeURIComponent(streetName)}`, {
      method: 'PATCH',
      headers: { ...SB_HEADERS, Prefer: 'return=minimal' },
      body: JSON.stringify({ have: [...favsHave], want: [...favsWant], updated_at: new Date().toISOString() }),
    });
  } catch { /* オフラインでもローカルは正常に動く */ }
}

async function pullFavSync(name) {
  const res = await fetch(`${SB_URL}/fav_sync?gangsta_name=eq.${encodeURIComponent(name)}&select=have,want`, { headers: SB_HEADERS });
  if (!res.ok) return null;
  const rows = await res.json();
  return rows[0] || null;
}

// ページ読込時: 既にStreet Nameがあればサーバー側の内容で置き換える
// (プッシュは変更のたびに即時実行されるので、ここは主に「他端末での変更」を拾うためのプル)
// 注意: 以前はサーバー側と和集合マージしてから書き戻していたが、それだと
// 「他端末で削除した項目」がこちらの古いローカルコピーによって復活し、
// 削除が同期されないバグになっていた(追加は伝わるが削除が伝わらない)。
// Street Nameは単一の共有状態を指すものなので、サーバー側を正として
// そのまま置き換える(last-write-wins)。
async function autoPullFavSync() {
  if (!streetName) return;
  const row = await pullFavSync(streetName);
  if (!row) return;
  const newHave = new Set(row.have || []);
  const newWant = new Set(row.want || []);
  const changed = newHave.size !== favsHave.size || newWant.size !== favsWant.size
    || [...newHave].some((k) => !favsHave.has(k)) || [...newWant].some((k) => !favsWant.has(k));
  if (!changed) return;
  favsHave.clear(); newHave.forEach((k) => favsHave.add(k));
  favsWant.clear(); newWant.forEach((k) => favsWant.add(k));
  saveFavs();
  updateFavCount();
  if (listView === 'favs') renderFavs(false);
}

// サイコロ: 現在の行を新しい名前へリネーム(持ってる/ほしいはサーバー上のrowがそのまま引き継ぐ)
async function rerollStreetName() {
  for (let i = 0; i < 3; i++) {
    const candidate = genStreetNameCandidate();
    try {
      const res = await fetch(`${SB_URL}/fav_sync?gangsta_name=eq.${encodeURIComponent(streetName)}`, {
        method: 'PATCH',
        headers: { ...SB_HEADERS, Prefer: 'return=minimal' },
        body: JSON.stringify({ gangsta_name: candidate }),
      });
      if (res.ok) {
        streetName = candidate;
        localStorage.setItem(STREET_KEY, streetName);
        return streetName;
      }
    } catch { return null; }
  }
  return null;
}

// 元端末で発行するワンタイム連携コード(10分有効・1回使い切り)
// 名前を偶然知られても/衝突しても、コードが一致しない限り他端末からは連携できない
async function issueLinkCode() {
  if (!streetName) await ensureStreetName();
  if (!streetName) return null;
  const code = Array.from(crypto.getRandomValues(new Uint8Array(6)))
    .map((b) => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[b % 32]).join('');
  try {
    const res = await fetch(`${SB_URL}/fav_sync?gangsta_name=eq.${encodeURIComponent(streetName)}`, {
      method: 'PATCH',
      headers: { ...SB_HEADERS, Prefer: 'return=minimal' },
      body: JSON.stringify({ link_code: code, link_code_expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString() }),
    });
    return res.ok ? code : null;
  } catch { return null; }
}

// 別端末のStreet Name+連携コードを入力して連携(両方一致したときだけ読み込む)
async function linkStreetName(name, code) {
  if (!code) return false;
  const now = new Date().toISOString();
  const res = await fetch(
    `${SB_URL}/fav_sync?gangsta_name=eq.${encodeURIComponent(name)}&link_code=eq.${encodeURIComponent(code)}&link_code_expires_at=gt.${encodeURIComponent(now)}&select=have,want`,
    { headers: SB_HEADERS });
  if (!res.ok) return false;
  const row = (await res.json())[0];
  if (!row) return false;
  favsHave.clear(); (row.have || []).forEach((k) => favsHave.add(k));
  favsWant.clear(); (row.want || []).forEach((k) => favsWant.add(k));
  saveFavs();
  streetName = name;
  localStorage.setItem(STREET_KEY, streetName);
  // コードは1回使い切り: 使用後すぐ無効化
  fetch(`${SB_URL}/fav_sync?gangsta_name=eq.${encodeURIComponent(name)}`, {
    method: 'PATCH',
    headers: { ...SB_HEADERS, Prefer: 'return=minimal' },
    body: JSON.stringify({ link_code: null, link_code_expires_at: null }),
  }).catch(() => {});
  return true;
}

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
  el.className = 'marker' + (region.unclassified ? ' unclassified' : '');
  // 手で押した判子風に、地域ごとに少しだけ傾ける
  const rot = (region.id.split('').reduce((n, c) => n + c.charCodeAt(0), 0) % 13) - 6;
  el.style.setProperty('--rot', `${rot}deg`);
  // 出身地未特定の置き場だけ、墓石でなく漂流ブイ(?)にする
  const icon = region.unclassified
    ? `<svg class="grave buoy" viewBox="0 0 24 26" aria-hidden="true">
         <circle cx="12" cy="12" r="9"/>
         <rect x="10.5" y="19" width="3" height="6"/>
       </svg>
       <span class="q">?</span>`
    : `<svg class="grave" viewBox="0 0 24 26" aria-hidden="true">
         <path d="M5 24 V10 a7 7 0 0 1 14 0 V24 Z"/>
         <rect x="2.5" y="23" width="19" height="2.6"/>
       </svg>`;
  el.innerHTML = `
    <div class="mk">
      <div class="bh"></div>
      ${icon}
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
    // 対数スケールで大きい地域(ヒューストン等30枚超)も差が出るようにする。
    // 以前は Math.min(n, 6) で6枚以降が全部同じサイズになっていた。
    const size = 22 + Math.min(Math.round(Math.log2(n + 1) * 8), 40);
    el.style.width = el.style.height = `${size}px`;
    el.querySelector('.n').textContent = n || '';
    // 0件の墓標は非表示(フィルター中に該当なしの地域も消える)。
    // 未確認情報の置き場だけは0件でも常に見せる。
    el.classList.toggle('hidden', n === 0 && !r.unclassified);
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
      const wasOn = activeFilters.has(s.id);
      activeFilters.clear();
      if (!wasOn) activeFilters.add(s.id);
      filterBar.querySelectorAll('.stamp').forEach((el) => el.classList.remove('on'));
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

// ---------- 戻る操作(スワイプ/ブラウザの戻るボタン)対応 ----------
// 地図(0) → 地域一覧/お気に入り(1) → ディスク詳細(2) の3階層をhistoryに積む。
// 同じ階層内の遷移(別の地域を開く等)はreplaceStateで上書きし、
// 「戻る」1回で必ず1階層だけ上がるようにする。
let navLevel = 0;
history.replaceState({ level: 0 }, '');
function navGoto(level) {
  if (level > navLevel) history.pushState({ level }, '');
  else if (level < navLevel) { /* 呼び出し元(popstate)側でhistory側は既に動いている */ }
  else history.replaceState({ level }, '');
  navLevel = level;
}
function navBack() {
  if (navLevel > 0) history.back();
}
window.addEventListener('popstate', (e) => {
  const level = e.state?.level ?? 0;
  navLevel = level;
  if (level === 0) closeListUI();
  else if (level === 1) {
    if (listView === 'favs') renderFavs(false);
    else if (listView === 'submit') renderSubmit(false);
    else renderList(activeRegion || lastDiscRegion);
  }
});

function openRegion(region, push = true) {
  activeRegion = region;
  shotRegions.add(region.id);
  fireShot(region);
  refreshMarkers();
  if (push) navGoto(1);
  renderList(region);
  // 着弾→揺れを見せてから誌面ポップアップ
  setTimeout(() => document.body.classList.add('detail'), 450);
}

function closeListUI() {
  document.body.classList.remove('detail');
  activeRegion = null;
  refreshMarkers(); // 地図の位置はリセットせずそのまま
}
function closeList() { navBack(); }

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
let lastDiscRegion = null; // ディスクを開いた時点の地域(戻る操作の行き先解決用)
// ディスクを開く直前のスクロール位置。戻ってきたときに一覧トップへ
// 巻き戻らないよう、次の一覧描画で1回だけ復元する。
let savedListScroll = 0;
let restoreScrollNext = false;

function renderList(region) {
  listView = 'region';
  currentDisc = null;
  const list = albumsOf(region).slice().sort((a, b) => a.year - b.year);
  listEl.innerHTML = `
    ${listHead(region.name, region.area, `${list.length} ${t('discs')}`)}
    <div class="grid"></div>`;
  listEl.querySelector('.close').addEventListener('click', closeList);
  const grid = listEl.querySelector('.grid');
  if (!list.length) {
    grid.innerHTML = `<p style="font-size:12px">${t('noMatch')}</p>`;
    applyScrollRestore();
    return;
  }
  list.forEach((a) => grid.appendChild(albumCard(a)));
  applyScrollRestore();
}

// ディスクへ遷移する直前に呼び、一覧へ戻ってきたときに同じ位置へ復元できるようにする
function saveListScrollBeforeDisc() {
  savedListScroll = listEl.scrollTop;
  restoreScrollNext = true;
}
function applyScrollRestore() {
  if (!restoreScrollNext) return;
  restoreScrollNext = false;
  listEl.scrollTop = savedListScroll;
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

  const hasPreview = !!(e?.tracks || []).some((tr) => tr.preview);
  const playBtnHtml = hasPreview
    ? `<button class="play-btn" title="このディスクをキューに追加">▶</button>`
    : '';

  card.innerHTML = `
    <div class="album-head">
      ${artHtml}
      <div class="album-info">
        <p class="t">${album.title}</p>
        <p class="a">${album.artist}</p>
        <p class="m">${album.year} / ${album.label} / ${album.format || 'CD'}</p>
        <div class="album-actions">
          <div class="fav-pair">
            <button class="fav-btn have-btn${favsHave.has(albumKey(album)) ? ' on' : ''}" title="${t('have')}">${t('have')}</button>
            <button class="fav-btn want-btn${favsWant.has(albumKey(album)) ? ' on' : ''}" title="${t('want')}">${t('want')}</button>
          </div>
          ${playBtnHtml}
        </div>
      </div>
    </div>
    <div class="rarity">
      <span class="lab">${t('rarity')} ${r.stars}${r.priceJpy == null && r.have <= 15 ? ' <span class="hot-badge" title="Discogsに出品なし">🔥出品なし</span>' : ''}</span>
      <span class="bar"><i style="width:${Math.round(r.score * 100)}%"></i></span>
      <span class="n">${r.priceJpy != null ? `¥${Math.round(r.priceJpy).toLocaleString()}〜` : `STAMP ${r.total}`}</span>
    </div>
    <div class="album-stamps"></div>`;

  const rerender = () => { card.replaceWith(albumCard(album)); refreshMarkers(); };

  // ディスクのスタンプ = 曲スタンプ+分析初期値の集計(表示のみ。押すのは専用ページで)
  const wrap = card.querySelector('.album-stamps');
  STAMPS.filter((s) => stampCount(album, s.id) > 0)
    .sort((a, b) => stampCount(album, b.id) - stampCount(album, a.id))
    .forEach((s) => wrap.appendChild(discChip(album, s, true, null)));

  // カードのどこを押してもディスク専用ページへ(ボタン類は除く)
  card.addEventListener('click', (ev) => {
    if (ev.target.closest('button, a')) return;
    saveListScrollBeforeDisc();
    renderDisc(album);
  });

  card.querySelector('.play-btn')?.addEventListener('click', () => playAlbum(album));
  card.querySelector('.have-btn').addEventListener('click', () => {
    toggleFav(favsHave, albumKey(album)); updateFavCount(); rerender();
  });
  card.querySelector('.want-btn').addEventListener('click', () => {
    toggleFav(favsWant, albumKey(album)); updateFavCount(); rerender();
  });
  return card;
}

// ---------- ディスク専用ページ(大ジャケ+曲一覧+曲単位スタンプ) ----------
function renderDisc(album, push = true) {
  currentDisc = album;
  const e = enrichOf(album);
  const r = rarity(album);
  const region = REGIONS.find((rr) => rr.albums.includes(album));
  lastDiscRegion = region;
  if (push) navGoto(2);
  const art = artUrl(e, 600);
  const key = albumKey(album);
  const rerender = () => renderDisc(album, false);
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
          e?.link ? ` / <a class="apple" href="${e.link}" target="_blank" rel="noopener">Apple Music ↗</a>` : ''}${
          album.discogsUrl ? ` / <a class="apple" href="${album.discogsUrl}" target="_blank" rel="noopener">Discogs ↗</a>` : ''}</p>
        <div class="disc-actions">
          <button class="tr-toggle have-d${favsHave.has(key) ? ' on' : ''}">${t('have')}</button>
          <button class="tr-toggle want-d${favsWant.has(key) ? ' on' : ''}">${t('want')}</button>
          <button class="tr-toggle play-d">${t('queueAll')}</button>
        </div>
        <div class="rarity">
          <span class="lab">${t('rarity')} ${r.stars}${r.priceJpy == null && r.have <= 15 ? ' <span class="hot-badge" title="Discogsに出品なし">🔥出品なし</span>' : ''}</span>
          ${r.priceJpy != null ? `<span class="n">参考価格 ¥${Math.round(r.priceJpy).toLocaleString()}〜</span>` : ''}
          <span class="bar"><i style="width:${Math.round(r.score * 100)}%"></i></span>
          <span class="n">STAMP ${r.total}</span>
        </div>
        <div class="album-stamps"></div>
      </div>
    </div>
    <div class="tracks"></div>`;

  // ◀ も ✕ も「元のディスク一覧」へ戻る(地図まで一気に閉じない)。
  // historyを1つ戻すことでpopstateハンドラに実際の描画を任せる
  // (スワイプ/ブラウザの戻るボタンと同じ経路に揃える)。
  listEl.querySelector('.back').addEventListener('click', navBack);
  listEl.querySelector('.x').addEventListener('click', navBack);

  const wrap = listEl.querySelector('.album-stamps');
  if (tracks.length) {
    // スタンプは曲側で押す(ここは集計表示)
    STAMPS.filter((s) => stampCount(album, s.id) > 0)
      .sort((a, b) => stampCount(album, b.id) - stampCount(album, a.id))
      .forEach((s) => wrap.appendChild(discChip(album, s, true, null)));
  } else {
    // 曲データのない激レア盤はディスクに直接押せる
    STAMPS.forEach((s) => wrap.appendChild(discChip(album, s, false, rerender)));
  }

  listEl.querySelector('.play-d').addEventListener('click', () => playAlbum(album));
  listEl.querySelector('.have-d').addEventListener('click', () => {
    toggleFav(favsHave, key); updateFavCount(); rerender();
  });
  listEl.querySelector('.want-d').addEventListener('click', () => {
    toggleFav(favsWant, key); updateFavCount(); rerender();
  });

  const tracksEl = listEl.querySelector('.tracks');
  tracks.forEach((t, i) => tracksEl.appendChild(trackRow(album, t, i, rerender)));
}

// ---------- お気に入りリスト表示(持ってる/ほしい の2セクション) ----------
function allKnownAlbums() {
  const out = [];
  REGIONS.forEach((r) => r.albums.forEach((a) => out.push({ a, r })));
  return out;
}

function renderFavs(push = true) {
  listView = 'favs';
  currentDisc = null;
  if (push) navGoto(1);
  document.body.classList.add('detail');
  activeRegion = null;
  refreshMarkers();
  const all = allKnownAlbums();
  const haveItems = all.filter(({ a }) => favsHave.has(albumKey(a)));
  const wantItems = all.filter(({ a }) => favsWant.has(albumKey(a)));
  const total = new Set([...favsHave, ...favsWant]).size;

  const section = (title, items) => `
    <div class="fav-section">
      <h3>${title} <span class="cnt">${items.length} ${t('discs')}</span></h3>
      <div class="grid"></div>
    </div>`;

  listEl.innerHTML = `
    ${listHead(t('favs'), t('favSub'), `${total} ${t('discs')}`)}
    <details class="street-sync">
      <summary class="street-sync-row">
        <span class="lab">${t('streetName')}</span>
        <span class="street-name-val" id="streetNameVal">…</span>
        <span class="street-sync-caret">▼</span>
      </summary>
      <div class="street-sync-body">
        <p class="street-sync-hint">${t('streetNameHint')}</p>
        <p class="street-sync-hint">${t('codeHint')}</p>
        <div class="street-sync-row">
          <button class="tr-toggle" id="streetReroll">${t('reroll')}</button>
          <button class="tr-toggle" id="streetIssueCode">${t('issueCode')}</button>
        </div>
        <div class="street-sync-row">
          <input type="text" id="streetLinkInput" placeholder="${t('linkPlaceholder')}" title="${t('linkTitle')}">
          <input type="text" id="streetLinkCode" placeholder="${t('codePlaceholder')}">
          <button class="tr-toggle" id="streetLinkBtn">${t('link')}</button>
        </div>
        <span class="form-msg" id="streetSyncMsg"></span>
      </div>
    </details>
    <div class="fav-io">
      <button class="tr-toggle" id="favExport">${t('exportCsv')}</button>
      <button class="tr-toggle" id="favImportBtn">${t('importCsv')}</button>
      <input type="file" id="favImportFile" accept=".csv,text/csv" hidden>
      <span class="form-msg" id="favIoMsg"></span>
    </div>
    ${section(t('wantSection'), wantItems)}
    ${section(t('haveSection'), haveItems)}`;
  listEl.querySelector('.close').addEventListener('click', closeList);

  const $sname = listEl.querySelector('#streetNameVal');
  const $syncMsg = listEl.querySelector('#streetSyncMsg');
  ensureStreetName().then((n) => { $sname.textContent = n || '—'; });
  listEl.querySelector('#streetReroll').addEventListener('click', async () => {
    if (!confirm(t('rerollConfirm'))) return;
    $syncMsg.textContent = t('linking');
    const n = await rerollStreetName();
    $syncMsg.textContent = n ? t('syncOk') : t('syncErr');
    if (n) $sname.textContent = n;
  });
  listEl.querySelector('#streetIssueCode').addEventListener('click', async () => {
    $syncMsg.textContent = t('linking');
    const code = await issueLinkCode();
    $syncMsg.textContent = code ? t('codeIssued')(code) : t('syncErr');
  });
  listEl.querySelector('#streetLinkBtn').addEventListener('click', async () => {
    const name = listEl.querySelector('#streetLinkInput').value.trim().toUpperCase();
    const code = listEl.querySelector('#streetLinkCode').value.trim().toUpperCase();
    if (!name || !code) return;
    $syncMsg.textContent = t('linking');
    const ok = await linkStreetName(name, code);
    $syncMsg.textContent = ok ? t('syncOk') : t('linkNotFound');
    if (ok) { $sname.textContent = streetName; updateFavCount(); renderFavs(false); }
  });

  // セクションの表示順は ホシイ→持ッテル(DOM上の1つ目がwant)
  const [wantGrid, haveGrid] = listEl.querySelectorAll('.fav-section .grid');
  const fillGrid = (grid, items) => {
    if (!items.length) { grid.innerHTML = `<p style="font-size:12px">${t('favEmpty')}</p>`; return; }
    items.forEach(({ a, r }) => {
      const c = albumCard(a);
      c.querySelector('.album-info .m').insertAdjacentHTML('beforeend', ` / <b>${r.name}</b>`);
      grid.appendChild(c);
    });
  };
  fillGrid(haveGrid, haveItems);
  fillGrid(wantGrid, wantItems);

  listEl.querySelector('#favExport').addEventListener('click', exportFavsCsv);
  const fileInput = listEl.querySelector('#favImportFile');
  listEl.querySelector('#favImportBtn').addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', async () => {
    const file = fileInput.files[0];
    if (!file) return;
    const n = importFavsCsv(await file.text());
    listEl.querySelector('#favIoMsg').textContent = n > 0 ? t('importOk')(n) : t('importNone');
    updateFavCount();
    renderFavs(false);
  });
  applyScrollRestore();
}
document.getElementById('brandHome').addEventListener('click', () => location.reload());
document.getElementById('favBtn').addEventListener('click', renderFavs);
updateFavCount();

// ---------- CSV エクスポート/インポート(ブラウザ内完結・サーバー送信なし) ----------
const csvField = (s) => `"${String(s ?? '').replace(/"/g, '""')}"`;

function exportFavsCsv() {
  const rows = [['status', 'artist', 'title', 'year', 'label', 'region']];
  allKnownAlbums().forEach(({ a, r }) => {
    const key = albumKey(a);
    const statuses = [favsHave.has(key) && 'have', favsWant.has(key) && 'want'].filter(Boolean);
    if (!statuses.length) return;
    rows.push([statuses.join(';'), a.artist, a.title, a.year ?? '', a.label ?? '', r.name]);
  });
  const csv = rows.map((row) => row.map(csvField).join(',')).join('\r\n');
  const blob = new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'gangsta-rap-atlas-favs.csv';
  a.click();
  URL.revokeObjectURL(url);
}

// 簡易CSVパーサ(ダブルクォート囲み・""エスケープに対応)
function parseCsv(text) {
  const rows = [];
  let row = [], field = '', inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.some((f) => f !== '')) rows.push(row);
      row = [];
    } else field += c;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return rows;
}

function importFavsCsv(text) {
  const rows = parseCsv(text.replace(/^﻿/, ''));
  if (!rows.length) return 0;
  const header = rows[0].map((h) => h.trim().toLowerCase());
  const idx = (name) => header.indexOf(name);
  const iStatus = idx('status'), iArtist = idx('artist'), iTitle = idx('title');
  if (iArtist < 0 || iTitle < 0) return 0;

  const norm_ = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
  const byKey = new Map(allKnownAlbums().map(({ a }) => [norm_(a.artist) + '|' + norm_(a.title), albumKey(a)]));
  let matched = 0;
  rows.slice(1).forEach((row) => {
    const artist = row[iArtist], title = row[iTitle];
    if (!artist || !title) return;
    const k = byKey.get(norm_(artist) + '|' + norm_(title));
    if (!k) return;
    const status = (iStatus >= 0 ? row[iStatus] : 'have').toLowerCase();
    if (status.includes('have')) favsHave.add(k);
    if (status.includes('want')) favsWant.add(k);
    matched++;
  });
  saveFavs();
  return matched;
}

// 墓石メニュー(狭い画面): スタンプ絞り込みの開閉
document.getElementById('stampMenuBtn').addEventListener('click', () => {
  document.body.classList.toggle('stamps-open');
});

// 狭い画面では 投稿・言語ボタンをドロワー下部のセクションへ移す
const narrowMq = matchMedia('(max-width: 860px)');
function placeActionButtons() {
  const submitB = document.getElementById('submitBtn');
  const langB = document.getElementById('langBtn');
  if (narrowMq.matches) {
    document.getElementById('drawerActions').append(submitB, langB);
  } else {
    const actions = document.querySelector('.top-actions');
    actions.prepend(submitB, langB); // 投稿, 言語, ★, 墓石 の順に戻す
  }
}
narrowMq.addEventListener('change', placeActionButtons);
placeActionButtons();

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
    queue = e.tracks.map((tr) => ({ title: tr.name, artist: album.artist, preview: tr.preview, art, album }));
    cursor = Math.min(startIndex, queue.length - 1);
  } else {
    queue = [{ title: album.title, artist: album.artist, preview: null, art: null, album }];
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

// Media Session API: ロック画面/通知領域の再生コントロールとバックグラウンド再生に対応。
// 曲が変わるたびにメタデータを更新し、OS側の▶⏸/前後ボタンをこちらの操作につなぐ。
if ('mediaSession' in navigator) {
  navigator.mediaSession.setActionHandler('play', () => { if (queue[cursor]?.preview) audio.play().catch(() => {}); });
  navigator.mediaSession.setActionHandler('pause', () => audio.pause());
  navigator.mediaSession.setActionHandler('previoustrack', prev);
  navigator.mediaSession.setActionHandler('nexttrack', next);
}
function syncMediaSession(q) {
  if (!('mediaSession' in navigator)) return;
  if (!q) { navigator.mediaSession.metadata = null; navigator.mediaSession.playbackState = 'none'; return; }
  navigator.mediaSession.metadata = new MediaMetadata({
    title: q.title, artist: q.artist, album: 'GANGSTA RAP ATLAS',
    artwork: q.art ? [{ src: q.art, sizes: '100x100', type: 'image/jpeg' }] : [],
  });
  navigator.mediaSession.playbackState = audio.paused ? 'paused' : 'playing';
}

function paint() {
  const q = queue[cursor];
  $count.textContent = `${queue.length} 曲`;
  $play.textContent = audio.paused ? '▶' : '⏸';
  syncMediaSession(q);
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
document.querySelector('.player-now').addEventListener('click', () => {
  const album = queue[cursor]?.album;
  if (album) renderDisc(album);
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

// ---------- 投稿フォーム(タレコミ) ----------
function renderSubmit(push = true) {
  listView = 'submit';
  currentDisc = null;
  if (push) navGoto(1);
  document.body.classList.remove('stamps-open'); // ドロワーから開いた場合は閉じる
  document.body.classList.add('detail');
  const opt = (v) => `<option value="${v}">${v}</option>`;
  listEl.innerHTML = `
    ${listHead(t('submitTitle'), t('submitSub'), '')}
    <form class="submit-form">
      <label>${t('fArtist')}<input name="artist" maxlength="120" required></label>
      <label>${t('fTitle')}<input name="title" maxlength="200" required></label>
      <div class="row2">
        <label>${t('fYear')}<input name="year" type="number" min="1970" max="2030"></label>
        <label>${t('fFormat')}<select name="format">${['CD','CDS','Tape','Vinyl','Other'].map(opt).join('')}</select></label>
      </div>
      <label>${t('fLabel')}<input name="label" maxlength="120"></label>
      <label>${t('fRegion')}<input name="region" maxlength="120"></label>
      <label>${t('fComment')}<textarea name="comment" maxlength="1000" rows="4"></textarea></label>
      <p class="form-note">${t('noPii')}</p>
      <button type="submit" class="tr-toggle send">${t('send')}</button>
      <p class="form-msg"></p>
    </form>`;
  listEl.querySelector('.close').addEventListener('click', closeList);

  const form = listEl.querySelector('form');
  const msg = listEl.querySelector('.form-msg');
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const f = new FormData(form);
    const body = {
      artist: (f.get('artist') || '').trim(),
      title: (f.get('title') || '').trim(),
      year: f.get('year') ? Number(f.get('year')) : null,
      label: (f.get('label') || '').trim() || null,
      region: (f.get('region') || '').trim() || null,
      format: f.get('format'),
      comment: (f.get('comment') || '').trim() || null,
    };
    if (!body.artist || !body.title) { msg.textContent = t('needFields'); return; }
    msg.textContent = t('sending');
    form.querySelector('.send').disabled = true;
    try {
      const res = await fetch(`${SB_URL}/submissions`, {
        method: 'POST',
        headers: { ...SB_HEADERS, Prefer: 'return=minimal' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(res.status);
      form.reset();
      msg.textContent = t('sent');
    } catch {
      msg.textContent = t('sendErr');
    } finally {
      form.querySelector('.send').disabled = false;
    }
  });
}
document.getElementById('submitBtn').addEventListener('click', renderSubmit);

// ---------- 言語切り替え ----------
function applyLang() {
  document.documentElement.lang = lang;
  document.querySelector('.brand p').textContent = t('sub');
  document.querySelector('.intro p').textContent = t('intro');
  document.getElementById('clearQueue').textContent = t('clear');
  document.querySelector('.player-queue .credit').textContent = t('credit');
  document.getElementById('langBtn').textContent = lang === 'ja' ? 'EN' : 'JA';
  document.getElementById('submitBtn').textContent = t('submit');
  buildFilterBar();
  paint();
  // 開いている画面を同じ状態のまま描き直す
  if (document.body.classList.contains('detail')) {
    if (currentDisc) renderDisc(currentDisc, false);
    else if (listView === 'favs') renderFavs(false);
    else if (listView === 'submit') renderSubmit(false);
    else if (activeRegion) renderList(activeRegion);
  }
}
document.getElementById('langBtn').addEventListener('click', () => {
  lang = lang === 'ja' ? 'en' : 'ja';
  localStorage.setItem('gra.lang', lang);
  applyLang();
});
applyLang();
loadSharedStamps();
autoPullFavSync();

refreshMarkers();
map.on('load', () => { map.resize(); refreshMarkers(); });
