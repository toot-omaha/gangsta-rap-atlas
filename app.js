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
    queueAll: '＋ キューニ追加',
    qEmptyT: '再生キューハ空', qEmptyA: 'アルバムノ ▶ ヲ押ストキューニ入ル',
    preview: '30秒試聴', noAudio: '試聴音源ナシ(激レア)',
    clear: 'クリア', credit: '試聴・ジャケ写: Apple Music',
    submit: '✚ 投稿', submitTitle: 'タレコミ', submitSub: 'ディスク情報ヲ投稿(承認後ニ掲載)',
    fUrl: 'URL(iTunes/YouTube/Spotifyなど) *', fUrlHint: 'アルバム・曲・動画のリンクを貼るダケでOK。詳細ハこちらで裏取りシマス。',
    fArtistOpt: 'アーティスト(わかれば)', fTitleOpt: 'タイトル(わかれば)',
    fComment: 'コメント・出典など',
    noPii: '⚠ 個人情報(名前・連絡先など)ハ書キ込マナイコト',
    send: '送信スル', sending: '送信中…', sent: '感謝!承認後ニ地図ニ刻マレル。', sendErr: '送信失敗。時間ヲ置イテ再度。',
    needFields: 'URLは必須です',
    linkCopied: 'リンクをコピーシタ',
    streetName: 'YOUR STREET NAME', streetNameHint: 'コレデ他端末ト持ッテル/ホシイヲ同期デキル',
    reroll: '🎲 再生成', linkTitle: '別端末ノSTREET NAMEヲ入力シテ連携',
    linkPlaceholder: '例: SHADOW-REAPER', link: '連携スル',
    syncOk: '同期完了', syncErr: '同期失敗。時間ヲ置イテ再度。', linking: '連携中…',
    linkNotFound: 'STREET NAMEカ連携コードガ違ウ(コードハ発行後10分有効)',
    rerollConfirm: '再生成スルト今ノSTREET NAMEハ無効ニナル(持ッテル/ホシイト連携済ミ端末ハ新シイ名前ニ引キ継ガレル)。ヨロシイ？',
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
    queueAll: '＋ ADD TO QUEUE',
    qEmptyT: 'QUEUE IS EMPTY', qEmptyA: 'Hit ▶ on a disc to queue it',
    preview: '30s preview', noAudio: 'No preview audio (rare!)',
    clear: 'CLEAR', credit: 'Previews & artwork: Apple Music',
    submit: '✚ SUBMIT', submitTitle: 'DROP A DIME', submitSub: 'Submit a disc (published after review)',
    fUrl: 'URL (iTunes/YouTube/Spotify etc.) *', fUrlHint: 'Just paste a link to the album/track/video — we\'ll look up the details.',
    fArtistOpt: 'Artist (if known)', fTitleOpt: 'Title (if known)',
    fComment: 'Comment / source',
    noPii: '⚠ Do not include personal information (names, contacts, etc.)',
    send: 'SEND', sending: 'Sending…', sent: 'Respect! It will be carved on the map after review.', sendErr: 'Failed. Try again later.',
    needFields: 'URL is required',
    linkCopied: 'Link copied',
    streetName: 'YOUR STREET NAME', streetNameHint: 'Use this to sync have/want across devices',
    reroll: '🎲 Reroll', linkTitle: 'Enter another device\'s Street Name to link',
    linkPlaceholder: 'e.g. SHADOW-REAPER', link: 'Link',
    syncOk: 'Synced', syncErr: 'Sync failed. Try again later.', linking: 'Linking…',
    linkNotFound: 'Street Name or link code is wrong (codes last 10 min)',
    rerollConfirm: 'Rerolling retires your current Street Name (have/want and linked devices carry over to the new name). Continue?',
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
// 共有リンク用のディスクID。data.js内で各アルバムに直接振られた連番(a.id)を使う。
// 並び順・情報源(Discogs/投稿)・タイトルの表記ゆれのどれにも影響されない
// 本物の一意ID。
const resolveDiscShareId = (region, id) => region.albums.find((a) => a.id === Number(id));
const norm = (s) => (s || '').toLowerCase().replace(/[^a-z0-9぀-ヿ一-龯]+/g, '');
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
    let res = await fetch(`${SB_URL}/fav_sync`, {
      method: 'POST',
      headers: { ...SB_HEADERS, Prefer: 'return=minimal' },
      body: JSON.stringify({ gangsta_name: name, have: [...favsHave], want: [...favsWant], eras: [...eraFilters] }),
    });
    if (res.status === 400) {
      // eras列のマイグレーション未実施のDBへのフォールバック
      res = await fetch(`${SB_URL}/fav_sync`, {
        method: 'POST',
        headers: { ...SB_HEADERS, Prefer: 'return=minimal' },
        body: JSON.stringify({ gangsta_name: name, have: [...favsHave], want: [...favsWant] }),
      });
    }
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

// ---- STREET NAME再生成の他端末追従 ----
// fav_syncテーブルにはgangsta_name以外の不変キーが無いため、再生成(リネーム)は
// 「新しい名前で行を複製し、旧行のhaveに移転先マーカーを残す」方式で行う。
// 他端末はpull/push前にマーカーを辿って自分のSTREET NAMEを自動更新するので、
// 再生成しても連携が切れない。
const MOVED_PREFIX = '__moved__:';
function movedTarget(row) {
  const h = row && Array.isArray(row.have) ? row.have : [];
  return (h.length === 1 && typeof h[0] === 'string' && h[0].startsWith(MOVED_PREFIX))
    ? h[0].slice(MOVED_PREFIX.length) : null;
}
// マーカーを辿って現在の名前と行を解決する(連続再生成に備えて最大5ホップ)
async function resolveStreetName(name) {
  let cur = name, row = null;
  for (let i = 0; i < 5; i++) {
    row = await pullFavSync(cur);
    const target = row && movedTarget(row);
    if (!target) break;
    cur = target;
  }
  return { name: cur, row };
}
// 解決した名前が旧名と違えばローカルへ反映し、お気に入り画面の表示も更新する
function adoptStreetName(name) {
  if (name === streetName) return;
  streetName = name;
  localStorage.setItem(STREET_KEY, streetName);
  const $v = document.getElementById('streetNameVal');
  if ($v) $v.textContent = streetName;
}

async function pushFavSync() {
  if (!streetName) await ensureStreetName();
  if (!streetName) return;
  try {
    // 他端末で再生成されていたら、旧名の行(マーカー)ではなく移転先へ書き込む
    const { name } = await resolveStreetName(streetName);
    adoptStreetName(name);
  } catch { /* 解決に失敗してもそのままの名前で試す */ }
  try {
    const res = await fetch(`${SB_URL}/fav_sync?gangsta_name=eq.${encodeURIComponent(streetName)}`, {
      method: 'PATCH',
      headers: { ...SB_HEADERS, Prefer: 'return=minimal' },
      body: JSON.stringify({ have: [...favsHave], want: [...favsWant], eras: [...eraFilters], updated_at: new Date().toISOString() }),
    });
    if (!res.ok) {
      // eras列のマイグレーション未実施のDBでもhave/want同期は壊さない
      await fetch(`${SB_URL}/fav_sync?gangsta_name=eq.${encodeURIComponent(streetName)}`, {
        method: 'PATCH',
        headers: { ...SB_HEADERS, Prefer: 'return=minimal' },
        body: JSON.stringify({ have: [...favsHave], want: [...favsWant], updated_at: new Date().toISOString() }),
      });
    }
  } catch { /* オフラインでもローカルは正常に動く */ }
}

async function pullFavSync(name) {
  let res = await fetch(`${SB_URL}/fav_sync?gangsta_name=eq.${encodeURIComponent(name)}&select=have,want,eras`, { headers: SB_HEADERS });
  if (!res.ok) {
    // eras列のマイグレーション未実施のDBへのフォールバック
    res = await fetch(`${SB_URL}/fav_sync?gangsta_name=eq.${encodeURIComponent(name)}&select=have,want`, { headers: SB_HEADERS });
  }
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
  // 他端末で再生成されていたらマーカーを辿って新しい名前に追従する
  const { name, row } = await resolveStreetName(streetName);
  adoptStreetName(name);
  if (!row) return;
  applyErasFromRow(row);
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

// サーバー行のeras(年代フィルター)をローカルへ反映する。列が無い/空なら何もしない
function applyErasFromRow(row) {
  if (!Array.isArray(row.eras) || !row.eras.length) return;
  const same = row.eras.length === eraFilters.size && row.eras.every((e) => eraFilters.has(e));
  if (same) return;
  eraFilters.clear();
  row.eras.forEach((e) => eraFilters.add(e));
  saveEras();
  buildEraBar();
  refreshMarkers();
  if (activeRegion) renderList(activeRegion);
}

// サイコロ: 新しい名前の行を現在のローカル状態で作成し、旧行には移転先マーカーを残す。
// 連携済みの他端末はpull/push時にマーカーを辿って新しい名前へ自動追従するので、
// 再生成しても同期は切れない(旧来は行を直接リネームしていたため他端末が迷子になっていた)。
async function rerollStreetName() {
  if (!streetName) return null;
  const oldName = streetName;
  for (let i = 0; i < 3; i++) {
    const candidate = genStreetNameCandidate();
    if (!(await reserveStreetName(candidate))) continue; // 名前衝突なら引き直し
    try {
      await fetch(`${SB_URL}/fav_sync?gangsta_name=eq.${encodeURIComponent(oldName)}`, {
        method: 'PATCH',
        headers: { ...SB_HEADERS, Prefer: 'return=minimal' },
        body: JSON.stringify({
          have: [MOVED_PREFIX + candidate], want: [],
          link_code: null, link_code_expires_at: null,
          updated_at: new Date().toISOString(),
        }),
      });
    } catch { /* マーカー書き込み失敗時も新行は有効。他端末は旧名のまま残るが手動連携で復帰可能 */ }
    streetName = candidate;
    localStorage.setItem(STREET_KEY, streetName);
    return streetName;
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
  const base = `${SB_URL}/fav_sync?gangsta_name=eq.${encodeURIComponent(name)}&link_code=eq.${encodeURIComponent(code)}&link_code_expires_at=gt.${encodeURIComponent(now)}`;
  let res = await fetch(`${base}&select=have,want,eras`, { headers: SB_HEADERS });
  if (!res.ok) {
    // eras列のマイグレーション未実施のDBへのフォールバック
    res = await fetch(`${base}&select=have,want`, { headers: SB_HEADERS });
  }
  if (!res.ok) return false;
  const row = (await res.json())[0];
  if (!row) return false;
  applyErasFromRow(row);
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
// 直近で開いた地域のid。マーカーを赤く保つ&地図に戻った時の中央寄せに使う。
// 次に別の地域を選ぶまで維持する(検索経由で開いた場合に特に有効)。
let selectedRegionId = null;

// ---------- 年代フィルター ----------
// 3区分のチェックボックス(デフォルト全ON)。外した年代のディスクは
// 地図・一覧・検索すべてから除外される。チェック状態はlocalStorageに保存し、
// Street Name同期(fav_sync.eras列)で他端末とも共有する。
const ERA_KEY = 'gra.eraFilters.v1';
const ERAS = [
  { id: 'pre2000', label: '〜1999' },
  { id: 'y2000s', label: '2000〜2009' },
  { id: 'y2010s', label: '2010〜2019' },
  { id: 'y2020s', label: '2020〜' },
];
const eraFilters = new Set(JSON.parse(localStorage.getItem(ERA_KEY) || 'null') || ERAS.map((e) => e.id));
// 2010〜が2010年代/2020〜に分割される前の保存データを引き継ぐ場合、
// 2020年代のディスクが急に非表示になってユーザーを驚かせないよう補完する
if (eraFilters.has('y2010s') && !eraFilters.has('y2020s')) eraFilters.add('y2020s');
const saveEras = () => localStorage.setItem(ERA_KEY, JSON.stringify([...eraFilters]));
const eraOf = (a) => (a.year <= 1999 ? 'pre2000' : a.year <= 2009 ? 'y2000s' : a.year <= 2019 ? 'y2010s' : 'y2020s');

const albumsOf = (r) => {
  let list = r.albums.filter((a) => eraFilters.has(eraOf(a)));
  if (activeFilters.size) list = list.filter((a) => [...activeFilters].every((f) => hasStamp(a, f)));
  return list;
};

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
    el.classList.toggle('selected', r.id === selectedRegionId);
    el.title = `${r.name} — ${n}枚`;
    // 重なり順: 枚数が多いほど上に。選択中の地域は常に最前面。
    el.style.zIndex = r.id === selectedRegionId ? 9000 : n;
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

// ---------- 年代フィルターUI ----------
const eraBar = document.getElementById('eraFilter');
function buildEraBar() {
  if (!eraBar) return; // 旧キャッシュのHTMLに要素が無くてもアプリ全体を巻き込んで落ちない
  eraBar.innerHTML = '';
  ERAS.forEach((e) => {
    const label = document.createElement('label');
    label.className = 'era-chk' + (eraFilters.has(e.id) ? ' on' : '');
    label.innerHTML = `<input type="checkbox"${eraFilters.has(e.id) ? ' checked' : ''}><span>${e.label}</span>`;
    label.querySelector('input').addEventListener('change', (ev) => {
      if (ev.target.checked) eraFilters.add(e.id); else eraFilters.delete(e.id);
      label.classList.toggle('on', ev.target.checked);
      saveEras();
      pushFavSync(); // チェック状態もStreet Nameに載せて他端末と同期
      refreshMarkers();
      if (activeRegion) renderList(activeRegion);
      if (searchOverlay.classList.contains('open')) runSearch(searchInput.value);
    });
    eraBar.appendChild(label);
  });
}
buildEraBar();

// ---------- 検索 ----------
const searchOverlay = document.getElementById('searchOverlay');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

function clearStampFilter() {
  if (activeFilters.size === 0) return;
  activeFilters.clear();
  filterBar.querySelectorAll('.stamp').forEach((el) => el.classList.remove('on'));
  refreshMarkers();
  if (activeRegion) renderList(activeRegion);
}

function openSearch() {
  clearStampFilter(); // スタンプ絞り込み中に検索を開いたら解除し、全件対象で探せるようにする
  searchOverlay.classList.add('open');
  document.body.classList.add('search-open'); // スマホでは虫眼鏡ボタン自体を隠す
  searchInput.value = '';
  searchResults.innerHTML = '';
  setTimeout(() => searchInput.focus(), 50);
}
function closeSearch() {
  searchOverlay.classList.remove('open');
  document.body.classList.remove('search-open');
}

function runSearch(q) {
  const nq = norm(q);
  if (!nq) { searchResults.innerHTML = ''; return; }
  // 地名(都市名・州名)にもヒットさせる。ヒットした地域は結果の先頭に出し、
  // クリックでその地域の一覧を開く
  const regionHits = REGIONS.filter(
    (r) => !r.unclassified && (norm(r.name).includes(nq) || norm(r.area).includes(nq)) && albumsOf(r).length > 0);
  const hits = [];
  REGIONS.forEach((r) => {
    r.albums.forEach((a) => {
      if (!eraFilters.has(eraOf(a))) return; // 年代フィルターは検索にも適用
      if (norm(a.artist).includes(nq) || norm(a.title).includes(nq)) hits.push({ a, r });
    });
  });
  if (!regionHits.length && !hits.length) {
    searchResults.innerHTML = `<p class="sr-empty">${t('noMatch')}</p>`;
    return;
  }
  searchResults.innerHTML = '';
  regionHits.slice(0, 10).forEach((r) => {
    const row = document.createElement('div');
    row.className = 'sr-item sr-region';
    row.innerHTML = `<span class="t">📍 ${r.name}</span><span class="a">${r.area}</span><span class="r">${albumsOf(r).length} ${t('discs')}</span>`;
    row.addEventListener('click', () => {
      closeSearch();
      openRegion(r);
    });
    searchResults.appendChild(row);
  });
  hits.slice(0, 60).forEach(({ a, r }) => {
    const row = document.createElement('div');
    row.className = 'sr-item';
    row.innerHTML = `<span class="t">${a.title}</span><span class="a">${a.artist}</span><span class="r">${r.name}</span>`;
    row.addEventListener('click', () => {
      closeSearch();
      openRegion(r);
      setTimeout(() => { saveListScrollBeforeDisc(); renderDisc(a); }, 460);
    });
    searchResults.appendChild(row);
  });
}

// 旧キャッシュのHTMLに検索UIが無い場合でも他機能を巻き込まないようガードする
if (searchOverlay && searchInput) {
  document.getElementById('searchBtn')?.addEventListener('click', openSearch);
  document.getElementById('searchClose')?.addEventListener('click', closeSearch);
  searchOverlay.addEventListener('click', (e) => { if (e.target === searchOverlay) closeSearch(); });
  searchInput.addEventListener('input', () => runSearch(searchInput.value));
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && searchOverlay?.classList.contains('open')) closeSearch();
});

// ---------- 外部リンクプレビュー(iframe埋め込み) ----------
// Discogs/Apple MusicはX-Frame-Options等でiframe埋め込みを拒否するため、
// 実際に表示できるかはサイト側次第。拒否された場合でもヘッダーの
// 「新しいタブで開く」から通常どおり遷移できるようにしておく。
const linkOverlay = document.getElementById('linkOverlay');
const linkOverlayBody = document.getElementById('linkOverlayBody');
const linkOverlayTitle = document.getElementById('linkOverlayTitle');
const linkOverlayOpen = document.getElementById('linkOverlayOpen');

function openLinkPreview(embedUrl, openUrl, title) {
  linkOverlayTitle.textContent = title || openUrl;
  linkOverlayOpen.href = openUrl;
  // sandbox属性や referrerpolicy="no-referrer" を付けるとYouTube埋め込み
  // プレーヤーの初期化に失敗する(エラー153: オリジン検証に失敗するため)
  // ので付けない。Discogs/Apple MusicはX-Frame-Options等でそもそも埋め込み
  // 自体を拒否してくるため、この設定でも実害はない。
  linkOverlayBody.innerHTML = `<iframe src="${embedUrl}" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
  linkOverlay.classList.add('open');
  document.body.classList.add('search-open');
}
function closeLinkPreview() {
  linkOverlay.classList.remove('open');
  document.body.classList.remove('search-open');
  linkOverlayBody.innerHTML = ''; // 裏で再生され続けたりしないよう閉じたら破棄する
}
if (linkOverlay) {
  document.getElementById('linkOverlayClose')?.addEventListener('click', closeLinkPreview);
  linkOverlay.addEventListener('click', (e) => { if (e.target === linkOverlay) closeLinkPreview(); });
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && linkOverlay?.classList.contains('open')) closeLinkPreview();
});
// Android TWA(twa-manifest.jsonでfallbackType: customtabs設定済み)で
// 動いている時は、スコープ外リンクへの通常遷移がOS側で自動的にChrome
// Custom Tabsのアプリ内ブラウザ表示に化けてくれる。iframeポップアップで
// 横取りするとこの挙動を潰してしまうので、TWA内では素通しする。
const isTwa = document.referrer.startsWith('android-app://');

// .ext-link を持つリンクは修飾キー無しの左クリックだけ横取りしてポップアップにする
// (Ctrl/Cmd/中クリックは新規タブを開く通常動作のまま)
document.addEventListener('click', (e) => {
  if (isTwa) return;
  const a = e.target.closest?.('a.ext-link');
  if (!a) return;
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  openLinkPreview(a.dataset.embed || a.href, a.href, a.textContent.trim());
});

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
function navGoto(level, hash) {
  const url = hash != null ? hash : undefined;
  if (level > navLevel) history.pushState({ level }, '', url);
  else if (level < navLevel) { /* 呼び出し元(popstate)側でhistory側は既に動いている */ }
  else history.replaceState({ level }, '', url);
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
  selectedRegionId = region.id; // 次に別の地域を選ぶまで赤表示を維持
  shotRegions.add(region.id);
  fireShot(region);
  refreshMarkers();
  navGoto(push ? 1 : navLevel, `#r/${encodeURIComponent(region.id)}`);
  renderList(region);
  // 着弾→揺れを見せてから誌面ポップアップ
  setTimeout(() => document.body.classList.add('detail'), 450);
}

function closeListUI() {
  document.body.classList.remove('detail');
  activeRegion = null;
  // 選択中の地域(赤表示)を地図の中央へ。検索から開いた場合など、
  // どの地域を見ていたか一目でわかるようにする。
  if (selectedRegionId) {
    const region = REGIONS.find((r) => r.id === selectedRegionId);
    if (region) map.easeTo({ center: [region.lng, region.lat], duration: 500 });
  }
  refreshMarkers();
}
function closeList() { navBack(); }

// ヘッダーの実高さをCSS変数に反映(ポップアップがヘッダーに被らないように)
const topbar = document.getElementById('topbar');
const syncTopbarH = () =>
  document.documentElement.style.setProperty('--topbar-h', `${topbar.offsetHeight}px`);
new ResizeObserver(syncTopbarH).observe(topbar);
syncTopbarH();

// キャンバスの描画停止(タブ非表示・リサイズ等)から復帰した際に必ず再描画する。
// あわせて他端末での変更(STREET NAME再生成や持ってる/ほしいの更新)も取り込む
// (起動時1回だけのプルだと、開きっぱなしの端末が追従できないため)
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) { map.resize(); map.triggerRepaint(); autoPullFavSync(); }
});
window.addEventListener('resize', () => map.resize());
window.addEventListener('pageshow', () => { map.resize(); map.triggerRepaint(); });
document.getElementById('mask').addEventListener('click', closeList);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeList(); });

const shareBtnHtml = `<button class="share" title="このページのリンクを共有">
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
    <circle cx="18" cy="5" r="3" fill="none" stroke="currentColor" stroke-width="2"/>
    <circle cx="6" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="2"/>
    <circle cx="18" cy="19" r="3" fill="none" stroke="currentColor" stroke-width="2"/>
    <line x1="8.7" y1="10.7" x2="15.3" y2="6.3" stroke="currentColor" stroke-width="2"/>
    <line x1="8.7" y1="13.3" x2="15.3" y2="17.7" stroke="currentColor" stroke-width="2"/>
  </svg>
</button>`;
const listHead = (title, sub, cnt, share = false) => `
  <div class="list-head">
    <h2>${title}</h2>
    <span class="sub">${sub}</span>
    <span class="cnt">${cnt}</span>
    ${share ? shareBtnHtml : ''}
    <button class="close" title="地図へ戻る">✕</button>
  </div>`;

// PWA(standalone表示)ではアドレスバーが無くURLを直接コピーできないため、
// 明示的な共有ボタンを用意する。対応環境ではWeb Share API、
// それ以外はクリップボードコピー+簡易トーストにフォールバックする。
function shareCurrentPage(title) {
  const url = location.href;
  if (navigator.share) {
    navigator.share({ title, url }).catch(() => {});
    return;
  }
  (navigator.clipboard?.writeText(url) || Promise.reject()).then(showShareToast).catch(() => {
    // クリップボードAPIが使えない環境向けの最終手段。prompt自体が
    // 使えない(一部の埋め込みWebView等)場合も静かに諦める
    try { window.prompt('このURLをコピーしてください', url); } catch { /* noop */ }
  });
}
function showShareToast() {
  const el = document.createElement('div');
  el.className = 'share-toast';
  el.textContent = t('linkCopied');
  document.body.appendChild(el);
  setTimeout(() => el.classList.add('show'));
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 300); }, 1800);
}

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
    ${listHead(region.name, region.area, `${list.length} ${t('discs')}`, true)}
    <div class="grid"></div>`;
  listEl.querySelector('.close').addEventListener('click', closeList);
  listEl.querySelector('.share').addEventListener('click', () => shareCurrentPage(region.name));
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
// iTunesにジャケ写が無い盤は、Discogsのリリース情報に載っていた画像
// (album.discogsArt、scripts/discogs_video_enrich.pyで埋める)にフォールバックする。
const artUrl = (e, size, album) => {
  if (e?.art) return e.art.replace('100x100bb', `${size}x${size}bb`);
  return album?.discogsArt || null;
};

function albumCard(album) {
  const card = document.createElement('div');
  card.className = 'album';
  const r = rarity(album);
  const e = enrichOf(album);
  const art = artUrl(e, 300, album);
  const artHtml = art
    ? `<div class="album-art has-img"><img src="${art}" alt="${album.title}" loading="lazy"></div>`
    : `<div class="album-art"><span>${t('notOn')}</span></div>`;

  const hasPreview = !!(e?.tracks || []).some((tr) => tr.preview) || youtubeIdsFor(album).length > 0;
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
  const discHash = region ? `#r/${encodeURIComponent(region.id)}/${album.id}` : undefined;
  navGoto(push ? 2 : navLevel, discHash);
  const art = artUrl(e, 600, album);
  const key = albumKey(album);
  const rerender = () => renderDisc(album, false);
  const tracks = e?.tracks || [];
  const hasPlayable = tracks.some((tr) => tr.preview) || youtubeIdsFor(album).length > 0;
  const playActionsHtml = hasPlayable
    ? `<button class="play-btn disc-play" title="このディスクを今すぐ再生">▶</button>
       <button class="tr-toggle play-d">${t('queueAll')}</button>`
    : '';

  listEl.innerHTML = `
    <div class="list-head">
      <button class="close back" title="一覧へ戻る">◀</button>
      <h2>${album.title}</h2>
      <span class="sub">${album.artist}${region ? ` / ${region.name}` : ''}</span>
      <span class="cnt">${album.year}</span>
      ${shareBtnHtml}
      <button class="close x" title="地図へ戻る">✕</button>
    </div>
    <div class="disc">
      <div class="disc-art">${art
        ? `<img src="${art}" alt="${album.title}">`
        : `<span>${t('notOn')}</span>`}</div>
      <div class="disc-side">
        <p class="m">${album.year} / ${album.label} / ${album.format || 'CD'}${
          e?.link ? ` / <a class="apple ext-link" href="${e.link}" target="_blank" rel="noopener">Apple Music ↗</a>` : ''}${
          album.discogsUrl ? ` / <a class="apple ext-link" href="${album.discogsUrl}" target="_blank" rel="noopener">Discogs ↗</a>` : ''}</p>
        <div class="disc-actions">
          <button class="tr-toggle have-d${favsHave.has(key) ? ' on' : ''}">${t('have')}</button>
          <button class="tr-toggle want-d${favsWant.has(key) ? ' on' : ''}">${t('want')}</button>
          ${playActionsHtml}
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
  listEl.querySelector('.share').addEventListener('click', () => shareCurrentPage(`${album.artist} - ${album.title}`));

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

  listEl.querySelector('.disc-play')?.addEventListener('click', () => playAlbum(album));
  listEl.querySelector('.play-d')?.addEventListener('click', () => enqueueAlbum(album));
  listEl.querySelector('.have-d').addEventListener('click', () => {
    toggleFav(favsHave, key); updateFavCount(); rerender();
  });
  listEl.querySelector('.want-d').addEventListener('click', () => {
    toggleFav(favsWant, key); updateFavCount(); rerender();
  });

  const tracksEl = listEl.querySelector('.tracks');
  tracks.forEach((t, i) => tracksEl.appendChild(trackRow(album, t, i, rerender)));
  // iTunesに1曲も無い盤は、YouTube代替行を曲リストと同じ見た目で足す
  // (Discogsに複数曲が個別に貼られていれば全て並べる。再生ボタンを押すと
  // playAlbum()経由でYouTube側が再生される)。
  if (!tracks.length) {
    youtubeIdsFor(album).forEach((vid) => tracksEl.appendChild(youtubeTrackRow(album, vid)));
    const fullId = fullAlbumIdFor(album);
    if (fullId) tracksEl.appendChild(fullAlbumLinkRow(fullId));
  }
}

// Full Album尺の動画は30秒プレビューにしても意味が無いので、再生ボタンは
// 付けずにYouTube側を直接開くリンクだけを曲リストの下に添える。
function fullAlbumLinkRow(vid) {
  const row = document.createElement('div');
  row.className = 'track yt-full';
  row.innerHTML = `<a class="ext-link" href="https://www.youtube.com/watch?v=${vid}" data-embed="https://www.youtube.com/embed/${vid}?autoplay=1" target="_blank" rel="noopener">Full Album [YouTube ↗]</a>`;
  return row;
}

// iTunesに試聴の無い盤のYouTube代替を、曲リストと統一した見た目の1行で表示する。
// タイトルはYouTube oEmbed(無料・キー不要)で取得し、届くまでは仮表示にしておく。
function youtubeTrackRow(album, vid) {
  const row = document.createElement('div');
  row.className = 'track';
  row.innerHTML = `
    <button class="tp" title="YouTubeで再生(30秒)">▶</button>
    <span class="no">YT</span>
    <span class="name">読込中…</span>`;
  row.querySelector('.tp').addEventListener('click', () => {
    const e = enrichOf(album);
    playSingle({ title: album.title, artist: album.artist, preview: null, youtube: vid, art: artUrl(e, 100, album), album });
  });
  const url = `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${vid}`)}&format=json`;
  fetch(url).then((res) => (res.ok ? res.json() : Promise.reject())).then((data) => {
    if (data?.title) row.querySelector('.name').textContent = data.title;
  }).catch(() => {
    // Discogsには載っているがYouTube側で削除/非公開になった動画。
    // 読込中のまま固まったり再生できないまま止まったりしないよう、
    // 行ごと無効化してキューに入らないようにする。
    row.querySelector('.name').textContent = '動画が見つかりません';
    row.querySelector('.tp').disabled = true;
    row.classList.add('yt-unavailable');
  });
  return row;
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
  // お気に入り画面を開いた瞬間(内部再描画ではなく実際に開いた時だけ)に
  // 他端末側の変更(STREET NAME再生成・持ってる/ほしいの更新)を取りに行く。
  // 従来はページ読み込み時とタブ復帰時にしか同期していなかったため、
  // アプリを開きっぱなしのまま他端末で名前を変えても、お気に入り画面を
  // 見るだけでは反映されなかった。
  if (push) autoPullFavSync();
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
document.getElementById('brandHome').addEventListener('click', () => {
  // location.reload()だと現在のURLハッシュ(#r/houston/2233等)がそのまま
  // 残るため、リロード後に同じ地域/ディスクが再度開いてしまいトップに
  // 戻れなかった。ハッシュを消してからリロードする。
  selectedRegionId = null;
  history.replaceState(null, '', location.pathname + location.search);
  location.reload();
});
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
    // 検索, ★, 投稿, 言語 の順になるよう、スタンプボタンの直前に差し込む
    document.getElementById('stampMenuBtn').before(submitB, langB);
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

  row.querySelector('.tp').addEventListener('click', () => {
    const e = enrichOf(album);
    playSingle({ title: track.name, artist: album.artist, preview: track.preview, youtube: null, art: artUrl(e, 100, album), album });
  });
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

// ---------- キューの永続化(リロードしても再生が「ゼロから」にならないように) ----------
// キューの中身そのもの(album等の巨大なオブジェクト)は保存せず、
// albumId+trackItemsOf内の何番目か、だけを保存して再構築する。
const QUEUE_KEY = 'gra.queue.v1';
function albumById(id) {
  for (const r of REGIONS) {
    const a = r.albums.find((x) => x.id === id);
    if (a) return a;
  }
  return null;
}
function saveQueue() {
  const items = queue.map((q) => (q.album ? { albumId: q.album.id, idx: q.idx ?? 0 } : null));
  const q = queue[cursor];
  // 直前が再生中だったか一時停止中だったかも記録する。リロード後、
  // 一時停止中だったのに問答無用で再生し始めてしまうのを防ぐため。
  const playing = q ? (q.youtube ? ytIsPlaying() : !audio.paused) : false;
  localStorage.setItem(QUEUE_KEY, JSON.stringify({ cursor, items, playing }));
}
// リロード直後: キューの構成とカーソル位置だけ復元し曲情報を表示する。
// 自動再生はブラウザの制約で通らないことが多く、鳴りっぱなしも望ましくないため、
// 現在曲を「▶を押せばすぐ鳴る」状態(試聴はsrcセット、YouTubeはcue)まで
// 準備した上で一時停止のまま待つ。
function restoreQueue() {
  let saved;
  try { saved = JSON.parse(localStorage.getItem(QUEUE_KEY) || 'null'); } catch { saved = null; }
  if (!saved || !Array.isArray(saved.items) || !saved.items.length) return;
  const restored = [];
  for (const it of saved.items) {
    if (!it) continue;
    const album = albumById(it.albumId);
    if (!album) continue;
    const item = trackItemsOf(album)[it.idx];
    if (item) restored.push(item);
  }
  if (!restored.length) return;
  queue = restored;
  cursor = Math.max(0, Math.min(saved.cursor, queue.length - 1));
  const q = queue[cursor];
  const wasPlaying = !!saved.playing;
  if (q?.preview) {
    audio.src = q.preview;
    if (wasPlaying) {
      // 直前が再生中だった場合のみ自動再生を試す。ブラウザに拒否されても
      // (その場合は▶待ちの一時停止状態になるだけで無害)、過去にこのサイトで
      // 再生操作をしたことがあるブラウザでは許可されることが多い。
      // 逆に直前が一時停止中だったなら、リロードしただけで鳴り出すのは
      // 望ましくないため何もしない。
      audio.play().catch(() => {});
    }
  } else if (q?.youtube) {
    loadYtVideo(q.youtube, !wasPlaying); // 再生中だった時だけ自動再生、それ以外はcueのみ
  }
  paint();
}

const $title = document.getElementById('playerTitle');
const $artist = document.getElementById('playerArtist');
const $count = document.getElementById('queueCount');
const $art = document.querySelector('.player-art');
const $play = document.getElementById('playBtn');

// 試聴は1曲30秒しかないので曲単位のキュー管理はせず、試聴のある曲だけを
// 並べたフラットなキューを再生位置(cursor)を軸に組み立てる。
// キューの「続き」は地域末尾まで来るたびに次のアルバムを都度継ぎ足す
// 遅延方式(next()参照)。地域全体を毎回事前展開すると巨大な配列になるため。
// iTunesに1曲も無い盤の代替動画IDを解決する。優先順(ユーザー指示):
// iTunes → YouTube Data API検索結果(youtube.js、"full album"クエリで
// 狙い撃ちしているため精度が高い) → Discogsのリリース情報に載っていた
// リンク(album.youtubeId、投稿者任せなので精度は劣るがAPI消費ゼロ)。
function youtubeIdsFor(album) {
  if (Array.isArray(album.youtubeIds) && album.youtubeIds.length) return album.youtubeIds;
  return album.youtubeId ? [album.youtubeId] : [];
}

// Full Album尺の動画はリンク（外部再生）のみ。youtube.js(検索クエリが
// "full album"固定)のヒットは常にフルアルバムなのでこちら扱い。
function fullAlbumIdFor(album) {
  const key = `${album.artist}|${album.title}`;
  return (typeof YOUTUBE !== 'undefined' ? YOUTUBE[key] : null) || album.youtubeFullAlbumId || null;
}

function trackItemsOf(album) {
  const e = enrichOf(album);
  const art = artUrl(e, 100, album);
  const itunesTracks = (e?.tracks || []).filter((tr) => tr.preview)
    .map((tr) => ({ title: tr.name, artist: album.artist, preview: tr.preview, youtube: null, art, album }));
  const items = itunesTracks.length ? itunesTracks : (() => {
    const vids = youtubeIdsFor(album);
    if (!vids.length) return [];
    return vids.map((vid) => ({ title: album.title, artist: album.artist, preview: null, youtube: vid, art, album }));
  })();
  items.forEach((it, i) => { it.idx = i; }); // キュー復元時にtrackItemsOfの何番目かを特定するため
  return items;
}

// 既にキューに入っているアルバムの最初の位置(無ければ-1)。
// 連打で同じアルバムが何度もキューに積まれるのを防ぐために使う。
function albumQueueIndex(album) {
  return queue.findIndex((item) => item.album === album);
}

// 通常の▶(アルバムカード/曲行): 今の再生位置に差し込んで即座に頭出しする。
// 再生中だった残りのキューはキューから消さず、差し込んだ分だけ後ろへスライドする。
function playAlbum(album, startIndex = 0) {
  const existing = albumQueueIndex(album);
  if (existing !== -1) {
    // 既にキューにあるなら重複追加せず、その位置から再生し直すだけにする。
    const itemsLen = trackItemsOf(album).length || 1;
    cursor = existing + Math.max(0, Math.min(startIndex, itemsLen - 1));
    playCurrent();
    return;
  }
  const items = trackItemsOf(album);
  const insertPos = Math.max(cursor, 0);
  if (!items.length) {
    // 試聴が1曲も無い盤(激レア盤): 情報表示だけのプレースホルダーを差し込む
    queue.splice(insertPos, 0, { title: album.title, artist: album.artist, preview: null, art: null, album });
    cursor = insertPos;
    playCurrent();
    return;
  }
  queue.splice(insertPos, 0, ...items);
  cursor = insertPos + Math.min(startIndex, items.length - 1);
  playCurrent();
}

// 単曲の▶: アルバム全曲をキューに積まず、その1曲だけを今の再生位置に差し込む。
function playSingle(item) {
  const insertPos = Math.max(cursor, 0);
  queue.splice(insertPos, 0, item);
  cursor = insertPos;
  playCurrent();
}

// 「▶ 全曲キューニ入レル」: 今の再生を止めず、キューの末尾に足すだけ。
// 何も再生していなければ即再生と同じ(先頭に差し込むのと変わらない)。
function enqueueAlbum(album) {
  if (!queue.length) { playAlbum(album); return; }
  if (albumQueueIndex(album) !== -1) return; // 既にキュー済みなら何もしない(連打対策)
  const items = trackItemsOf(album);
  if (!items.length) return; // 試聴の無い盤は積んでも仕方ないので何もしない
  queue.push(...items);
  paint();
}

// ---------- YouTube IFrame Player(iTunesに試聴の無い盤の代替再生用) ----------
// #ytHost は1x1px・opacity:0の非表示ホスト(style.css)。映像は見せず音声だけ
// 使う。iTunes試聴とテンポを揃えるため30秒で打ち切る(endSeconds)。
let ytPlayer = null, ytReady = false, ytPendingId = null, ytPendingCueOnly = false;
function initYtPlayer() {
  if (ytPlayer) return;
  ytPlayer = new YT.Player('ytHost', {
    height: '1', width: '1',
    playerVars: { controls: 0, disablekb: 1, playsinline: 1 },
    events: {
      onReady: () => {
        ytReady = true;
        if (ytPendingId) { const id = ytPendingId; const cue = ytPendingCueOnly; ytPendingId = null; loadYtVideo(id, cue); }
      },
      onStateChange: (e) => {
        if (e.data === YT.PlayerState.ENDED) next();
        paint();
      },
    },
  });
}
window.onYouTubeIframeAPIReady = initYtPlayer;
// 本番環境では上のコールバックがAPI側から呼ばれないことがある(原因不明の
// タイミング問題)ため、YT.Playerが使えるようになり次第自前でポーリングして
// 初期化する保険を掛ける(コールバックが正常に来た場合は初期化済みなので
// initYtPlayer側のif (ytPlayer) returnで二重初期化を防ぐ)。
(function pollYtApi() {
  if (ytPlayer) return;
  if (window.YT && window.YT.Player) { initYtPlayer(); return; }
  setTimeout(pollYtApi, 300);
})();
// cueOnly=true だと読み込むだけで再生開始しない(リロード直後のキュー復元用。
// loadVideoByIdは即再生してしまうため、ユーザーが▶を押すまで待つ場合はcueVideoByIdを使う)。
function loadYtVideo(videoId, cueOnly = false) {
  if (!ytReady) { ytPendingId = videoId; ytPendingCueOnly = cueOnly; return; }
  ytPlayer[cueOnly ? 'cueVideoById' : 'loadVideoById']({ videoId, startSeconds: 0, endSeconds: 30 });
}
function ytIsPlaying() {
  return !!(ytReady && ytPlayer.getPlayerState && ytPlayer.getPlayerState() === YT.PlayerState.PLAYING);
}

function playCurrent() {
  const q = queue[cursor];
  if (q?.preview) {
    if (ytReady) ytPlayer.stopVideo();
    audio.src = q.preview;
    audio.play().catch(() => {}); // 自動再生ブロック時はユーザーの▶待ち
  } else if (q?.youtube) {
    audio.pause(); audio.removeAttribute('src');
    loadYtVideo(q.youtube);
  } else {
    audio.pause(); audio.removeAttribute('src');
    if (ytReady) ytPlayer.stopVideo();
  }
  paint();
}

// Media Session API: ロック画面/通知領域の再生コントロールとバックグラウンド再生に対応。
// 曲が変わるたびにメタデータを更新し、OS側の▶⏸/前後ボタンをこちらの操作につなぐ。
if ('mediaSession' in navigator) {
  navigator.mediaSession.setActionHandler('play', () => {
    const q = queue[cursor];
    if (q?.preview) audio.play().catch(() => {});
    else if (q?.youtube && ytReady) ytPlayer.playVideo();
  });
  navigator.mediaSession.setActionHandler('pause', () => {
    audio.pause();
    if (ytReady) ytPlayer.pauseVideo();
  });
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
  navigator.mediaSession.playbackState = (q.youtube ? ytIsPlaying() : !audio.paused) ? 'playing' : 'paused';
}

function paint() {
  const q = queue[cursor];
  saveQueue();
  $count.textContent = `${Math.max(0, queue.length - Math.max(cursor, 0))} 曲`;
  $play.textContent = (q?.youtube ? ytIsPlaying() : !audio.paused) ? '⏸' : '▶';
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
    : q.youtube
      ? `${q.artist} — ${cursor + 1}/${queue.length} (YouTube)`
      : `${q.artist} — ${t('noAudio')}`;
  $art.innerHTML = q.art ? `<img src="${q.art}" alt="">` : '♪';
}

// キューがまだ残っていればそのまま進む。尽きたら、直前まで再生していた
// 曲のアルバムが属する地域から「次のアルバム」を並び順ベースで継ぎ足して
// 続ける(試聴の無いアルバムは飛ばす)。地域の末尾まで来たら自然に停止する。
function next() {
  if (cursor < queue.length - 1) { cursor++; playCurrent(); return; }
  const lastAlbum = queue[queue.length - 1]?.album;
  const region = lastAlbum && REGIONS.find((r) => r.albums.includes(lastAlbum));
  if (region) {
    const albums = albumsOf(region).slice().sort((a, b) => a.year - b.year);
    const pos = albums.indexOf(lastAlbum);
    for (let i = pos + 1; i < albums.length; i++) {
      const items = trackItemsOf(albums[i]);
      if (items.length) {
        queue.push(...items);
        cursor++;
        playCurrent();
        return;
      }
    }
  }
  paint();
}
function prev() { if (cursor > 0) { cursor--; playCurrent(); } }

audio.addEventListener('play', paint);
audio.addEventListener('pause', paint);
document.getElementById('nextBtn').addEventListener('click', next);
document.getElementById('prevBtn').addEventListener('click', prev);
$play.addEventListener('click', () => {
  const q = queue[cursor];
  if (q?.preview) {
    audio.paused ? audio.play().catch(() => {}) : audio.pause();
  } else if (q?.youtube && ytReady) {
    ytIsPlaying() ? ytPlayer.pauseVideo() : ytPlayer.playVideo();
  }
});
document.querySelector('.player-now').addEventListener('click', () => {
  const album = queue[cursor]?.album;
  if (!album) return;
  // 地図に戻った後も連続再生は続くので、そこからプレイヤーバーを押すと
  // 一覧が一段も開いていない(navLevel 0)ことがある。
  // その状態からいきなりディスク詳細を開くと #list に body.detail が
  // 付かないままになり、描画はされてもopacity:0で操作できなくなる。
  // 地域一覧を経由させて階層とdetailクラスを正しく積み直す。
  if (navLevel === 0) {
    const region = REGIONS.find((r) => r.albums.includes(album));
    if (region) openRegion(region, true);
  }
  renderDisc(album);
});
document.getElementById('clearQueue').addEventListener('click', () => {
  queue = []; cursor = -1;
  audio.pause(); audio.removeAttribute('src');
  if (ytReady) ytPlayer.stopVideo();
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
  listEl.innerHTML = `
    ${listHead(t('submitTitle'), t('submitSub'), '')}
    <form class="submit-form">
      <label>${t('fUrl')}<input name="url" type="url" maxlength="500" required placeholder="https://..."></label>
      <p class="form-note">${t('fUrlHint')}</p>
      <label>${t('fArtistOpt')}<input name="artist" maxlength="120"></label>
      <label>${t('fTitleOpt')}<input name="title" maxlength="200"></label>
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
      url: (f.get('url') || '').trim(),
      artist: (f.get('artist') || '').trim() || null,
      title: (f.get('title') || '').trim() || null,
      comment: (f.get('comment') || '').trim() || null,
    };
    if (!body.url) { msg.textContent = t('needFields'); return; }
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
restoreQueue();
applyLang();
loadSharedStamps();
autoPullFavSync();

refreshMarkers();
map.on('load', () => { map.resize(); refreshMarkers(); });

// 共有リンク(#r/<地域ID>または#r/<地域ID>/<artist|title>)を開いたときの復元
(function openFromHash() {
  const h = location.hash.slice(1);
  if (!h.startsWith('r/')) return;
  const [regionId, discId] = h.slice(2).split('/');
  const region = REGIONS.find((r) => r.id === decodeURIComponent(regionId));
  if (!region) return;
  openRegion(region);
  if (discId != null) {
    const album = resolveDiscShareId(region, discId);
    if (album) setTimeout(() => renderDisc(album), 460);
  }
})();

// PWAとしてインストール可能にするための最小Service Worker登録
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}
