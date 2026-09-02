/* GANGSTA RAP ATLAS — プロトタイプ
 * ユーザースタンプは localStorage(本番は Supabase 等に差し替え) */

// ---------- 言語(JA/EN) ----------
const I18N = {
  ja: {
    sub: '地図カラ掘ル、地域別ディスコグラフィ',
    intro: '撃チ込メ ─ 地図ヲ クリック',
    releases: 'RELEASES', discs: 'DISCS',
    favs: 'MY FAVS', favSub: 'お気に入りディスク',
    have: '持ッテル', want: 'ホシイ', nope: 'イラナイ',
    autoplayExclude: 'シャッフル・自動再生カラ除外:',
    haveSection: '持ッテルディスク', wantSection: 'ホシイディスク', stampedSection: '自分ガチェックした曲', stamp: 'スタンプ',
    exportCsv: '⬇ CSV保存', importCsv: '⬆ CSV読込',
    importOk: (n) => `${n}件反映シタ`, importNone: '一致スルディスクガナカッタ',
    favEmpty: 'まだ空。ディスクの☆を押して集めよう。',
    stampedEmpty: 'まだ空。曲にスタンプを押すとここに並ぶ。',
    sortBy: '並び順', sortAdded: '追加順', sortRegion: '地域ごと', sortArtist: 'アーティスト順',
    noMatch: 'この絞り込みに合うリリースはありません。',
    rarity: '発掘度',
    notOn: 'NOT ON<br>STREAMING<br>─ 激レア ─',
    queueAll: '＋ キューニ追加',
    qEmptyT: '再生キューハ空', qEmptyA: 'アルバムノ ▶ ヲ押ストキューニ入ル',
    noAudio: '試聴音源ナシ(激レア)',
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
    filterHint: 'こちらから他のユーザーがスタンプしたDISCを検索できます。曲探しの情報源になりますので＋ボタンをClickしてスタンプにご協力ください。',
    histTitle: '再生履歴',
    histEmpty: 'まだ空。曲を再生するとここに並ぶ。',
    histClear: '履歴ト再生済ミヲクリア',
    histClearConfirm: 'クリアスルト再生済ミノ盤ガマタシャッフルニ登場スルヨウニナル。ヨロシイ？',
    clearQueueConfirm: '再生キューヲ空ニスル。ヨロシイ？(再生済ミノ記録ハ残ル)',
    qTabQueue: 'キューリスト', qTabHist: '再生履歴',
    qNoteItems: [
      'キューの曲が少なくなると、同じ地域・絞り込み条件の盤をランダムに自動追加します(「自動」印)。',
      '手動で追加した盤は、自動追加分より先に再生されます。',
      '一度再生した盤は、自動追加されなくなります。',
    ],
    qAutoTag: '自動',
    histNoteItems: [
      '直近50曲の再生履歴です。',
      '再生履歴をクリアすると、これまでに再生したDISCが再びランダムに自動追加されるようになります。',
    ],
    qCount: (n) => `${n} 曲`,
    regionShuffleConfirm: 'イマノ再生キューヲ破棄シテ、コノ地域ノシャッフルヲ始メル。ヨロシイ？',
    dlgOk: 'ヨロシイ', dlgCancel: 'ヤメル',
  },
  en: {
    sub: 'DIG THE MAP — REGIONAL DISCOGRAPHIES',
    intro: 'SHOOT THE MAP — CLICK A CITY',
    releases: 'RELEASES', discs: 'DISCS',
    favs: 'MY FAVS', favSub: 'Favorite discs',
    have: 'HAVE', want: 'WANT', nope: 'NOPE',
    autoplayExclude: 'Exclude from shuffle/autoplay:',
    haveSection: 'Discs I have', wantSection: 'Discs I want', stampedSection: 'Tracks I stamped', stamp: 'Stamps',
    exportCsv: '⬇ Export CSV', importCsv: '⬆ Import CSV',
    importOk: (n) => `${n} matched and applied`, importNone: 'No matching discs found',
    favEmpty: 'Empty. Hit ☆ on a disc to collect.',
    stampedEmpty: 'Empty. Stamp a track to see it here.',
    sortBy: 'Sort', sortAdded: 'Date added', sortRegion: 'By region', sortArtist: 'By artist',
    noMatch: 'No releases match this filter.',
    rarity: 'DIG LEVEL',
    notOn: 'NOT ON<br>STREAMING<br>─ RARE ─',
    queueAll: '＋ ADD TO QUEUE',
    qEmptyT: 'QUEUE IS EMPTY', qEmptyA: 'Hit ▶ on a disc to queue it',
    noAudio: 'No preview audio (rare!)',
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
    filterHint: 'Use these to search discs other users have stamped. It helps everyone dig up new tracks, so click the ＋ button to add your own.',
    histTitle: 'PLAY HISTORY',
    histEmpty: 'Empty. Play a track to see it here.',
    histClear: 'Clear history & played discs',
    histClearConfirm: 'Cleared discs will start showing up in shuffle again. Continue?',
    clearQueueConfirm: 'Empty the play queue? (Played discs stay recorded)',
    qTabQueue: 'QUEUE', qTabHist: 'PLAY HISTORY',
    qNoteItems: [
      'When the queue runs low, random discs matching the same region and filters are added automatically ("AUTO" tag).',
      'Discs you add manually play before the auto-added ones.',
      'Discs you have already played are no longer auto-added.',
    ],
    qAutoTag: 'AUTO',
    histNoteItems: [
      'Your last 50 played tracks.',
      'Clearing the history lets previously played discs be auto-added again.',
    ],
    qCount: (n) => `${n} TRACKS`,
    regionShuffleConfirm: 'Discard the current queue and start shuffling this region. Continue?',
    dlgOk: 'OK', dlgCancel: 'CANCEL',
  },
};
let lang = localStorage.getItem('gra.lang') || 'ja';
const t = (k) => I18N[lang][k];
const stampName = (s) => (lang === 'ja' ? s.label : s.en.toUpperCase());
const tagName = (tg) => (lang === 'ja' ? tg.label : tg.en);

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

// YouTube動画のタイトルはoEmbedで非同期に解決するまで曲名が分からないため、
// 判明したものを{videoId: title}でキャッシュしておく。再生バーにアルバム名
// ではなく実際の曲名を出すために、キューに積む時・オーバーレイなしで
// 再生する時のどちらでも参照する。
// リロードしても曲名が消えないようlocalStorageに永続化する。以前はメモリ上
// だけだったため、再読み込みするとYouTube盤の全曲が「アルバム名」表示に戻り、
// キューリストに同じ名前がずらっと並ぶ見え方になっていた(実際に指摘された)。
const YT_TITLE_KEY = 'gra.ytTitles.v1';
const ytTitleCache = (() => {
  try { return JSON.parse(localStorage.getItem(YT_TITLE_KEY) || '{}') || {}; } catch { return {}; }
})();
let ytTitleSaveTimer = null;
function setYtTitle(vid, title) {
  if (!vid || !title || ytTitleCache[vid] === title) return;
  ytTitleCache[vid] = title;
  clearTimeout(ytTitleSaveTimer);
  ytTitleSaveTimer = setTimeout(() => {
    try {
      let entries = Object.entries(ytTitleCache);
      if (entries.length > 800) entries = entries.slice(entries.length - 800); // 際限なく肥大させない
      localStorage.setItem(YT_TITLE_KEY, JSON.stringify(Object.fromEntries(entries)));
    } catch { /* 容量超過等は諦める(表示用キャッシュなので実害なし) */ }
  }, 500);
}
// 未解決のYouTube曲名をoEmbedで引く(成功したらキャッシュにも保存)
function fetchYtTitle(vid) {
  const url = `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${vid}`)}&format=json`;
  return fetch(url).then((r) => (r.ok ? r.json() : null)).then((d) => {
    if (d?.title) { setYtTitle(vid, d.title); return d.title; }
    return null;
  }).catch(() => null);
}

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
    refreshActiveListView();
    // 絞り込みパネルの件数(globalStampCount/globalTagCount)はSHARED依存なので、
    // 読み込み完了後に作り直さないと0のまま表示され続けてしまう
    buildFilterBar();
    buildTagBar();
  } catch { /* オフラインでもローカルだけで動く */ }
}

// サーバー側は(client_id, target_key)ごとに1行だけを持ち、stamp_idは
// UPSERTで上書きする(スタンプの切り替え=前の分の自動退場)。
// このクライアントが最後にサーバーへ記録した値をローカルに覚えておき、
// 同じ値を再送してもクライアント側の表示だけ余計に加点しないようにする
// (以前はA→B→Aと切り替えるたびに毎回+1され、点数を稼げてしまっていた)。
const SERVER_STAMP_KEY = 'gra.serverstamp.v1';
const myServerStamp = JSON.parse(localStorage.getItem(SERVER_STAMP_KEY) || '{}'); // { key: stampId }
const saveServerStamp = () => localStorage.setItem(SERVER_STAMP_KEY, JSON.stringify(myServerStamp));

function bumpShared(key, id) {
  const prev = myServerStamp[key];
  if (prev === id) return; // サーバーには既にこの値を記録済み
  if (prev && SHARED[key]?.[prev]) SHARED[key][prev] = Math.max(0, SHARED[key][prev] - 1);
  (SHARED[key] ||= {})[id] = (SHARED[key]?.[id] || 0) + 1;
  myServerStamp[key] = id;
  saveServerStamp();
  // UPSERT: (client_id, target_key)が既にあれば上書き、無ければ新規作成
  // (on_conflict方式はSELECT権限が必要になり、生データ公開につながるため使わない)
  fetch(`${SB_URL}/stamps`, {
    method: 'POST',
    headers: { ...SB_HEADERS, Prefer: 'resolution=merge-duplicates,return=minimal' },
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
// スタンプは1曲/1盤につき1個だけ(印象がブレるため複数掛けは不可)。
// 別スタンプを選ぶと前の分は自分の記録から外れる(取り消しはローカルのみ、共有集計には残る)。
// Street Name経由でfav_syncにも積んで他端末の「自分がチェックした曲」一覧として同期する。
function toggleStampAt(key, id) {
  const cur = myStamps[key] || (myStamps[key] = []);
  const i = cur.indexOf(id);
  if (i >= 0) {
    cur.splice(i, 1);
  } else {
    cur.length = 0;
    cur.push(id);
    bumpShared(key, id); // みんなの集計へ反映
  }
  if (!cur.length) delete myStamps[key];
  saveStamps();
  pushFavSync();
}

// ディスクの表示合計 = レビュー実測シード + みんなのスタンプ集計(ディスク+収録曲)
// stampSeed は seedSrc(出典URL群)を持つアルバムのみ有効。
// 出典なしのシードは推定値なのでカウントしない(実測データが揃い次第 seedSrc 付きで再生成される)
function stampCount(album, id) {
  const key = albumKey(album);
  const seed = (album.seedSrc?.length ? album.stampSeed?.[id] : 0) || 0;
  let n = seed + (SHARED[key]?.[id] || 0);
  (enrichOf(album)?.tracks || []).forEach((tr) => { n += SHARED[trackKey(album, tr.name)]?.[id] || 0; });
  youtubeIdsFor(album).forEach((vid) => { n += SHARED[trackKey(album, `yt:${vid}`)]?.[id] || 0; });
  // 共有集計に未反映のローカル分(オフライン時)を補完
  if (!SHARED[key]?.[id] && stampsAt(key).includes(id)) n += 1;
  return n;
}
const totalStamps = (a) => STAMPS.reduce((n, s) => n + stampCount(a, s.id), 0);
const hasStamp = (a, id) => stampCount(a, id) > 0;

// ---------- サウンドタグ(トークボックス/ネタモノ)の+1/-1投票 ----------
// ムードスタンプは「印象」なので加算オンリーの集計でよかったが、タグは
// 「トークボックスかどうか」のような客観的な正解がある情報なので、
// 間違ったチェックを他の人が後から訂正できるようにネットスコア方式にする。
// 各ユーザーは1曲/1タグにつき+1(チェック)か-1(訂正で解除)のどちらか1票を
// 持ち、あとから投票し直せる(スタンプと違い1人1回きりの加算ではない)。
// 誰も投票していない/自分が未投票の曲は集計(net>0か)を初期値として見せる。
// 自分が能動的に「違う」と判断して外した場合は、その意思をmyTagVotesに
// ローカル保存して優先する(集計側が後で正に転じても自分の画面には
// 引きずられない)。
//
// サーバー側はSupabaseの tag_votes テーブル(client_id+target_key+tag_id が
// 主キーのUPSERT)+ tag_scores ビュー(SUM(value))。タグの種類を
// テーブル側に決め打ちしていないため、TAGSに新しい種類を増やすだけで
// このまま使い回せる。
const TAG_SCORES = {}; // { key: { tagId: net } } サーバー取得値をこのセッション中は投票のたびに直接書き換える(楽観的更新)
async function loadTagScores() {
  try {
    const res = await fetch(`${SB_URL}/tag_scores?select=target_key,tag_id,net`, { headers: SB_HEADERS });
    if (!res.ok) return;
    (await res.json()).forEach((r) => { (TAG_SCORES[r.target_key] ||= {})[r.tag_id] = r.net; });
    // 過去にサーバーへ送れていなかった投票(tag_votesテーブル未作成/権限不足
    // だった間に押した分など)だけを送り直す。送信成功済みのものは
    // tagVotesSyncedに記録済みなので、毎回全部を再送して重くなることはない。
    Object.entries(myTagVotes).forEach(([key, votes]) => {
      Object.entries(votes).forEach(([tagId, value]) => {
        if (!tagVotesSynced.has(`${key}::${tagId}::${value}`)) pushTagVote(key, tagId, value);
      });
    });
    refreshMarkers();
    buildFilterBar();
    buildTagBar();
    refreshActiveListView();
  } catch { /* オフラインでもローカルだけで動く */ }
}

const TAG_VOTES_KEY = 'gra.tagvotes.v1';
const myTagVotes = JSON.parse(localStorage.getItem(TAG_VOTES_KEY) || '{}'); // { key: { tagId: 1|-1 } }
const saveTagVotes = () => localStorage.setItem(TAG_VOTES_KEY, JSON.stringify(myTagVotes));
const myTagVote = (key, id) => myTagVotes[key]?.[id] ?? null;
const netTagScore = (key, id) => TAG_SCORES[key]?.[id] || 0;
// このタグのチェックボックスを今どちらで表示すべきか。
// 自分が投票済みならそれを優先、未投票ならみんなの集計(net>0か)に従う。
const tagChecked = (key, id) => {
  const mine = myTagVote(key, id);
  return mine != null ? mine === 1 : netTagScore(key, id) > 0;
};

// サーバーへの送信に成功済みの投票の記録(key::tagId::value)。
// 値が変わった場合は別のledgerKeyになるので、投票し直した時はちゃんと再送される。
const TAG_SYNCED_KEY = 'gra.tagvotessynced.v1';
const tagVotesSynced = new Set(JSON.parse(localStorage.getItem(TAG_SYNCED_KEY) || '[]'));
const saveTagSynced = () => localStorage.setItem(TAG_SYNCED_KEY, JSON.stringify([...tagVotesSynced]));

async function pushTagVote(key, id, value) {
  try {
    const res = await fetch(`${SB_URL}/tag_votes`, {
      method: 'POST',
      headers: { ...SB_HEADERS, Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify({ client_id: CLIENT_ID, target_key: key, tag_id: id, value }),
    });
    if (res.ok) { tagVotesSynced.add(`${key}::${id}::${value}`); saveTagSynced(); }
  } catch { /* オフラインならまた次回の起動時に再送される */ }
}

function castTagVote(key, id, value) {
  const prev = myTagVote(key, id) || 0;
  if (prev === value) return;
  (TAG_SCORES[key] ||= {})[id] = (TAG_SCORES[key]?.[id] || 0) + (value - prev);
  (myTagVotes[key] ||= {})[id] = value;
  saveTagVotes();
  pushTagVote(key, id, value);
}

// ディスク全体(曲データがあれば全曲のいずれか)で、このタグがnet>0で
// 確定しているか。フィルターの「該当あり」判定に使う(件数の合算ではなく
// 「1つでも確定曲があるか」の真偽値)。
function albumHasTag(album, id) {
  const key = albumKey(album);
  if (netTagScore(key, id) > 0) return true;
  if ((enrichOf(album)?.tracks || []).some((tr) => netTagScore(trackKey(album, tr.name), id) > 0)) return true;
  return youtubeIdsFor(album).some((vid) => netTagScore(trackKey(album, `yt:${vid}`), id) > 0);
}

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

// ---------- お気に入り(ディスク単位) — 持ってる/ほしい/いらない の3系統 ----------
const HAVE_KEY = 'gra.favs.have.v1';
const WANT_KEY = 'gra.favs.want.v1';
// いらない = このアルバムはもう流れてこなくていい、の意思表示。
// 一覧からは消さず薄く表示し、シャッフル・自動継ぎ足しの対象から外す
// (外すかどうか自体はドロワーの自動再生除外設定で切り替えられる)。
const NOPE_KEY = 'gra.favs.nope.v1';
// 旧・単一★お気に入り(gra.favs.v1)は「持ってる」として引き継ぐ
const legacyFavs = JSON.parse(localStorage.getItem('gra.favs.v1') || 'null');
const favsHave = new Set(legacyFavs || JSON.parse(localStorage.getItem(HAVE_KEY) || '[]'));
const favsWant = new Set(JSON.parse(localStorage.getItem(WANT_KEY) || '[]'));
const favsNope = new Set(JSON.parse(localStorage.getItem(NOPE_KEY) || '[]'));
if (legacyFavs) { localStorage.setItem(HAVE_KEY, JSON.stringify([...favsHave])); localStorage.removeItem('gra.favs.v1'); }

const saveFavs = () => {
  localStorage.setItem(HAVE_KEY, JSON.stringify([...favsHave]));
  localStorage.setItem(WANT_KEY, JSON.stringify([...favsWant]));
  localStorage.setItem(NOPE_KEY, JSON.stringify([...favsNope]));
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

// 粗い地域情報(国レベル)。IPは使わず、ブラウザのタイムゾーンと言語設定のみ。
// どの国で使われているかの集計用で、匿名のStreet Nameにしか紐づかない。
function geoHintFields() {
  try {
    return {
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
      locale: navigator.language || '',
    };
  } catch { return { tz: '', locale: '' }; }
}
// 1日1回、既存行のtz/localeを最新化する(行作成時にも入るが、
// キュー同期しか使わない人や引っ越した端末も拾えるように)
async function pushGeoHint() {
  if (!streetName) return;
  const today = new Date().toISOString().slice(0, 10);
  if (localStorage.getItem('gra.geoHint.day') === today) return;
  try {
    const res = await fetch(`${SB_URL}/fav_sync?gangsta_name=eq.${encodeURIComponent(streetName)}`, {
      method: 'PATCH',
      headers: { ...SB_HEADERS, Prefer: 'return=minimal' },
      body: JSON.stringify(geoHintFields()),
    });
    // 列のマイグレーション未実施(400)でも静かに諦めるだけで実害なし
    if (res.ok) localStorage.setItem('gra.geoHint.day', today);
  } catch { /* オフライン時は翌回に */ }
}

// DBのunique制約が衝突を弾く(重複登録の防止だけが目的。衝突自体は稀で許容)
async function reserveStreetName(name) {
  try {
    let res = await fetch(`${SB_URL}/fav_sync`, {
      method: 'POST',
      headers: { ...SB_HEADERS, Prefer: 'return=minimal' },
      body: JSON.stringify({ gangsta_name: name, have: [...favsHave], want: [...favsWant], nope: [...favsNope], eras: [...eraFilters], mystamps: myStamps, ...geoHintFields() }),
    });
    if (res.status === 400) {
      // mystamps列のマイグレーション未実施のDBへのフォールバック
      res = await fetch(`${SB_URL}/fav_sync`, {
        method: 'POST',
        headers: { ...SB_HEADERS, Prefer: 'return=minimal' },
        body: JSON.stringify({ gangsta_name: name, have: [...favsHave], want: [...favsWant], eras: [...eraFilters] }),
      });
    }
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
      body: JSON.stringify({ have: [...favsHave], want: [...favsWant], nope: [...favsNope], eras: [...eraFilters], mystamps: myStamps, updated_at: new Date().toISOString() }),
    });
    if (!res.ok) {
      // nope/mystamps/eras列のマイグレーション未実施のDBでもhave/want同期は壊さない
      const res2 = await fetch(`${SB_URL}/fav_sync?gangsta_name=eq.${encodeURIComponent(streetName)}`, {
        method: 'PATCH',
        headers: { ...SB_HEADERS, Prefer: 'return=minimal' },
        body: JSON.stringify({ have: [...favsHave], want: [...favsWant], eras: [...eraFilters], updated_at: new Date().toISOString() }),
      });
      if (!res2.ok) {
        await fetch(`${SB_URL}/fav_sync?gangsta_name=eq.${encodeURIComponent(streetName)}`, {
          method: 'PATCH',
          headers: { ...SB_HEADERS, Prefer: 'return=minimal' },
          body: JSON.stringify({ have: [...favsHave], want: [...favsWant], updated_at: new Date().toISOString() }),
        });
      }
    }
  } catch { /* オフラインでもローカルは正常に動く */ }
}

async function pullFavSync(name) {
  let res = await fetch(`${SB_URL}/fav_sync?gangsta_name=eq.${encodeURIComponent(name)}&select=have,want,nope,eras,mystamps`, { headers: SB_HEADERS });
  if (!res.ok) {
    // nope/mystamps列のマイグレーション未実施のDBへのフォールバック
    res = await fetch(`${SB_URL}/fav_sync?gangsta_name=eq.${encodeURIComponent(name)}&select=have,want,eras`, { headers: SB_HEADERS });
  }
  if (!res.ok) {
    // eras列のマイグレーション未実施のDBへのフォールバック
    res = await fetch(`${SB_URL}/fav_sync?gangsta_name=eq.${encodeURIComponent(name)}&select=have,want`, { headers: SB_HEADERS });
  }
  if (!res.ok) return null;
  const rows = await res.json();
  return rows[0] || null;
}

// admin/review.html(非公開のレビューツール)で「地図に公開」されたリリースを
// 読み足す。data.js自体は書き換えず、REGIONSへその場でpush()して重ねるだけ
// なので、レビューでの追加はgit commit無しに即座に地図へ反映される。
// 既存の地図データと衝突しないよう、公開リリースのidには大きなオフセットを足す
// (このオフセット未満は将来もdata.js側の採番として使い続ける想定)。
const PUBLISHED_ID_OFFSET = 1000000;
// PostgRESTは1回のリクエストにつき最大1000行しか返さない(応答を切り詰めて
// 返すだけでエラーにはならないため気づきにくい)。件数がそれを超えたら
// 静かに新しい分から欠落するので、Rangeヘッダーでページ送りして全件取得する。
async function fetchAllRows(url) {
  const rows = [];
  const PAGE = 1000;
  for (let offset = 0; ; offset += PAGE) {
    const res = await fetch(url, {
      headers: { ...SB_HEADERS, Range: `${offset}-${offset + PAGE - 1}` },
    });
    if (!res.ok && res.status !== 206) throw new Error(`fetchAllRows failed: ${res.status}`);
    const page = await res.json();
    rows.push(...page);
    if (page.length < PAGE) break; // 最後のページ
  }
  return rows;
}
// 公開盤(published_regions/published_albums形式の行)をREGIONSへ反映する。
// デプロイ時焼き込みのスナップショット(published.js)とSupabase読み足しの
// 両方から呼ばれる。既に居る地域・盤はスキップし、追加数を返す。
function applyPublishedData(pubRegions, pubAlbums) {
  let added = 0;
  (pubRegions || []).forEach((r) => {
    if (REGIONS.some((rr) => rr.id === r.id)) return;
    const region = { id: r.id, name: r.name, area: r.area || '', lng: r.lng, lat: r.lat, albums: [] };
    REGIONS.push(region);
    createMarkerForRegion(region); // マーカーも作らないとrefreshMarkers()が例外で死ぬ
    added++;
  });
  (pubAlbums || []).forEach((a) => {
    const region = REGIONS.find((r) => r.id === a.region_id);
    if (!region) return; // 地域側の反映がまだ届いていない/削除された等
    const id = PUBLISHED_ID_OFFSET + a.id;
    if (region.albums.some((al) => al.id === id)) return;
    region.albums.push({
      id, artist: a.artist, title: a.title, year: a.year, label: a.label,
      youtubeId: null, youtubeIds: a.youtube_ids || undefined,
      youtubeFullAlbumId: a.youtube_full_album_id || undefined,
      discogsArt: a.discogs_art || undefined,
      discogsUrl: a.discogs_url, stampSeed: {},
    });
    added++;
  });
  return added;
}

async function loadPublishedReleases() {
  try {
    const [pubRegions, pubAlbums] = await Promise.all([
      fetchAllRows(`${SB_URL}/published_regions?select=id,name,area,lat,lng`),
      fetchAllRows(`${SB_URL}/published_albums?select=id,title,artist,year,label,discogs_url,region_id,youtube_ids,youtube_full_album_id,discogs_art`),
    ]);
    // スナップショット適用済みの分はスキップされ、デプロイ後に増えた差分だけが
    // 加わる。差分ゼロ(普段)なら描き直さないので、起動時に数字が跳ねない
    const added = applyPublishedData(pubRegions, pubAlbums);
    if (added) {
      refreshMarkers();
      refreshActiveListView();
    }
    // 共有リンク/静的地域URLがSupabase由来のcustom地域を指していた場合、
    // 起動直後のopenFromHash()時点ではREGIONS未登録で開けていない。
    // 地域が出揃ったここで一度だけ再試行する(開いていれば何もしない)。
    // location.hashは起動処理(navGoto周りのreplaceState)で消えているため、
    // 起動時に捕捉済みのinitialShareHashを使う。
    if (!activeRegion && initialShareHash.startsWith('#r/')) openFromHash(initialShareHash);
    finishDeferredQueueRestore(false);
    // 端末間キュー同期の初回プル(公開盤が揃いalbumIdが全て解決できる状態で)
    pullQueueSync();
    pushGeoHint(); // 地域情報(tz/locale)の1日1回の最新化
  } catch {
    // オフラインでもローカルだけで動く。復元保留のままだと保存も止まった
    // ままになるので、解決できる分だけで復元して保留を解く
    finishDeferredQueueRestore(true);
  }
}

// 公開盤の読込完了(または断念)後に、保留していたキュー復元をやり直す。
// 保留中にユーザーが新しく再生を始めていた場合はそちらを優先し、
// 保留だけ解いて以後の保存を再開する。
function finishDeferredQueueRestore(forcePartial) {
  if (!queueRestoreDeferred) return;
  if (queue.length) { queueRestoreDeferred = false; saveQueue(); return; }
  restoreQueue(forcePartial);
  if (queueRestoreDeferred) {
    // 読込後も解決できない盤が残る場合(DB側で削除された等)は、
    // 保留を引きずって保存が止まり続けるより、解決分だけで復元して先へ進む
    restoreQueue(true);
    queueRestoreDeferred = false;
  }
  paint();
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
  applyMyStampsFromRow(row);
  const newHave = new Set(row.have || []);
  const newWant = new Set(row.want || []);
  // nope列のマイグレーション未実施のDBではrow.nopeがundefinedになる。
  // その場合はローカルのnopeを消さない(空配列と未対応を区別する)。
  const newNope = row.nope != null ? new Set(row.nope) : new Set(favsNope);
  const changed = newHave.size !== favsHave.size || newWant.size !== favsWant.size
    || newNope.size !== favsNope.size
    || [...newHave].some((k) => !favsHave.has(k)) || [...newWant].some((k) => !favsWant.has(k))
    || [...newNope].some((k) => !favsNope.has(k));
  if (!changed) return;
  favsHave.clear(); newHave.forEach((k) => favsHave.add(k));
  favsWant.clear(); newWant.forEach((k) => favsWant.add(k));
  favsNope.clear(); newNope.forEach((k) => favsNope.add(k));
  saveFavs();
  updateFavCount();
  if (listView === 'favs') renderFavs(false);
}

// 非同期の同期処理(autoPullFavSync等)完了時に一覧を再描画するための共通処理。
// ディスク詳細を見ている最中にactiveRegionだけを見てrenderList()すると、
// 裏の#listが地域一覧に差し替わってしまう(共有リンクでディスクを開いた直後に
// autoPullFavSyncのfetchが遅れて返ってくると再現しやすいバグだった)ので、
// 詳細表示中はrenderDisc()側を再描画する。
function refreshActiveListView() {
  if (navLevel === 2 && currentDisc) renderDisc(currentDisc, false);
  else if (activeRegion) renderList(activeRegion);
}

// サーバー行のmystamps(自分のチェック済みスタンプ)をローカルへ反映する。
// 列が無ければ何もしない(have/want同様、サーバー側を正とするlast-write-wins)。
function applyMyStampsFromRow(row) {
  if (!row.mystamps || typeof row.mystamps !== 'object') {
    // サーバー側が空でローカルに記録がある場合は押し上げて復旧する。
    // (eras/nope列の作成漏れで本命PATCHが400になり、mystampsが一度も
    //  保存されていなかった実障害からの自動リカバリ。列が直った後の
    //  初回起動でここを通り、端末に残っていたチェック履歴が同期に乗る)
    if (Object.keys(myStamps).length) pushFavSync();
    return;
  }
  const same = JSON.stringify(row.mystamps) === JSON.stringify(myStamps);
  if (same) return;
  Object.keys(myStamps).forEach((k) => delete myStamps[k]);
  Object.entries(row.mystamps).forEach(([k, v]) => { myStamps[k] = v; });
  saveStamps();
  refreshActiveListView();
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
  refreshActiveListView();
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
  let res = await fetch(`${base}&select=have,want,nope,eras`, { headers: SB_HEADERS });
  if (!res.ok) {
    // nope/eras列のマイグレーション未実施のDBへのフォールバック
    res = await fetch(`${base}&select=have,want,eras`, { headers: SB_HEADERS });
  }
  if (!res.ok) {
    res = await fetch(`${base}&select=have,want`, { headers: SB_HEADERS });
  }
  if (!res.ok) return false;
  const row = (await res.json())[0];
  if (!row) return false;
  applyErasFromRow(row);
  favsHave.clear(); (row.have || []).forEach((k) => favsHave.add(k));
  favsWant.clear(); (row.want || []).forEach((k) => favsWant.add(k));
  if (row.nope != null) { favsNope.clear(); row.nope.forEach((k) => favsNope.add(k)); }
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
// 検索のアルバム結果から開いた時だけセットする「戻り先」の検索語。
// 地図まで戻った(navLevel 0)瞬間にこれが残っていれば、地図を見せる代わりに
// 同じ検索結果へ自動で戻す(アーティストの他のアルバムを続けて確認しやすくする)。
// マーカークリック等ふつうの地域遷移ではopenRegion()内で毎回nullに戻す。
let searchReturnQuery = null;
// お気に入り画面から開いたディスク(および、そこから「他のアルバム」で
// 続けて開いた別ディスク)かどうか。trueの間は「他のアルバム」ジャンプでも
// 地域一覧を経由させず、戻り先をお気に入り画面のまま維持する。
// openRegion()を通る通常の地域遷移では毎回falseに戻る。
let favsDiscChain = false;

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

// ---------- 自動再生(シャッフル・地域継ぎ足し)からの除外設定 ----------
// 持ッテル/ホシイ/イラナイの各マークが付いた盤を自動再生の対象から外すか
// どうかの端末ローカル設定。イラナイだけ既定ON(マークの主目的が除外のため)。
// 一覧の表示や手動再生(自分で▶を押す)には一切影響しない。
const AUTOPLAY_KEY = 'gra.autoplayExclude.v1';
const autoplayExclude = { have: false, want: false, nope: true, ...JSON.parse(localStorage.getItem(AUTOPLAY_KEY) || '{}') };
const saveAutoplayExclude = () => localStorage.setItem(AUTOPLAY_KEY, JSON.stringify(autoplayExclude));
// この盤を自動再生(ランダム選盤・継ぎ足し)の対象にして良いか
function autoplayEligible(album) {
  const key = albumKey(album);
  if (autoplayExclude.nope && favsNope.has(key)) return false;
  if (autoplayExclude.have && favsHave.has(key)) return false;
  if (autoplayExclude.want && favsWant.has(key)) return false;
  return true;
}

// ---------- サウンドタグ絞り込み(トークボックス/ネタモノ) ----------
// 年代とは違い「該当する曲だけ探したい」がユースケースなので、デフォルトは
// 全部OFF(絞り込み無し)。誰か1人でもチェックしたタグを持つディスクだけ表示する
// (=誰もチェックしていない曲はヒットしない。トークボックス使用曲がDiscogsの
// クレジットだけでは拾いきれなかったため、ユーザーの申告に切り替えた)。
const TAG_KEY = 'gra.tagFilters.v1';
const tagFilters = new Set(JSON.parse(localStorage.getItem(TAG_KEY) || '[]'));
const saveTagFilters = () => localStorage.setItem(TAG_KEY, JSON.stringify([...tagFilters]));
const matchesTagFilter = (a) => !tagFilters.size || [...tagFilters].some((tg) => albumHasTag(a, tg));

const albumsOf = (r) => {
  let list = r.albums.filter((a) => eraFilters.has(eraOf(a)) && matchesTagFilter(a));
  if (activeFilters.size) list = list.filter((a) => [...activeFilters].every((f) => hasStamp(a, f)));
  return list;
};

// ---------- 地図 ----------
const map = new maplibregl.Map({
  container: 'map',
  // CARTOの無料ラスタタイルがAPIキー必須化し「API KEY REQUIRED」の透かし入りタイルを
  // 返すようになったため、キー不要のOpenFreeMap(同じPositron系スタイル)へ移行した
  style: 'https://tiles.openfreemap.org/styles/positron',
  center: [-97, 38],
  zoom: 3.6,
  attributionControl: { compact: true },
});

// コンテナのサイズ変化(初期レイアウト確定・左上への縮小アニメ)に必ず追従させる。
// これを怠るとキャンバスと実寸がずれ、マーカーが実座標からずれた位置に描画される。
new ResizeObserver(() => map.resize()).observe(document.getElementById('mapWrap'));

const markers = {};
// 起動後にREGIONSへ地域が増えることがある(レビューからの公開で新規地域が
// 追加されるloadPublishedReleases())ため、1地域分のマーカー生成を関数化して
// 後からも呼べるようにしてある。refreshMarkers()はmarkers[r.id]の存在を
// 前提にするので、REGIONSに足した地域は必ずこれでマーカーも作ること
// (作り忘れるとrefreshMarkers()が例外で死に、全ナビゲーションが止まる)。
function createMarkerForRegion(region) {
  if (markers[region.id]) return;
  const el = document.createElement('div');
  el.className = 'marker' + (region.unclassified ? ' unclassified' : '');
  // 手で押した判子風に、地域ごとに少しだけ傾ける
  const rot = (region.id.split('').reduce((n, c) => n + c.charCodeAt(0), 0) % 13) - 6;
  el.style.setProperty('--rot', `${rot}deg`);
  // 出身地未特定の置き場だけ、墓石でなく漂流ブイ(?)にする
  // (形状はドット絵PNGの共有ビットマップ。CSSの.grave/.buoy参照)
  const icon = region.unclassified
    ? `<div class="grave buoy" aria-hidden="true"></div><span class="q">?</span>`
    : `<div class="grave" aria-hidden="true"></div>`;
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
}
REGIONS.forEach(createMarkerForRegion);
// デプロイ時に焼き込んだ公開盤スナップショット(published.js)をここで即適用する。
// 初回描画から最終的な枚数でマーカーが出て、以前のような
// 「data.js分→数秒後にSupabase分が届いて数字が跳ねる」2段階表示にならない。
// Supabaseからの読み足し(loadPublishedReleases)はスナップショット以降の差分補完。
if (typeof PUBLISHED_SNAPSHOT !== 'undefined') {
  try { applyPublishedData(PUBLISHED_SNAPSHOT.regions, PUBLISHED_SNAPSHOT.albums); } catch { /* 壊れていてもSupabase読み足しで復旧する */ }
}

function refreshMarkers() {
  // フォントサイズ主導のサイズ設計(ユーザー指定):
  // 数字フォントを最小9px〜最大18pxとし、1〜最大Disc数の√スケールで可変にする。
  // √なのは地域の大半が数枚〜数十枚に集中しているため — 線形だと低い側の差が
  // つぶれ、対数だと100枚と900枚の差がつぶれる(以前の対数+上限40では
  // 100枚も900枚も同じ最大サイズになっていた)。
  // 墓石はフォントを縮めて収めるのではなく、桁数分の数字+余白が収まる大きさへ広げる。
  const counts = {};
  let maxN = 1;
  REGIONS.forEach((r) => {
    const c = albumsOf(r).length;
    counts[r.id] = c;
    if (c > maxN) maxN = c;
  });
  REGIONS.forEach((r) => {
    const el = markers[r.id];
    const n = counts[r.id];
    const f = 9 + 9 * Math.sqrt(Math.max(0, n - 1) / Math.max(1, maxN - 1));
    const digits = String(n || '').length;
    // 0.28=1桁時の数字/墓石比、0.95em=この書体の数字1文字ぶんの幅、
    // 0.62=墓石画像のうち数字を置ける内側実効幅の割合
    const size = Math.round(Math.max(f / 0.28, (digits * f * 0.95) / 0.62));
    el.style.width = el.style.height = `${size}px`;
    const nEl = el.querySelector('.n');
    nEl.textContent = n || '';
    nEl.style.fontSize = `${Math.round(f)}px`;
    // 0件の墓標は非表示(フィルター中に該当なしの地域も消える)。
    // 未確認情報の置き場も同様に0件なら隠す。
    el.classList.toggle('hidden', n === 0);
    el.classList.toggle('hit', shotRegions.has(r.id));
    el.classList.toggle('selected', r.id === selectedRegionId);
    el.title = `${r.name} — ${n}枚`;
    // 重なり順: 枚数が多いほど上に。選択中の地域は常に最前面。
    el.style.zIndex = r.id === selectedRegionId ? 9000 : n;
  });
}

// ---------- スタンプ絞り込み ----------
const filterBar = document.getElementById('stampFilter');
// 絞り込みパネルに出す全体件数。地図側(albumsOf/refreshMarkers)は
// 「該当ディスクの枚数」で数えているので、ここも曲単位(track)ではなく
// ディスク単位で数える(以前はtrack単位で数えていたため、パネルの数字と
// 地図に表示される件数が一致しないバグになっていた)。
// 判定はalbumsOfが使っているmatchesTagFilter/hasStampをそのまま再利用し、
// 両者が食い違わないようにする。
// 開閉のたびではなく初期表示・言語切替時だけ計算すれば十分な頻度なので、
// 4800枚超を毎回舐めても実用上のコストにはならない。
const globalStampCount = (id) => allKnownAlbums()
  .reduce((n, { a }) => n + (eraFilters.has(eraOf(a)) && matchesTagFilter(a) && hasStamp(a, id) ? 1 : 0), 0);
const globalTagCount = (id) => allKnownAlbums()
  .reduce((n, { a }) => n + (
    eraFilters.has(eraOf(a)) && albumHasTag(a, id)
    && (!activeFilters.size || [...activeFilters].every((s) => hasStamp(a, s)))
      ? 1 : 0
  ), 0);

function buildFilterBar() {
  filterBar.innerHTML = '';
  STAMPS.forEach((s) => {
    const n = globalStampCount(s.id);
    if (n === 0 && !activeFilters.has(s.id)) return; // 0件は非表示(選択中のものは外せるよう残す)
    const b = document.createElement('button');
    b.className = 'stamp' + (activeFilters.has(s.id) ? ' on' : '');
    b.style.color = s.color;
    b.innerHTML = `<span>${stampName(s)}</span><span class="count">${n}</span>`;
    b.addEventListener('click', () => {
      const wasOn = activeFilters.has(s.id);
      activeFilters.clear();
      if (!wasOn) activeFilters.add(s.id);
      pruneShuffleQueue(); // 連結済み・先読み済みのランダム盤も新しい条件に従わせる
      refreshMarkers();
      if (activeRegion) renderList(activeRegion);
      // タグ側の絞り込み表示に連動するので、双方作り直す
      buildFilterBar();
      buildTagBar();
    });
    filterBar.appendChild(b);
  });
}
// 初回描画はapplyLang()内で行う(ここで即時呼ぶとglobalStampCount→stampCount→
// enrichOfの参照が、enrichOf自体の定義(constでこれより後方)より先に走ってしまい
// TDZエラーになるため)。

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
      pruneShuffleQueue(); // 連結済み・先読み済みのランダム盤も新しい条件に従わせる
      refreshMarkers();
      if (activeRegion) renderList(activeRegion);
      if (searchOverlay.classList.contains('open')) runSearch(searchInput.value);
      // スタンプ/タグの件数は年代フィルターの範囲に連動するので作り直す
      buildFilterBar();
      buildTagBar();
    });
    eraBar.appendChild(label);
  });
}
buildEraBar();

// ---------- 自動再生除外の設定UI(ドロワー) ----------
const autoplayBar = document.getElementById('autoplayFilter');
function buildAutoplayBar() {
  if (!autoplayBar) return; // 旧キャッシュのHTMLに要素が無くても落ちない
  // 見出し行+一段下げたチェック行の2段構成
  autoplayBar.innerHTML = `<span class="autoplay-label">${t('autoplayExclude')}</span><div class="autoplay-chks"></div>`;
  const chkRow = autoplayBar.querySelector('.autoplay-chks');
  [['have', t('have')], ['want', t('want')], ['nope', t('nope')]].forEach(([k, lab]) => {
    const label = document.createElement('label');
    label.className = 'era-chk' + (autoplayExclude[k] ? ' on' : '');
    label.innerHTML = `<input type="checkbox"${autoplayExclude[k] ? ' checked' : ''}><span>${lab}</span>`;
    label.querySelector('input').addEventListener('change', (ev) => {
      autoplayExclude[k] = ev.target.checked;
      pruneShuffleQueue(); // 連結済み・先読み済みのランダム盤も新しい条件に従わせる
      label.classList.toggle('on', ev.target.checked);
      saveAutoplayExclude();
    });
    chkRow.appendChild(label);
  });
}
buildAutoplayBar();

// ---------- サウンドタグ絞り込みUI ----------
const tagBar = document.getElementById('tagFilter');
function buildTagBar() {
  if (!tagBar) return;
  tagBar.innerHTML = '';
  TAGS.forEach((tg) => {
    const n = globalTagCount(tg.id);
    if (n === 0 && !tagFilters.has(tg.id)) return; // 0件は非表示(選択中のものは外せるよう残す)
    const label = document.createElement('label');
    label.className = 'era-chk' + (tagFilters.has(tg.id) ? ' on' : '');
    label.innerHTML = `<input type="checkbox"${tagFilters.has(tg.id) ? ' checked' : ''}><span>${tagName(tg)}</span><span class="count">${n}</span>`;
    label.querySelector('input').addEventListener('change', (ev) => {
      if (ev.target.checked) tagFilters.add(tg.id); else tagFilters.delete(tg.id);
      saveTagFilters();
      pruneShuffleQueue(); // 連結済み・先読み済みのランダム盤も新しい条件に従わせる
      refreshMarkers();
      if (activeRegion) renderList(activeRegion);
      if (searchOverlay.classList.contains('open')) runSearch(searchInput.value);
      // スタンプ側の絞り込み表示に連動するので、双方作り直す
      buildFilterBar();
      buildTagBar();
    });
    tagBar.appendChild(label);
  });
}
// 初回描画はapplyLang()内で行う(buildFilterBarと同じ理由でここでは呼ばない)。

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

// 検索オーバーレイはnavLevelの階層とは別物だが、開いた分もhistoryに1つ
// 積んでおく。積まないと、検索窓を開いた状態でスワイプ/端末の戻るを
// 押した時にhistoryに戻る先が無く、アプリ自体が閉じてしまっていた。
let searchHistoryOpen = false;
// フォーカスを遅延させるsetTimeoutの予約IDを覚えておき、閉じる時に必ず
// キャンセルする。キャンセルし忘れると、検索結果をすぐ選んで画面を
// 閉じた後にこのタイマーだけ発火してsearchInputへ再フォーカスしてしまい、
// オーバーレイは閉じているのにキーボードだけ勝手に開く不具合になっていた。
let searchFocusTimer = null;
function openSearch() {
  clearStampFilter(); // スタンプ絞り込み中に検索を開いたら解除し、全件対象で探せるようにする
  searchOverlay.classList.add('open');
  document.body.classList.add('search-open'); // スマホでは虫眼鏡ボタン自体を隠す
  searchInput.value = '';
  searchResults.innerHTML = '';
  clearTimeout(searchFocusTimer);
  searchFocusTimer = setTimeout(() => searchInput.focus(), 50);
  if (!searchHistoryOpen) {
    history.pushState({ level: navLevel, search: true }, '');
    searchHistoryOpen = true;
  }
}
// fromPopstate: 戻る操作(popstate)からの呼び出しならtrue。この場合は
// historyが既に1つ消化された後なので、二重にhistory.back()しない。
function closeSearch(fromPopstate = false) {
  clearTimeout(searchFocusTimer);
  searchOverlay.classList.remove('open');
  document.body.classList.remove('search-open');
  searchInput.blur();
  if (searchHistoryOpen) {
    searchHistoryOpen = false;
    if (!fromPopstate) history.back(); // ×ボタン等での明示的な閉じ操作は積んだ分を消化しておく
  }
}
// 検索結果を選んで別の画面(地域/ディスク)へ進む場合に使う。history.back()を
// 呼ぶcloseSearch()と違い、こちらはUIを閉じるだけでhistoryには触らない。
// 検索結果クリック直後にopenRegion()のhistory.pushState()が続けて走るため、
// closeSearch()のhistory.back()(非同期)と競合してnavLevel/historyの
// 整合性が崩れ、後で無関係な地域タップ時に検索が勝手に開き直る
// (キーボードが開く)不具合になっていた。積んだ分は行き先のpushStateに
// そのまま埋もれさせて無害化する。
function closeSearchUI() {
  clearTimeout(searchFocusTimer);
  searchOverlay.classList.remove('open');
  document.body.classList.remove('search-open');
  searchInput.blur();
  searchHistoryOpen = false;
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
      if (!eraFilters.has(eraOf(a)) || !matchesTagFilter(a)) return; // 年代・タグの絞り込みは検索にも適用
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
      closeSearchUI();
      openRegion(r);
    });
    searchResults.appendChild(row);
  });
  hits.slice(0, 60).forEach(({ a, r }) => {
    const row = document.createElement('div');
    row.className = 'sr-item';
    row.innerHTML = `<span class="t">${a.title}</span><span class="a">${a.artist}</span><span class="y">${a.year}</span><span class="r">${r.name}</span>`;
    row.addEventListener('click', () => {
      const q = searchInput.value;
      closeSearchUI();
      openRegion(r); // ここでsearchReturnQueryは一旦nullに戻るので、直後に戻り先として設定し直す
      searchReturnQuery = q;
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

// ---------- 曲スタンプ選択ポップアップ ----------
// ＋ボタンが小さくて押しにくい問題への対応。押し間違い防止のため曲名を
// 見出しとして表示してから選ばせる。
const stampOverlay = document.getElementById('stampOverlay');
const stampOverlayTitle = document.getElementById('stampOverlayTitle');
const stampOverlayList = document.getElementById('stampOverlayList');
const stampOverlayTags = document.getElementById('stampOverlayTags');

// onPick(id): ムードスタンプ(1個だけ選択、選ぶとポップアップは閉じる)
// onTagChange(): トークボックス/ネタモノのチェック変更時に呼ばれる(ポップアップは開いたまま)
function openStampPicker(key, title, onPick, onTagChange) {
  stampOverlayTitle.textContent = title;
  stampOverlayList.innerHTML = '';
  const mine = stampsAt(key);
  STAMPS.forEach((s) => {
    const b = document.createElement('button');
    b.className = 'stamp' + (mine.includes(s.id) ? ' mine' : '');
    b.style.color = s.color;
    b.innerHTML = `<span>${stampName(s)}</span>`;
    b.addEventListener('click', () => { onPick(s.id); closeStampPicker(); });
    stampOverlayList.appendChild(b);
  });
  stampOverlayTags.innerHTML = '';
  TAGS.forEach((tg) => {
    const label = document.createElement('label');
    label.className = 'stamp-tag-chk' + (tagChecked(key, tg.id) ? ' on' : '');
    label.innerHTML = `<input type="checkbox"${tagChecked(key, tg.id) ? ' checked' : ''}><span>${tagName(tg)}</span>`;
    label.querySelector('input').addEventListener('change', (ev) => {
      // このポップアップは常にディスク詳細ページ(曲行/ディスク直押し)から開く。
      // renderList(activeRegion)を呼ぶと裏の#listがディスク詳細から地域の
      // アルバム一覧に差し替わってしまう(ポップアップを閉じると一覧に
      // 飛んだように見えるバグだった)ので、ここでは呼ばない。
      // ローカルの見た目更新はonTagChange(バッジ再描画)だけで十分。
      castTagVote(key, tg.id, ev.target.checked ? 1 : -1);
      label.classList.toggle('on', ev.target.checked);
      onTagChange?.();
      refreshMarkers(); // 絞り込みの該当件数が変わるので地図側だけは更新する
    });
    stampOverlayTags.appendChild(label);
  });
  stampOverlay.classList.add('open');
  document.body.classList.add('search-open');
}
// 曲行/ディスクの「ト」「ネ」ワンレター表示。net>0で確定してるタグだけ出す
// (mineクラスは自分が+1に投票して確定に貢献している場合)
function paintTagBadges(el, key) {
  el.innerHTML = '';
  TAGS.forEach((tg) => {
    if (netTagScore(key, tg.id) <= 0) return;
    const b = document.createElement('i');
    b.className = 'tag-badge' + (myTagVote(key, tg.id) === 1 ? ' mine' : '');
    b.textContent = tg.abbr;
    b.title = tagName(tg);
    el.appendChild(b);
  });
}
function closeStampPicker() {
  stampOverlay.classList.remove('open');
  document.body.classList.remove('search-open');
}
if (stampOverlay) {
  document.getElementById('stampOverlayClose')?.addEventListener('click', closeStampPicker);
  stampOverlay.addEventListener('click', (e) => { if (e.target === stampOverlay) closeStampPicker(); });
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && stampOverlay?.classList.contains('open')) closeStampPicker();
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
// 共有リンクで開いた場合、地図(level 0)のhistoryエントリにそのままリンクの
// ハッシュを残すと、「閉じる」で最後まで戻ったときにそのハッシュへ戻る
// hashchangeが発火し、共有リンクをもう一度開いたのと同じ扱いで再度ディスクが
// 開いてしまう(閉じても閉じても同じページが復活するように見えるバグだった)。
// 元のハッシュはopenFromHash()に渡すため先に控えておき、level 0のURLからは
// 消しておく。
// SEO用の静的地域URL(/r/<地域ID>/)で本体アプリが起動された場合の入口。
// パスを通常のハッシュ共有リンク形式に置き換えてから、直後のinitialShareHash
// 経由で既存のopenFromHash()の流れに乗せる(処理を二重に持たないため)。
(function openFromPath() {
  const m = location.pathname.match(/\/r\/([A-Za-z0-9._-]+)\/?$/);
  if (!m) return;
  const base = location.pathname.replace(/r\/[A-Za-z0-9._-]+\/?$/, '');
  history.replaceState(null, '', base + location.search + '#r/' + m[1]);
})();
const initialShareHash = location.hash;
history.replaceState({ level: 0 }, '', location.pathname + location.search);
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
  // 検索窓が開いている間のスワイプ/戻るは、アプリごと閉じずに検索窓だけ閉じる
  if (searchHistoryOpen) {
    searchHistoryOpen = false;
    closeSearch(true);
    return;
  }
  // e.stateが無い(=このアプリのnavGoto経由ではない)状態でr/...のハッシュに
  // 変わっている場合は、共有リンクを開いた遷移とみなしてそちらを優先する
  // (hashchangeが発火しない環境向けの保険、openFromHash()参照)。
  if (!e.state && location.hash.slice(1).startsWith('r/')) {
    openFromHash();
    return;
  }
  const level = e.state?.level ?? 0;
  navLevel = level;
  if (level === 0) closeListUI();
  else if (level === 1) {
    if (listView === 'favs') renderFavs(false);
    else if (listView === 'submit') renderSubmit(false);
    else if (listView === 'queueview') renderQueueView(false);
    else renderList(activeRegion || lastDiscRegion);
  }
});

function openRegion(region, push = true) {
  document.body.classList.remove('stamps-open'); // 墓石アイコンの絞り込みパネルを開いたままだったら閉じる
  searchReturnQuery = null; // ふつうの地域遷移(マーカークリック等)では検索への戻り先を引きずらない
  favsDiscChain = false; // 同上、お気に入りへの戻り先も引きずらない
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
  // 検索のアルバム結果から辿り着いていた場合は、地図を見せる代わりに
  // 同じ検索結果へ自動で戻す(アーティストの他のアルバムを続けて探しやすくする)
  if (searchReturnQuery != null) {
    const q = searchReturnQuery;
    searchReturnQuery = null;
    openSearch();
    searchInput.value = q;
    runSearch(q);
  }
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
const listHead = (title, sub, cnt, share = false, shuffle = false) => `
  <div class="list-head">
    <h2>${title}</h2>
    <span class="sub">${sub}</span>
    <span class="cnt">${cnt}</span>
    ${shuffle ? `<button class="region-shuffle" title="この地域内でシャッフル再生">${SHUFFLE_ICON_SVG}</button>` : ''}
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
    ${listHead(region.name, region.area, `${list.length} ${t('discs')}`, true, true)}
    <div class="grid"></div>`;
  listEl.querySelector('.close').addEventListener('click', closeList);
  listEl.querySelector('.share').addEventListener('click', () => shareCurrentPage(region.name));
  listEl.querySelector('.region-shuffle').addEventListener('click', () => startRegionShuffle(region));
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

// このディスクの曲/ディスク本体のどのキーであれ、自分が押したスタンプのidを集める
function myStampIdsForAlbum(album) {
  const ids = new Set();
  stampsAt(albumKey(album)).forEach((id) => ids.add(id));
  (enrichOf(album)?.tracks || []).forEach((tr) => stampsAt(trackKey(album, tr.name)).forEach((id) => ids.add(id)));
  youtubeIdsFor(album).forEach((vid) => stampsAt(trackKey(album, `yt:${vid}`)).forEach((id) => ids.add(id)));
  return ids;
}

// mineOnly: お気に入り画面など「自分だけの空間」では、みんなの集計ではなく
// 自分が押したスタンプだけを表示する
function albumCard(album, mineOnly = false) {
  const card = document.createElement('div');
  // イラナイ盤は一覧から消さず、薄く表示して「除外中」と分かるようにする
  card.className = 'album' + (favsNope.has(albumKey(album)) ? ' noped' : '');
  const r = rarity(album);
  const e = enrichOf(album);
  const art = artUrl(e, 300, album);
  const artHtml = art
    ? `<div class="album-art has-img"><img src="${art}" alt="${album.title}" loading="lazy"></div>`
    : `<div class="album-art"><span>${t('notOn')}</span></div>`;

  const hasPreview = !!(e?.tracks || []).some((tr) => tr.preview) || youtubeIdsFor(album).length > 0;
  // 2行目は「今すぐ再生」と「キューに追加」の2カラムで幅いっぱいに使う
  const playBtnHtml = hasPreview
    ? `<button class="play-btn" title="このディスクを今すぐ再生">▶</button>
       <button class="enqueue-btn" title="このディスクをキューに追加">${t('queueAll')}</button>`
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
            <button class="fav-btn nope-btn${favsNope.has(albumKey(album)) ? ' on' : ''}" title="この盤をシャッフルに流さない">${t('nope')}</button>
          </div>
        </div>
        ${playBtnHtml ? `<div class="album-actions play-row">${playBtnHtml}</div>` : ''}
      </div>
    </div>
    <div class="rarity">
      <span class="lab">${t('rarity')} ${r.stars}${r.priceJpy == null && r.have <= 15 ? ' <span class="hot-badge" title="Discogsに出品なし">🔥出品なし</span>' : ''}</span>
      <span class="bar"><i style="width:${Math.round(r.score * 100)}%"></i></span>
      <span class="n">${r.priceJpy != null ? `¥${Math.round(r.priceJpy).toLocaleString()}〜` : `STAMP ${r.total}`}</span>
    </div>
    <div class="album-stamps"></div>`;

  const rerender = () => { card.replaceWith(albumCard(album, mineOnly)); refreshMarkers(); };

  const wrap = card.querySelector('.album-stamps');
  if (mineOnly) {
    // 自分が押したものだけ(件数はみんなの集計なので出さない)
    const mine = myStampIdsForAlbum(album);
    STAMPS.filter((s) => mine.has(s.id)).forEach((s) => {
      const b = document.createElement('span');
      b.className = 'stamp mine';
      b.style.color = s.color;
      b.innerHTML = `<span>${stampName(s)}</span>`;
      wrap.appendChild(b);
    });
  } else {
    // ディスクのスタンプ = 曲スタンプ+分析初期値の集計(表示のみ。押すのは専用ページで)
    STAMPS.filter((s) => stampCount(album, s.id) > 0)
      .sort((a, b) => stampCount(album, b.id) - stampCount(album, a.id))
      .forEach((s) => wrap.appendChild(discChip(album, s)));
  }

  // カードのどこを押してもディスク専用ページへ(ボタン類は除く)
  card.addEventListener('click', (ev) => {
    if (ev.target.closest('button, a')) return;
    saveListScrollBeforeDisc();
    // お気に入り発(mineOnly)かどうかを覚えておく。ディスクページの
    // 「他のアルバム」から別ディスクへ飛んだ時も、戻り先をお気に入りの
    // ままにするために使う(favsDiscChain参照)
    favsDiscChain = mineOnly;
    renderDisc(album);
  });

  card.querySelector('.play-btn')?.addEventListener('click', () => playAlbum(album));
  card.querySelector('.enqueue-btn')?.addEventListener('click', () => enqueueAlbum(album));
  card.querySelector('.have-btn').addEventListener('click', () => {
    toggleFav(favsHave, albumKey(album)); updateFavCount(); rerender();
  });
  card.querySelector('.want-btn').addEventListener('click', () => {
    // ホシイとイラナイは両立しない(詳細ページのwant-dと同じ規約)
    if (!favsWant.has(albumKey(album))) favsNope.delete(albumKey(album));
    toggleFav(favsWant, albumKey(album)); updateFavCount(); rerender();
  });
  card.querySelector('.nope-btn').addEventListener('click', () => {
    if (!favsNope.has(albumKey(album))) favsWant.delete(albumKey(album)); // 同上
    toggleFav(favsNope, albumKey(album)); updateFavCount(); rerender();
  });
  return card;
}

// ---------- ディスク専用ページ(大ジャケ+曲一覧+曲単位スタンプ) ----------
function renderDisc(album, push = true) {
  // スタンプを押した時のrerender()(push=false、同じ盤の中身だけ更新)では
  // ページ上部への強制スクロールを避け、押した位置のまま留まれるようにする。
  const keepScroll = !push;
  const scrollBefore = keepScroll ? listEl.scrollTop : 0;
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
  // 「＋ キューニ追加」はイラナイボタンを同じ行へ収めるため非表示にした
  // (▶で今すぐ再生はでき、積みたい場合は曲ごとの▶で足せる。2026-08-27)
  const playActionsHtml = hasPlayable
    ? `<button class="play-btn disc-play" title="このディスクを今すぐ再生">▶</button>`
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
          <button class="tr-toggle nope-d${favsNope.has(key) ? ' on' : ''}" title="この盤をシャッフルに流さない">${t('nope')}</button>
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
    <div class="tracks"></div>
    <div class="other-albums"></div>`;

  // ◀ も ✕ も「元のディスク一覧」へ戻る(地図まで一気に閉じない)。
  // historyを1つ戻すことでpopstateハンドラに実際の描画を任せる
  // (スワイプ/ブラウザの戻るボタンと同じ経路に揃える)。
  listEl.querySelector('.back').addEventListener('click', navBack);
  listEl.querySelector('.x').addEventListener('click', navBack);
  listEl.querySelector('.share').addEventListener('click', () => shareCurrentPage(`${album.artist} - ${album.title}`));

  const wrap = listEl.querySelector('.album-stamps');
  if (tracks.length || youtubeIdsFor(album).length) {
    // スタンプは曲側(iTunes/YouTubeどちらの曲行でも)で押す(ここは0件を除いた集計表示)
    STAMPS.filter((s) => stampCount(album, s.id) > 0)
      .sort((a, b) => stampCount(album, b.id) - stampCount(album, a.id))
      .forEach((s) => wrap.appendChild(discChip(album, s)));
  } else {
    // 曲データが一切無い激レア盤はディスクに直接、曲行と同じ単一枠+ポップアップ形式で押す
    const key = albumKey(album);
    const badges = document.createElement('span');
    badges.className = 'tag-badges';
    paintTagBadges(badges, key);
    const slot = document.createElement('button');
    slot.className = 'stamp-slot';
    const paintDiscSlot = () => {
      const id = stampsAt(key)[0];
      const s = id && STAMPS.find((x) => x.id === id);
      slot.classList.toggle('set', !!s);
      slot.style.color = s ? s.color : '';
      slot.textContent = s ? stampName(s) : '＋ スタンプ';
      slot.title = s ? `${stampName(s)}(タップで変更)` : 'このディスクにスタンプ';
    };
    paintDiscSlot();
    slot.addEventListener('click', () => {
      openStampPicker(key, album.title,
        (id) => { toggleStampAt(key, id); paintDiscSlot(); rerender(); },
        () => paintTagBadges(badges, key));
    });
    wrap.appendChild(badges);
    wrap.appendChild(slot);
  }

  listEl.querySelector('.disc-play')?.addEventListener('click', () => playAlbum(album));
  listEl.querySelector('.play-d')?.addEventListener('click', () => enqueueAlbum(album));
  listEl.querySelector('.have-d').addEventListener('click', () => {
    toggleFav(favsHave, key); updateFavCount(); rerender();
  });
  listEl.querySelector('.want-d').addEventListener('click', () => {
    // ホシイとイラナイは両立しない(欲しいのに流れてこないのは矛盾するため)
    if (!favsWant.has(key)) favsNope.delete(key);
    toggleFav(favsWant, key); updateFavCount(); rerender();
  });
  listEl.querySelector('.nope-d').addEventListener('click', () => {
    if (!favsNope.has(key)) favsWant.delete(key); // 同上(イラナイを付けたらホシイは外す)
    toggleFav(favsNope, key); updateFavCount(); rerender();
  });

  const tracksEl = listEl.querySelector('.tracks');
  tracks.forEach((t, i) => tracksEl.appendChild(trackRow(album, t, i, rerender)));
  // iTunesに1曲も無い盤は、YouTube代替行を曲リストと同じ見た目で足す
  // (Discogsに複数曲が個別に貼られていれば全て並べる。再生ボタンを押すと
  // playAlbum()経由でYouTube側が再生される)。
  if (!tracks.length) {
    youtubeIdsFor(album).forEach((vid) => tracksEl.appendChild(youtubeTrackRow(album, vid, rerender)));
    const fullId = fullAlbumIdFor(album);
    if (fullId) tracksEl.appendChild(fullAlbumLinkRow(fullId));
  }

  // 検索から曲を確認していく時に、いちいち検索へ戻らず同じアーティストの
  // 他のアルバムも続けて見られるように。ただしジャンプした先を閉じた時も
  // 必ずその盤の地域一覧を経由させたい(地図起点の体験を薄めないため)ので、
  // 単にディスクだけ差し替えるのではなく、別地域ならopenRegion()から
  // やり直して履歴・activeRegionを正しく積み直す。
  const others = allKnownAlbums()
    .filter(({ a }) => a.artist === album.artist && a !== album)
    .sort((x, y) => x.a.year - y.a.year);
  if (others.length) {
    const box = listEl.querySelector('.other-albums');
    box.innerHTML = `<h3>${album.artist} の他のアルバム</h3><div class="other-albums-list"></div>`;
    const otherList = box.querySelector('.other-albums-list');
    others.forEach(({ a: other, r: otherRegion }) => {
      const row = document.createElement('button');
      row.className = 'other-album-row';
      row.innerHTML = `<span class="t">${other.title}</span><span class="y">${other.year}</span><span class="rgn">${otherRegion.name}</span>`;
      row.addEventListener('click', () => {
        if (favsDiscChain) {
          // お気に入りから来た流れ: 地域一覧を経由させず、戻り先はお気に入りのまま
          renderDisc(other, true);
        } else if (otherRegion === activeRegion) {
          renderDisc(other, true);
        } else {
          // 別地域へのジャンプは履歴を積まず現在のエントリを差し替える。
          // ここでpush=true(階層1として積む)にすると、階層2に居るのに
          // navLevelだけ1へ下がり履歴と食い違う。そのままディスクBを積むと
          // 壊れたエントリが挟まり、「戻る」で地図まで辿り着く前にアプリごと
          // 閉じる実バグになっていた。差し替えなら履歴は常に
          // [地図→地域→ディスク]の3段で、戻るはB→地域Y一覧→地図と正しく辿る
          // (activeRegionはopenRegion()がYへ更新するので戻り先の一覧もYになる)。
          openRegion(otherRegion, false);
          setTimeout(() => { saveListScrollBeforeDisc(); renderDisc(other, true); }, 460);
        }
      });
      otherList.appendChild(row);
    });
  }
  // 地域一覧から新しく開いた時だけ、そのスクロール位置を引き継がず先頭から
  // 見せる。スタンプ操作等での同じ盤の再描画(keepScroll)は位置を保つ。
  listEl.scrollTop = keepScroll ? scrollBefore : 0;
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
function youtubeTrackRow(album, vid, rerender) {
  const row = document.createElement('div');
  row.className = 'track';
  // タイトルはoEmbed取得完了まで確定しないため、キーは動画ID基準で
  // 最初から固定する(読み込み中でもスタンプが押せるように)。
  const key = trackKey(album, `yt:${vid}`);
  row.innerHTML = `
    <button class="tp" title="YouTubeで再生(30秒)">▶</button>
    <span class="no">YT</span>
    <span class="name">読込中…</span>
    <span class="tag-badges"></span>
    <button class="stamp-slot" title="この曲にスタンプ">＋</button>`;
  row.querySelector('.tp').addEventListener('click', () => {
    const e = enrichOf(album);
    playSingle({ title: ytTitleCache[vid] || album.title, artist: album.artist, preview: null, youtube: vid, art: artUrl(e, 100, album), album });
  });

  const badges = row.querySelector('.tag-badges');
  paintTagBadges(badges, key);
  const slot = row.querySelector('.stamp-slot');
  const paintSlot = () => {
    const id = stampsAt(key)[0];
    const s = id && STAMPS.find((x) => x.id === id);
    slot.classList.toggle('set', !!s);
    slot.style.color = s ? s.color : '';
    slot.textContent = s ? stampName(s) : '＋';
    slot.title = s ? `${stampName(s)}(タップで変更)` : 'この曲にスタンプ';
  };
  paintSlot();
  slot.addEventListener('click', () => {
    const title = row.querySelector('.name').textContent;
    openStampPicker(key, title,
      (id) => { toggleStampAt(key, id); paintSlot(); rerender?.(); },
      () => paintTagBadges(badges, key));
  });

  const url = `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${vid}`)}&format=json`;
  fetch(url).then((res) => (res.ok ? res.json() : Promise.reject())).then((data) => {
    if (data?.title) {
      row.querySelector('.name').textContent = data.title;
      setYtTitle(vid, data.title);
      // ちょうど今この曲を再生中(=タイトル未解決のままキューに積まれた)なら、
      // 再生バーの表示も後追いで曲名に更新する
      if (queue[cursor]?.youtube === vid) { queue[cursor].title = data.title; paint(); }
    }
  }).catch(() => {
    // Discogsには載っているがYouTube側で削除/非公開になった動画。
    // 読込中のまま固まったり再生できないまま止まったりしないよう、
    // 行ごと無効化してキューに入らないようにする(スタンプは押せたままにする)。
    row.querySelector('.name').textContent = '動画が見つかりません';
    row.querySelector('.tp').disabled = true;
    row.classList.add('yt-unavailable');
  });
  return row;
}

// ---------- お気に入りリスト表示(ホシイ/持ッテル/自分のスタンプ をタブ切替) ----------
let favTab = 'have'; // 縦に全部並べると件数が多い人ほど画面が伸びすぎるためタブ化
let favSort = 'added'; // 'added' | 'region' | 'artist'
// items: [{a, r}], favSet: 対応するSet(favsHave/favsWant/stampedAlbumKeys)。
// Setの反復順は挿入順そのものなので「追加順」はここから素直に取れる。
function sortFavItems(items, favSet) {
  if (favSort === 'region') {
    return items.slice().sort((x, y) => x.r.name.localeCompare(y.r.name) || x.a.artist.localeCompare(y.a.artist));
  }
  if (favSort === 'artist') {
    return items.slice().sort((x, y) => x.a.artist.localeCompare(y.a.artist) || x.a.year - y.a.year);
  }
  const order = [...favSet];
  return items.slice().sort((x, y) => order.indexOf(albumKey(x.a)) - order.indexOf(albumKey(y.a)));
}
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
  // myStampsのキーは albumKey か albumKey#トラック名/yt:動画ID なので、
  // '#'より前だけ見ればディスク単位に集約できる。
  const stampedAlbumKeys = new Set(
    Object.entries(myStamps).filter(([, ids]) => ids.length).map(([k]) => k.split('#')[0]));
  const stampedItems = all.filter(({ a }) => stampedAlbumKeys.has(albumKey(a)));
  const total = new Set([...favsHave, ...favsWant]).size;

  const section = (tab, title, items) => `
    <div class="fav-section" data-tab="${tab}"${tab === favTab ? '' : ' hidden'}>
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
        <div class="fav-io">
          <button class="tr-toggle" id="favExport">${t('exportCsv')}</button>
          <button class="tr-toggle" id="favImportBtn">${t('importCsv')}</button>
          <input type="file" id="favImportFile" accept=".csv,text/csv" hidden>
          <span class="form-msg" id="favIoMsg"></span>
        </div>
      </div>
    </details>
    <div class="fav-tabs">
      <button class="fav-tab${favTab === 'want' ? ' on' : ''}" data-tab="want">${t('want')} <span class="cnt">${wantItems.length}</span></button>
      <button class="fav-tab${favTab === 'have' ? ' on' : ''}" data-tab="have">${t('have')} <span class="cnt">${haveItems.length}</span></button>
      <button class="fav-tab${favTab === 'stamped' ? ' on' : ''}" data-tab="stamped">${t('stamp')} <span class="cnt">${stampedItems.length}</span></button>
    </div>
    <label class="fav-sort">${t('sortBy')}
      <select id="favSortSelect">
        <option value="added"${favSort === 'added' ? ' selected' : ''}>${t('sortAdded')}</option>
        <option value="region"${favSort === 'region' ? ' selected' : ''}>${t('sortRegion')}</option>
        <option value="artist"${favSort === 'artist' ? ' selected' : ''}>${t('sortArtist')}</option>
      </select>
    </label>
    ${section('want', t('wantSection'), wantItems)}
    ${section('have', t('haveSection'), haveItems)}
    ${section('stamped', t('stampedSection'), stampedItems)}`;
  listEl.querySelector('.close').addEventListener('click', closeList);

  listEl.querySelectorAll('.fav-tab').forEach((btn) => {
    btn.addEventListener('click', () => {
      favTab = btn.dataset.tab;
      listEl.querySelectorAll('.fav-tab').forEach((b) => b.classList.toggle('on', b === btn));
      listEl.querySelectorAll('.fav-section').forEach((sec) => { sec.hidden = sec.dataset.tab !== favTab; });
    });
  });
  listEl.querySelector('#favSortSelect').addEventListener('change', (ev) => {
    favSort = ev.target.value;
    renderFavs(false);
  });

  const $sname = listEl.querySelector('#streetNameVal');
  const $syncMsg = listEl.querySelector('#streetSyncMsg');
  ensureStreetName().then((n) => { $sname.textContent = n || '—'; });
  listEl.querySelector('#streetReroll').addEventListener('click', async () => {
    if (!(await confirmDialog(t('rerollConfirm')))) return;
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

  // セクションの表示順は ホシイ→持ッテル→自分のスタンプ(DOM上の1つ目がwant)
  const [wantGrid, haveGrid, stampedGrid] = listEl.querySelectorAll('.fav-section .grid');
  const fillGrid = (grid, items, empty, favSet) => {
    if (!items.length) { grid.innerHTML = `<p style="font-size:12px">${empty}</p>`; return; }
    let lastGroup = null;
    sortFavItems(items, favSet).forEach(({ a, r }) => {
      const groupLabel = favSort === 'artist' ? a.artist : favSort === 'region' ? r.name : null;
      if (groupLabel != null && groupLabel !== lastGroup) {
        lastGroup = groupLabel;
        const h = document.createElement('h4');
        h.className = 'fav-group-heading';
        h.textContent = groupLabel;
        grid.appendChild(h);
      }
      const c = albumCard(a, true); // お気に入り画面は自分だけの空間: 自分のスタンプだけ出す
      c.querySelector('.album-info .m').insertAdjacentHTML('beforeend', ` / <b>${r.name}</b>`);
      grid.appendChild(c);
    });
  };
  fillGrid(haveGrid, haveItems, t('favEmpty'), favsHave);
  fillGrid(wantGrid, wantItems, t('favEmpty'), favsWant);
  fillGrid(stampedGrid, stampedItems, t('stampedEmpty'), stampedAlbumKeys);

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
document.getElementById('favBtn').addEventListener('click', () => {
  // 開いてる状態でもう一度押したら閉じる(トグル)
  if (listView === 'favs' && document.body.classList.contains('detail')) {
    navBack();
    return;
  }
  document.body.classList.remove('stamps-open'); // 墓石アイコンのドロワーと同時に開かせない
  renderFavs();
});
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

// 墓石メニュー: 絞り込みドロワーの開閉。お気に入り画面と同時には開かせない
document.getElementById('stampMenuBtn').addEventListener('click', () => {
  const opening = !document.body.classList.contains('stamps-open');
  if (opening && listView === 'favs' && document.body.classList.contains('detail')) {
    navBack();
  }
  document.body.classList.toggle('stamps-open');
});

// 投稿・言語ボタンはPC/モバイル共通でドロワー下部のセクションへ移す
function placeActionButtons() {
  const submitB = document.getElementById('submitBtn');
  const langB = document.getElementById('langBtn');
  document.getElementById('drawerActions').append(submitB, langB);
}
placeActionButtons();

// ディスクのチップ(0件を除いた集計表示専用。押すのは曲側のスタンプ枠)
function discChip(album, s) {
  const key = albumKey(album);
  const b = document.createElement('button');
  b.className = 'stamp agg' + (stampsAt(key).includes(s.id) ? ' mine' : '');
  b.style.color = s.color;
  b.innerHTML = `<span>${stampName(s)}</span><span class="count">${stampCount(album, s.id)}</span>`;
  return b;
}

function trackRow(album, track, idx, rerender) {
  const key = trackKey(album, track.name);
  const row = document.createElement('div');
  row.className = 'track';
  row.innerHTML = `
    <button class="tp" title="この曲を再生">▶</button>
    <span class="no">${String(idx + 1).padStart(2, '0')}</span>
    <span class="name">${track.name}</span>
    <span class="tag-badges"></span>
    <button class="stamp-slot" title="この曲にスタンプ">＋</button>`;

  const badges = row.querySelector('.tag-badges');
  paintTagBadges(badges, key);
  const slot = row.querySelector('.stamp-slot');
  const paintSlot = () => {
    const id = stampsAt(key)[0];
    const s = id && STAMPS.find((x) => x.id === id);
    slot.classList.toggle('set', !!s);
    slot.style.color = s ? s.color : '';
    slot.textContent = s ? stampName(s) : '＋';
    slot.title = s ? `${stampName(s)}(タップで変更)` : 'この曲にスタンプ';
  };
  paintSlot();

  row.querySelector('.tp').addEventListener('click', () => {
    const e = enrichOf(album);
    playSingle({ title: track.name, artist: album.artist, preview: track.preview, youtube: null, art: artUrl(e, 100, album), album });
  });
  slot.addEventListener('click', () => {
    openStampPicker(key, track.name,
      (id) => { toggleStampAt(key, id); paintSlot(); rerender(); },
      () => paintTagBadges(badges, key));
  });
  return row;
}

// ---------- 再生キュー ----------
// iTunes の30秒試聴(previewUrl)を HTML5 Audio で連続再生する。
// 曲が終わると ended → next() で次の曲へ。アルバム単位でキューに積む。
// ※フル再生に広げるときは YouTube IFrame API / Spotify 埋め込みをここに足す。
let queue = [], cursor = -1;
// キューが空の時の▶(ランダム再生)から始まった連続再生かどうか。trueの間は
// next()がアルバムを使い切っても地域内の次のアルバムへ進まず、続けて別の
// ランダムなアルバムへ飛ぶ。ユーザーが自分で何かを選んで再生した時点で解除する。
let shuffleMode = false;
// 地域一覧のシャッフルボタンから始めた場合はその地域。null なら全地域から
// ランダムに選ぶ(キューが空の時の▶)。exitShuffle()/クリアで解除する。
let shuffleRegion = null;
// シャッフル中、今の盤の最後の曲まで来た時点で次に流す盤をあらかじめ決めて
// おく(先読み用)。next()側で使い切ったらnullに戻す。
let pendingShuffleAlbum = null;
// ユーザー自身が▶/⏸で一時停止したかどうか。バックグラウンドで再生が
// 落ちた場合と区別し、後者だけ復帰時に自動再開する。
let userPaused = false;
// 再生役と先読み役の2つのAudio要素を交互に使う(要素スワップ方式)。
// 同じ要素へのsrc差し替えは曲境界で新規フェッチの無音のすき間を生み、
// 背面のAndroidではその間にメディア通知が破棄され再生も止まることがある。
// 先読みでバッファ済みの要素へ丸ごと切り替えれば、すき間なく次曲が
// 鳴り始めるため通知が生き残る。リスナーは両要素に付けるが、ハンドラは
// 「今の再生役(audio)」のイベントだけに反応する。
const audioA = new Audio();
const audioB = new Audio();
audioA.preload = 'auto';
audioB.preload = 'auto';
let audio = audioA;        // 再生役
let preloadAudio = audioB; // 先読み役(playCurrentのスワップで入れ替わる)
[audioA, audioB].forEach((el) => el.addEventListener('ended', () => { if (el === audio) next(); }));

// シャッフルをやめてユーザー選択の再生に切り替える。プレイリスト連結の
// 先読みでキューに実体化していた未再生のランダムアルバム(shuffleAuto印)は
// ここで取り除く(残すと、選んだアルバムの後に選んでいないランダム連結分が
// 延々と続いてしまう)。今流れている曲自体は消さない。
function exitShuffle() {
  shuffleMode = false;
  shuffleRegion = null;
  pendingShuffleAlbum = null;
  let removed = false;
  for (let i = queue.length - 1; i > cursor; i--) {
    if (queue[i].shuffleAuto) { queue.splice(i, 1); removed = true; }
  }
  // キューから消した分だけYouTubeプレイヤー上のプレイリストと中身がズレる
  // ので、控えを破棄して次の再生時に載せ直させる
  if (removed) resetYtPlaylist({ keepIntent: true });
}

// キューの次の曲(シャッフル中で盤の末尾まで来ている場合は、先読み済み/
// これから先読みする次の盤の1曲目)の試聴を先読みしておく。
// 先読みは<audio>のpreloadに任せず、fetch()で音声データをblobとして確実に
// ダウンロードしてから持たせる。スマホのChromeは背面(画面OFF)だと隠れた
// audio要素のpreloadフェッチを後回しにすることがあり、スワップしても中身が
// 空→その場でネットワーク取得→凍結、が起きていた(PCでは起きない)。
// 再生中のタブのfetch()は背面でも通常どおり動くため、こちらは確実に届く。
// 各要素が「どの試聴URLを表しているか」は_previewUrlで持ち回る
// (blob URLはsrc比較に使えないため)。
let preloadFetchingFor = null; // 二重フェッチ防止(取得中のpreview URL)
function assignTrack(el, previewUrl, srcUrl) {
  if (el.src && el.src.startsWith('blob:')) URL.revokeObjectURL(el.src);
  el.src = srcUrl || previewUrl;
  el._previewUrl = previewUrl;
}
function clearTrack(el) {
  if (el.src && el.src.startsWith('blob:')) URL.revokeObjectURL(el.src);
  el.removeAttribute('src');
  el._previewUrl = null;
}
async function preloadNextTrack() {
  let nextItem = queue[cursor + 1];
  if (!nextItem && shuffleMode && cursor === queue.length - 1) {
    if (!pendingShuffleAlbum) pendingShuffleAlbum = randomPlayableAlbum();
    nextItem = pendingShuffleAlbum ? trackItemsOf(pendingShuffleAlbum)[0] : null;
  }
  if (!nextItem?.preview) return;
  const url = nextItem.preview;
  if (preloadAudio._previewUrl === url || preloadFetchingFor === url) return;
  preloadFetchingFor = url;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`preload fetch ${res.status}`);
    const blob = await res.blob();
    if (preloadFetchingFor !== url) return; // 取得中に別の曲へ移っていたら破棄
    assignTrack(preloadAudio, url, URL.createObjectURL(blob));
    preloadAudio.load();
  } catch {
    // fetchが通らない環境では従来どおり要素のpreloadに任せる(無いよりまし)
    if (preloadFetchingFor === url) { assignTrack(preloadAudio, url); preloadAudio.load(); }
  } finally {
    if (preloadFetchingFor === url) preloadFetchingFor = null;
  }
}

// ---------- iTunes試聴の開始見張り(scheduleYtStartCheckのaudio版) ----------
// 曲境界の「src差し替え+play()一発勝負」は、背面(画面OFF)では読み込みが
// 停滞したり失敗したりする。失敗すると仕様上pausedがfalseのまま残るため、
// 「audio.pausedを見る」復帰経路が全てすり抜けて恒久停止になっていた。
// YouTube側と同じ規約(3秒→倍々→上限60秒、userPausedで抑止、再生開始で解除)で
// リトライし、srcを張り直しても失敗が続く曲(失効URL等)はスキップして先へ進む。
let audioStartCheckTimer = null;
let audioStartRetryDelay = 3000;
let audioErrorRetries = 0;
// audioの再生を試み始めた時刻。曲の切り替わり直後はOS/Chromeがメディア
// セッションを作り直すレースがあり、その最中に偽物のpauseが届いて
// 「次の曲が一瞬鳴って消える」ことがある。この時刻から1秒以内のpauseは
// ユーザー操作ではなくレース起因とみなして再生を続行する。
let lastAudioStartAt = 0;
// システム起因pauseの自動復帰を「1回の再生開始につき1度だけ」にする印
// (lastAudioStartAtと一致=この曲では復帰済み)。2回止められたら従う。
let audioAutoResumeUsedAt = -1;
function scheduleAudioStartCheck() {
  clearTimeout(audioStartCheckTimer);
  audioStartCheckTimer = setTimeout(() => {
    if (userPaused) return;
    const q = queue[cursor];
    if (!q?.preview) return; // YouTube曲/空キューに移った後は何もしない
    if (!audio.paused && !audio.ended && audio.readyState >= 3) { audioStartRetryDelay = 3000; return; } // 鳴っている
    if (!audio.error && audio.networkState === HTMLMediaElement.NETWORK_LOADING) { scheduleAudioStartCheck(); return; } // まだ読み込み中
    audioStartRetryDelay = Math.min(audioStartRetryDelay * 2, 60000);
    if (audio.error && ++audioErrorRetries > 2) { next(); return; } // src再設定でも失敗が続く=失効URL等。スキップ
    playAudioForCursor();
  }, audioStartRetryDelay);
}
// エラー状態の要素はplay()がresource selectionを再実行しないため、
// srcを張り直してから再生する。play()の再生開始は見張りに委ねる。
function playAudioForCursor() {
  const q = queue[cursor];
  if (!q?.preview) return;
  if (audio.error || audio._previewUrl !== q.preview) assignTrack(audio, q.preview);
  // 背面凍結明けなどでロードが空のまま止まっている(エラーでもロード中でも
  // ない)要素はplay()しても無反応なので、読み込みを蹴り直してから鳴らす
  else if (audio.readyState === 0 && audio.networkState !== HTMLMediaElement.NETWORK_LOADING) audio.load();
  lastAudioStartAt = Date.now();
  audio.play().catch((err) => {
    // 自動再生ブロックは「ユーザーの▶待ち」が正しい状態なので見張りも止める
    if (err?.name === 'NotAllowedError') clearTimeout(audioStartCheckTimer);
  });
  scheduleAudioStartCheck();
}
[audioA, audioB].forEach((el) => {
  el.addEventListener('playing', () => { if (el !== audio) return; audioStartRetryDelay = 3000; audioErrorRetries = 0; clearTimeout(audioStartCheckTimer); });
  // 再生途中の失敗(回線断等)も見張りに拾わせる(先読み役の失敗は対象外)
  el.addEventListener('error', () => { if (el === audio) scheduleAudioStartCheck(); });
});

// 曲の自然終了(ended)を待ってから次を鳴らすと、音が途切れた一瞬に
// Androidがメディア用フォアグラウンドサービスを畳み、そのままプロセスごと
// 凍結されて次曲のplay()自体が走らないことがある(アプリを開くと即再開する
// のは、前面昇格で凍結が解けて復帰処理が動くため)。まだ音が鳴っている
// 終了0.45秒前に、次曲の先読みが再生可能な状態まで進んでいる場合だけ
// 前倒しで曲送りし、「無音の瞬間」自体を作らない。
// 先読みが間に合っていない時は何もせず、従来のended→next()に任せる。
const EARLY_ADVANCE_SEC = 0.45;
let earlyAdvancing = false;
let preloadKickedFor = null; // 背面で先読みが後回しにされた時の読み直しを曲ごとに1回に制限
[audioA, audioB].forEach((el) => el.addEventListener('timeupdate', () => {
  if (el !== audio || userPaused || earlyAdvancing) return;
  if (!isFinite(el.duration) || el.duration <= 0) return;
  // 先読みがまだ次の曲を持てていなければ、曲の半ばで一度だけ取得を蹴り直す
  if (el.currentTime > el.duration / 2) {
    const expect = queue[cursor + 1]?.preview;
    if (expect && preloadAudio._previewUrl !== expect && preloadFetchingFor !== expect
        && preloadKickedFor !== expect) {
      preloadKickedFor = expect;
      preloadNextTrack();
    }
  }
  if (el.duration - el.currentTime > EARLY_ADVANCE_SEC) return;
  // 次のiTunes曲(シャッフル連結の次盤1曲目を含む)が先読み済みの時だけ前倒す
  let nxt = queue[cursor + 1];
  if (!nxt && shuffleMode && cursor === queue.length - 1 && pendingShuffleAlbum) {
    nxt = trackItemsOf(pendingShuffleAlbum)[0];
  }
  if (!nxt?.preview || preloadAudio._previewUrl !== nxt.preview || preloadAudio.readyState < 3) return;
  earlyAdvancing = true;
  try { next(); } finally { earlyAdvancing = false; }
}));

// バックグラウンドで再生が止まってしまっても、アプリに戻ってきたタイミングで
// (ユーザー自身が一時停止していない限り)自動で再生を再開する。
document.addEventListener('visibilitychange', () => {
  if (document.hidden || userPaused) return;
  const q = queue[cursor];
  if (!q) return;
  // 読み込み失敗時はpausedがfalseのまま残るので、pausedを条件にせず
  // playAudioForCursorに任せる(エラー状態ならsrc再設定から復帰する。
  // 正常再生中に呼ばれてもplay()は無害で、見張りは次の発火で自己解除)。
  if (q.preview) playAudioForCursor();
  // YouTube側はプレイリストの読み込み自体が背面で拒否されていた可能性が
  // あるので、単にplayVideo()するのではなくプレイヤーの中身を確かめて
  // 必要なら載せ直しからやり直す(playYtForCursorが両方を判断する)。
  // 「鳴ってはいるが控えと別のプレイリスト」という乖離も直したいので、
  // 再生中かどうかに関わらず通す(一致していれば何もしないので無害)。
  else if (q.youtube && ytReady) playYtForCursor();
});

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
// 自分(このウィンドウ)が最後に書いた/取り込んだ保存キューの生文字列。
// TWAアプリ⇄ブラウザタブのように同じlocalStorageを共有する別コンテキストが
// 書いた変更かどうかを、これとの差分で判定する(adoptExternalQueue参照)。
let lastQueueSnapshot = null;
// このキュー状態が最後に動いた時刻(端末間同期の勝敗判定用)。
// 「最近再生していた側が勝つ」ルールのため、localStorageにも永続化して
// リロード後も自分の状態の新しさを主張できるようにする。
const QUEUE_TS_KEY = 'gra.queue.ts.v1';
let lastQueueLocalTs = Number(localStorage.getItem(QUEUE_TS_KEY)) || 0;
// 一度だけの移行: v157以前のコードは保存のたびに時刻を更新していたため、
// 残っている時刻は「実際に再生した時刻」として信用できない(端末を開いた
// だけで最新を主張し、他端末の再生中キューを壊す事故が実際に起きた)。
// リセットして、次の実再生から主張し直す。それまではサーバー側が必ず勝つ。
if (!localStorage.getItem('gra.queue.ts.rebased')) {
  lastQueueLocalTs = 0;
  localStorage.removeItem(QUEUE_TS_KEY);
  localStorage.setItem('gra.queue.ts.rebased', '1');
}
function bumpQueueTs() {
  lastQueueLocalTs = Date.now();
  localStorage.setItem(QUEUE_TS_KEY, String(lastQueueLocalTs));
}
// スナップショットから「キューの中身」(曲構成+再生位置)だけを取り出す。
// playingフラグはリロードで勝手にfalseへ変わるため勝敗判定に含めない。
function queueCoreOf(snap) {
  if (!snap) return null;
  try { const s = JSON.parse(snap); return JSON.stringify({ cursor: s.cursor, items: s.items }); }
  catch { return null; }
}
function saveQueue() {
  if (queueRestoreDeferred) return; // 復元待ちの保存データを上書き破壊しない
  const items = queue.map((q) => (q.album
    ? { albumId: q.album.id, idx: q.idx ?? 0, ...(q.shuffleAuto ? { auto: 1 } : {}) }
    : null));
  const q = queue[cursor];
  // 直前が再生中だったか一時停止中だったかも記録する。リロード後、
  // 一時停止中だったのに問答無用で再生し始めてしまうのを防ぐため。
  const playing = q ? (q.youtube ? ytIsPlaying() : !audio.paused) : false;
  const prevCore = queueCoreOf(lastQueueSnapshot);
  lastQueueSnapshot = JSON.stringify({ cursor, items, playing });
  localStorage.setItem(QUEUE_KEY, lastQueueSnapshot);
  // 「最近再生していた側が勝つ」用の時刻は、キューの中身が実際に動いたときだけ
  // 更新する。以前は保存のたびに更新していたため、待機側の端末が開いた瞬間の
  // paint()→saveQueue()で自分を「最新」と誤認し、再生中の端末のキューを
  // 取り込まず逆に押し返して壊していた(スマホ⇄PC同期が効かない実バグ)。
  if (JSON.stringify({ cursor, items }) !== prevCore) bumpQueueTs();
  // 端末間同期(fav_sync.queue)へもデバウンス付きでプッシュ(下部の同期節参照)
  if (typeof schedulePushQueueSync === 'function') schedulePushQueueSync();
}
// リロード直後: キューの構成とカーソル位置だけ復元し曲情報を表示する。
// 自動再生はブラウザの制約で通らないことが多く、鳴りっぱなしも望ましくないため、
// 現在曲を「▶を押せばすぐ鳴る」状態(試聴はsrcセット、YouTubeはcue)まで
// 準備した上で一時停止のまま待つ。
// キュー復元の保留中フラグ。保存キューにSupabase由来の公開盤(albumId>=
// PUBLISHED_ID_OFFSET)が含まれる場合、起動直後はまだREGIONSに居らず
// albumById()で解決できない。以前はその盤を黙って捨てて不完全なキューを
// 復元し(=位置がズレて「定点の曲に戻る」)、直後のpaint()→saveQueue()が
// その壊れたキューで正しい保存データを上書き破壊していた。
// 解決できない盤があるうちは復元を保留し、loadPublishedReleases()完了後に
// やり直す。保留中はsaveQueue()を抑止して保存データを守る。
let queueRestoreDeferred = false;
function restoreQueue(force = false, allowAutoplay = true) {
  let saved;
  const raw = localStorage.getItem(QUEUE_KEY);
  try { saved = JSON.parse(raw || 'null'); } catch { saved = null; }
  if (!saved || !Array.isArray(saved.items) || !saved.items.length) return;
  if (!force && saved.items.some((it) => it && !albumById(it.albumId))) {
    queueRestoreDeferred = true;
    return;
  }
  queueRestoreDeferred = false;
  const restored = [];
  for (const it of saved.items) {
    if (!it) continue;
    const album = albumById(it.albumId);
    if (!album) continue;
    const item = trackItemsOf(album)[it.idx];
    if (item) {
      if (it.auto) item.shuffleAuto = true; // シャッフル連結の先読み分の印も復元する
      restored.push(item);
    }
  }
  if (!restored.length) return;
  lastQueueSnapshot = raw;
  queue = restored;
  cursor = Math.max(0, Math.min(saved.cursor, queue.length - 1));
  const q = queue[cursor];
  const wasPlaying = allowAutoplay && !!saved.playing;
  if (q?.preview) {
    assignTrack(audio, q.preview);
    if (wasPlaying) {
      // 直前が再生中だった場合のみ自動再生を試す。ブラウザに拒否されても
      // (その場合は▶待ちの一時停止状態になるだけで無害)、過去にこのサイトで
      // 再生操作をしたことがあるブラウザでは許可されることが多い。
      // 逆に直前が一時停止中だったなら、リロードしただけで鳴り出すのは
      // 望ましくないため何もしない。
      audio.play().catch(() => {});
    }
  } else if (q?.youtube) {
    playYtForCursor(!wasPlaying); // 再生中だった時だけ自動再生、それ以外はcueのみ
  }
  paint();
}

const $title = document.getElementById('playerTitle');
const $titleInner = $title.querySelector('.scroll-inner');
const $artist = document.getElementById('playerArtist');
const $art = document.querySelector('.player-art');
const $play = document.getElementById('playBtn');
// 再生バーの▶/⏸/シャッフルは絵文字グリフだと環境によって太さ・位置が
// バラつくため、他のヘッダーアイコンと同じSVG(currentColor)に統一する。
const PLAY_ICON_SVG = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M6 4l14 8-14 8V4z" fill="currentColor"/></svg>';
const PAUSE_ICON_SVG = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><rect x="5" y="4" width="5" height="16" fill="currentColor"/><rect x="14" y="4" width="5" height="16" fill="currentColor"/></svg>';
const SHUFFLE_ICON_SVG = `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
  <polyline points="16 3 21 3 21 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="4" y1="20" x2="21" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <polyline points="21 16 21 21 16 21" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="15" y1="15" x2="21" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <line x1="4" y1="4" x2="9" y2="9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>`;

// 曲名が枠に入りきらない時だけ、少し止まってスライドし後半を見せる
// マーキー演出を有効化する(入りきる曲名では何もしない)
// CSS @keyframesの割合指定だと「末尾で必ず1.5秒待つ」を曲名の長さに依らず
// 一定にできない(スライド区間の割合が曲ごとに変わってしまう)ため、
// スライド距離から等速(px/秒一定、イージング無し)の時間を計算し、
// transitionをJS側で組み立てて回す。末尾到達後は1.5秒待ってから
// アニメーション無しで瞬間的に先頭へ戻し、また等速でスライドし直す。
const MARQUEE_SPEED = 33; // px/秒(22の1.5倍。半分にしすぎたので中間へ戻す)
const MARQUEE_START_HOLD = 3000; // 先頭で待ってからスライドを始めるまでの時間(ms)
const MARQUEE_END_HOLD = 3000; // 末尾での停止時間(ms)
let marqueeTimer = null;
function updateTitleMarquee() {
  clearTimeout(marqueeTimer);
  marqueeTimer = null;
  $titleInner.style.transition = 'none';
  $titleInner.style.transform = 'translateX(0)';
  const overflow = $titleInner.scrollWidth - $title.clientWidth;
  if (overflow <= 4) return;
  const dist = overflow + 4;
  const slideMs = Math.max(1200, (dist / MARQUEE_SPEED) * 1000);
  const startSlide = () => {
    $titleInner.style.transition = 'none';
    $titleInner.style.transform = 'translateX(0)';
    void $titleInner.offsetWidth; // 強制リフローでリセットを確定させてからtransitionを再適用する
    $titleInner.style.transition = `transform ${slideMs}ms linear`;
    $titleInner.style.transform = `translateX(-${dist}px)`;
    marqueeTimer = setTimeout(() => {
      $titleInner.style.transition = 'none';
      $titleInner.style.transform = 'translateX(0)';
      marqueeTimer = setTimeout(loop, 30); // リセットの反映を待ってから再スタート
    }, slideMs + MARQUEE_END_HOLD);
  };
  const loop = () => {
    marqueeTimer = setTimeout(startSlide, MARQUEE_START_HOLD);
  };
  loop();
}

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
    return vids.map((vid) => ({ title: ytTitleCache[vid] || album.title, artist: album.artist, preview: null, youtube: vid, art, album }));
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
  exitShuffle(); // ランダム再生中でも、個別に選んで▶したら通常再生に戻す
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

// 単曲の▶:
// - 再生が進行中(シャッフル・通常問わず)の場合は、選んだ1曲だけを現在位置の
//   直後へ割り込ませ、聴き終えたら元のキューの続きへ自然に戻る(ユーザー要望)。
//   シャッフル状態も連結済みキューもそのまま維持する。割り込まれていた曲は
//   cursorの後ろに残る=再生済み扱いになり、シャッフルの再選定からも
//   除外され続ける(randomPlayableAlbumはキュー全体を既出とみなすため)。
// - 何も再生していない場合は従来どおり、その曲以降をアルバム順で並べて
//   通常再生を始める(1曲で止まると使い勝手が悪いため)。
function playSingle(item) {
  const items = trackItemsOf(item.album);
  const idx = items.findIndex((it) =>
    (item.preview && it.preview === item.preview) || (item.youtube && it.youtube === item.youtube));
  const cur = queue[cursor];
  if (cur && (cur.preview || cur.youtube)) {
    // 今流れている曲そのものをタップした場合は頭から流し直すだけ
    if ((item.preview && cur.preview === item.preview)
      || (item.youtube && cur.youtube === item.youtube)) { playCurrent(); return; }
    const one = idx >= 0 ? items[idx] : { ...item };
    queue.splice(cursor + 1, 0, one);
    cursor++;
    resetYtPlaylist({ keepIntent: true }); // 途中挿入でYouTubeプレイリスト側とズレるので載せ直させる
    playCurrent();
    return;
  }
  exitShuffle(); // 通常再生に戻す(進行中の再生が無い時だけ)
  const rest = idx >= 0 ? items.slice(idx) : [item];
  const insertPos = Math.max(cursor, 0);
  queue.splice(insertPos, queue.length - insertPos, ...rest);
  cursor = insertPos;
  playCurrent();
}

// 「＋ キューニ追加」: 今の再生を止めず、手動ブロックの末尾に足す。
// キューは常に「手動追加 → 自動追加(shuffleAuto)」の順を保つ(ユーザー指定)。
// 以前は単純に末尾へpushしていたため、シャッフル中は自動連結済みの
// 最大10曲の後ろに積まれてしまい「追加したのに全然流れない」状態だった。
// 何も再生していなければ即再生と同じ(先頭に差し込むのと変わらない)。
function enqueueAlbum(album) {
  if (!queue.length) { playAlbum(album); return; }
  if (albumQueueIndex(album) !== -1) return; // 既にキュー済みなら何もしない(連打対策)
  const items = trackItemsOf(album);
  if (!items.length) return; // 試聴の無い盤は積んでも仕方ないので何もしない
  // cursorより後ろで最初に現れる自動追加分の直前 = 手動ブロックの末尾
  let pos = queue.length;
  for (let i = Math.max(cursor, 0) + 1; i < queue.length; i++) {
    if (queue[i].shuffleAuto) { pos = i; break; }
  }
  queue.splice(pos, 0, ...items);
  resetYtPlaylist({ keepIntent: true }); // 途中挿入でYouTubeプレイリスト側とズレるので載せ直させる
  saveQueue();
  paint();
}

// ---------- YouTube IFrame Player(iTunesに試聴の無い盤の代替再生用) ----------
// #ytHost は1x1px・opacity:0の非表示ホスト(style.css)。映像は見せず音声だけ
// 使う。iTunes試聴とテンポを揃えるため30秒で打ち切る(endSeconds)。
let ytPlayer = null, ytReady = false;
// YouTube盤は以前、動画を1本ずつloadVideoByIdで差し替えていたが、それだと
// 曲が変わるたびにiframe内の再生が作り直され「新規再生」の扱いになるため、
// バックグラウンドでは開始を拒否されて そこで止まっていた
// (曲が終わった瞬間にロック画面の再生コントロールごと消えるのが目印だった。
// iTunes試聴は同じ<audio>要素のsrcを差し替えるだけで要素が生き続けるので、
// 曲をまたいでもコントロールが出たままになる ─ この差が原因)。
// そこでキュー上で連続しているYouTube動画をまとめてプレイリストとして渡し、
// 曲送りそのものをYouTube側にやらせる。こちらから再生を開始し直さないので、
// 背面でも<audio>と同じように再生が継続することを狙っている。
// 30秒カット(endSeconds)はプレイリスト再生では使えないため、下の見張り
// タイマー(1秒間隔)が再生位置を見てnextVideo()で刻む。音が鳴っている
// タブのタイマーはOSの間引き対象外なので背面でもおおむね機能し、万一
// 間引かれてもその曲がフル尺で流れ続けるだけで停止はしない(安全側の劣化)。
let ytPlaylistIds = null; // 今プレイヤーに載せている(つもりの)動画IDの並び
let ytPlaylistBase = -1; // その1本目がqueueの何番目にあたるか
let ytPendingPlaylist = null; // プレイヤー準備前に再生要求が来た場合の保留分
// 明示的な曲移動(playVideoAt/プレイリスト載せ直し)の直後は、移動前の古い
// indexを載せたonStateChangeが遅れて届くことがある。移動先のindexを控えて
// おき、それが観測されるまで同期を保留する(cursorの一瞬の巻き戻り防止)。
let ytExpectedIndex = null;
// nextVideo()/onErrorスキップで曲送りを指示した後の遷移の控え {to, at, kicked}。
// 遷移がBUFFERING以外で止まったまま一定時間経ったら、非破壊のplayVideoAtで
// 一度だけ蹴る(30秒見張り参照)。
let ytTransition = null;
// 最後に実際にPLAYINGを観測した時刻。「再生中か」の判定(playbackActive)で、
// 意図フラグが立ちっぱなしのまま固まった状態(自動再生拒否後のリロード等)を
// 再生中と誤認しないための証拠に使う。
let ytLastPlayingAt = 0;
// ユーザーが再生を意図しているか(cueだけの時はfalse)。リロード復元直後の
// エラーで勝手に鳴り出したりしないよう、onErrorの自動スキップを制御する。
let ytPlaybackIntended = false;
let ytErrorSkippedKey = null; // 同じ動画のonError連続発火で二重スキップしないための控え
let ytAutoResumeUsedKey = null; // システム起因PAUSEDの自動復帰を動画ごとに1回に制限する印
// keepIntent: キュー編集(＋追加・挿入・絞り込み整理)で控えだけ捨て、再生自体は
// 続く場合に指定する。以前は無条件に再生意図を落としていたため、30秒見張りと
// 自動復帰が止まり、その動画がフル尺で流れる実バグになっていた。
function resetYtPlaylist({ keepIntent = false } = {}) {
  ytPlaylistIds = null;
  ytPlaylistBase = -1;
  ytPendingPlaylist = null; // 保留中の載せ込みも破棄(放置するとonReady時にゴースト再生される)
  ytExpectedIndex = null;
  ytTransition = null;
  if (keepIntent) return;
  ytPlaybackIntended = false;
  clearTimeout(ytStartCheckTimer); // YouTube再生をやめたので開始見張りも止める
}
// プレイヤーに実際に載っているプレイリストが、こちらの控えと一致しているか。
// 背面で載せ直しが拒否された場合など、控えと実物がズレている間は
// cursor同期や見張りタイマーが虚構の状態を追わないようにするための確認。
function ytShadowMatchesActual() {
  if (!ytReady || !ytPlayer.getPlaylist || !ytPlaylistIds) return false;
  const actual = ytPlayer.getPlaylist();
  return !!(actual && actual.length === ytPlaylistIds.length
    && ytPlaylistIds.every((v, i) => v === actual[i]));
}
function initYtPlayer() {
  if (ytPlayer) return;
  ytPlayer = new YT.Player('ytHost', {
    height: '1', width: '1',
    playerVars: { controls: 0, disablekb: 1, playsinline: 1 },
    events: {
      onReady: () => {
        ytReady = true;
        if (ytPendingPlaylist) {
          const p = ytPendingPlaylist;
          ytPendingPlaylist = null;
          loadYtPlaylist(p.ids, p.index, p.cueOnly);
        }
      },
      onStateChange: (e) => {
        // 再生が始まったら、開始見張りのリトライ間隔をリセットして止める
        if (e.data === YT.PlayerState.PLAYING) {
          ytStartRetryDelay = 3000;
          clearTimeout(ytStartCheckTimer);
          ytLastPlayingAt = Date.now();
        }
        // システム起因で止められた場合の自動復帰(iTunes側と同じ規約)。
        // ユーザー操作の一時停止はuserPaused=trueが先に立つので、falseのままの
        // PAUSEDはシステム起因(プレイリスト切替後のフォーカス再交渉等)。
        // 同じ動画では1回だけ試み、2回止められたら本物として従う。
        if (e.data === YT.PlayerState.PAUSED && ytPlaybackIntended && !userPaused) {
          const vd = ytPlayer.getVideoData && ytPlayer.getVideoData();
          const key = vd?.video_id || 'unknown';
          if (ytAutoResumeUsedKey !== key) {
            ytAutoResumeUsedKey = key;
            ytPlayer.playVideo();
          }
        }
        // YouTubeが自動で次の動画へ進んだ分を、こちらの再生位置へ反映する
        // (曲送りをYouTube側に任せているので、cursorは後追いで合わせる)
        syncCursorToYtPlaylist();
        // 再生中の動画の実タイトルをプレイヤーから直接取り、再生バーに出す
        // (キュー構築時はまだタイトル不明でアルバム名を仮置きしているため、
        // 判明したここで差し替える。oEmbedを引きに行く必要はない)。
        const vd = ytPlayer.getVideoData && ytPlayer.getVideoData();
        if (vd?.video_id && vd?.title) {
          setYtTitle(vd.video_id, vd.title);
          const q = queue[cursor];
          if (q?.youtube === vd.video_id && q.title !== vd.title) q.title = vd.title;
        }
        if (e.data === YT.PlayerState.ENDED) {
          // プレイリストの途中ならYouTubeが自動で次へ進むので何もしない。
          // 最後の1本を終えた時だけ、こちらで次のアルバムへ送る。
          // 実物と控えがズレている間(背面で載せ直しが拒否された等)のENDEDは
          // 虚構の位置でnext()しないよう無視する(前面復帰時に立て直す)。
          // next()が進めなかった(キューの続きが無い)場合は停止扱いにする。
          // 意図フラグが立ったままだと、何も鳴っていないのに「再生中」と
          // 判定され続け、端末間同期の取り込みが永久にブロックされる
          const endedBefore = cursor;
          let advanced = false; // こちらからnext()を試みたか(YouTube側の自動曲送りや控え不一致時は対象外)
          if (!ytPlaylistIds) {
            next();
            advanced = true;
          } else if (ytShadowMatchesActual()) {
            const i = ytPlayer.getPlaylistIndex ? ytPlayer.getPlaylistIndex() : -1;
            if (i < 0 || i >= ytPlaylistIds.length - 1) { next(); advanced = true; }
          }
          if (advanced && cursor === endedBefore && queue[cursor]?.youtube) {
            userPaused = true;
            // 控えが無い=プレイヤー側には古いプレイリストが載ったまま。止めないと
            // キューから消したはずの次の動画へYouTubeが自動で進んで鳴り続ける
            if (!ytPlaylistIds) ytPlayer.stopVideo();
          }
        }
        paint();
      },
      // 埋め込み禁止・地域ブロック・削除済みなどでYouTubeがエラーを返した場合、
      // 以前は何も起きずそこで永久に停止していた。埋め込みプレイヤーは
      // watchページと違いエラー動画を自動スキップしないので、こちらで
      // 即座に次へ送る(背面ではタイマーが間引かれるためsetTimeoutは不可)。
      // cueだけの時(リロード復元直後)やユーザー停止中は勝手に鳴らさない。
      onError: () => {
        if (!ytPlaybackIntended || userPaused) return;
        const i = ytPlaylistIds && ytPlayer.getPlaylistIndex ? ytPlayer.getPlaylistIndex() : -1;
        const key = ytPlaylistIds && i >= 0 ? `${ytPlaylistBase}:${i}:${ytPlaylistIds[i]}` : 'single';
        if (ytErrorSkippedKey === key) return; // 同じ動画での連続発火による二重スキップ防止
        ytErrorSkippedKey = key;
        if (ytPlaylistIds && i >= 0 && i < ytPlaylistIds.length - 1) { noteYtTransition(i + 1); ytPlayer.nextVideo(); }
        else {
          const before = cursor;
          next();
          if (cursor === before) userPaused = true; // 進めなかった=停止扱い(意図の立ちっぱなし防止)
        }
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
// loadPlaylistは即再生してしまうため、ユーザーが▶を押すまで待つ場合はcuePlaylistを使う)。
function loadYtPlaylist(ids, index, cueOnly = false) {
  if (!ytReady) { ytPendingPlaylist = { ids, index, cueOnly }; return; }
  ytPlayer[cueOnly ? 'cuePlaylist' : 'loadPlaylist']({ playlist: ids, index, startSeconds: 0 });
  if (!cueOnly) scheduleYtStartCheck();
}

// 再生開始の見張り。バックグラウンドのタブではYouTubeの再生開始が
// ブラウザ/プレイヤー側に握り潰されることがある(iTunes→YouTubeの
// 切り替え時に無音で止まる報告があった)。開始を指示してから数秒たっても
// 再生が始まっていなければ、もう一度だけ蹴り直す(それでもダメなら
// 間隔を倍にして繰り返し、上限60秒。タブ復帰時のvisibilitychange処理でも
// 立て直すので、ここは背面のままでも復帰できるようにする保険)。
let ytStartCheckTimer = null;
let ytStartRetryDelay = 3000;
function scheduleYtStartCheck() {
  clearTimeout(ytStartCheckTimer);
  ytStartCheckTimer = setTimeout(() => {
    if (!ytPlaybackIntended || userPaused) return;
    if (!queue[cursor]?.youtube) return;
    if (ytIsPlaying()) { ytStartRetryDelay = 3000; return; }
    const st = ytReady && ytPlayer.getPlayerState ? ytPlayer.getPlayerState() : null;
    if (st === YT.PlayerState.BUFFERING) { scheduleYtStartCheck(); return; } // まだ読み込み中、待つ
    ytStartRetryDelay = Math.min(ytStartRetryDelay * 2, 60000);
    // 2回目以降のリトライでも始まらないのは、背面でプレイヤー自体が
    // 壊されていてplayVideo()が虚空に消えている状態が多い。その場合
    // 「載っているから頭出しだけ」の高速パスを通り続けると永遠に無反応な
    // ままなので(▶を押しても直らない報告の原因)、控えを捨てて
    // フル再構築(loadPlaylist)へエスカレーションする。
    if (ytStartRetryDelay >= 6000) resetYtPlaylist();
    playYtForCursor(); // 状態を見て再開/載せ直しを判断してくれる
  }, ytStartRetryDelay);
}

// 今のcursorが指すYouTube動画を、プレイリストとして再生する。
// queue上でYouTube動画が連続している範囲(アルバムをまたいでもよい)を
// そのまま1本のプレイリストにする。プレイリストの載せ直し=「新規再生」は
// 背面では拒否されるため、境界を減らすほどバックグラウンド再生が切れにくい。
const YT_PLAYLIST_MAX = 60; // 1回のプレイリストに載せる動画数の上限
function playYtForCursor(cueOnly = false) {
  const q = queue[cursor];
  if (!q?.youtube) return;
  ytErrorSkippedKey = null; // 明示的な再生指示が来たのでエラースキップの抑止は解除
  ytTransition = null; // 明示的な再生/頭出し指示は、保留中の曲送り遷移の控えを無効にする
  ytPlaybackIntended = !cueOnly;
  // まず、プレイヤーに実際に載っているプレイリストの範囲内に今のcursorが
  // 収まっているなら、載せ直さず頭出し・再開だけで済ませる(載せ直し=
  // 「新規再生」は背面で拒否されるため、できる限り避ける)。
  // 窓を毎回計算し直して比較すると、再生が進むにつれ窓がずれて
  // 「同じプレイリストなのに別物」と誤判定し、⏭のたびに載せ直してしまう
  // ため、判定は「実物の範囲にcursorが入っているか」で行う。
  if (ytShadowMatchesActual()) {
    const rel = cursor - ytPlaylistBase;
    const actual = ytPlayer.getPlaylist();
    const inLoaded = rel >= 0 && rel < actual.length
      && actual.every((v, i) => queue[ytPlaylistBase + i]?.youtube === v); // キュー組み替え検出
    if (inLoaded) {
      if (ytPlayer.getPlaylistIndex && ytPlayer.getPlaylistIndex() === rel) {
        if (!cueOnly && !ytIsPlaying()) { ytPlayer.playVideo(); scheduleYtStartCheck(); }
      } else if (!cueOnly && ytPlayer.playVideoAt) {
        ytExpectedIndex = rel;
        ytPlayer.playVideoAt(rel);
        scheduleYtStartCheck();
      }
      return;
    }
  }
  // 現在地の手前は⏮用に少しだけ、先はできるだけ長く載せる(上限あり)。
  // 巨大な連続範囲(例: 動画100本超のアルバム)でも、cursorが必ず
  // プレイリストの中に収まるように手前側の伸長は控えめにする。
  let start = cursor;
  while (start > 0 && queue[start - 1].youtube && cursor - start < 20) start--;
  let end = cursor;
  while (end < queue.length - 1 && queue[end + 1].youtube && end - start + 1 < YT_PLAYLIST_MAX) end++;
  // シャッフル中でキューの末尾までYouTube盤が続いているなら、この先の
  // ランダムなアルバムもYouTube盤である限り今のうちにキューへ足して同じ
  // プレイリストに連結しておく(アルバム境界での載せ直しをなくすため)。
  if (shuffleMode && end === queue.length - 1) {
    while (end - start + 1 < YT_PLAYLIST_MAX) {
      const album = pendingShuffleAlbum || randomPlayableAlbum();
      pendingShuffleAlbum = null;
      if (!album) break;
      const items = trackItemsOf(album);
      if (!items[0]?.youtube) {
        pendingShuffleAlbum = album; // 次はiTunes盤 → 境界確定。先読み用に取っておく
        break;
      }
      // 連結で実体化した先読み分には印を付けておく。ユーザーが手動で何かを
      // 選んでシャッフルを抜けた時(exitShuffle)、この印を頼りに取り除く。
      items.forEach((it) => { it.shuffleAuto = true; });
      queue.push(...items);
      end = Math.min(queue.length - 1, start + YT_PLAYLIST_MAX - 1);
      if (queue[end].album !== album) break; // 上限で頭切れした場合はそこまで
    }
  }
  const ids = [];
  for (let i = start; i <= end; i++) ids.push(queue[i].youtube);
  const index = cursor - start;
  ytExpectedIndex = index;
  ytPlaylistIds = ids;
  ytPlaylistBase = start;
  loadYtPlaylist(ids, index, cueOnly);
}

// 30秒カットの見張り。endSecondsの代わりに再生位置を1秒間隔で確認し、
// 30秒を超えたらプレイリスト内の曲送り(nextVideo=内部継続なので背面でも
// 通る)で刻む。最後の1本ならnext()で次のアルバムへ。同じ動画への二重発火は
// キー(プレイリスト位置)で抑止する。
const YT_CLIP_SECONDS = 30;
let ytClipFiredKey = null;
const YT_TRANSITION_KICK_MS = 8000;
function noteYtTransition(to) { ytTransition = { to, at: Date.now(), kicked: false }; }
// 30秒に達した動画をキュー上の次へ送る。キューに続きが無ければnext()は何もしない
// ので、その場合はフル尺再生が続かないようこちらで止める(旧endSeconds相当)。
// userPausedも立てて、前面復帰時の自動再開で鳴り直さないようにする。
function cutYtClipToNext() {
  const before = cursor;
  next();
  if (cursor === before && queue[cursor]?.youtube) { userPaused = true; ytPlayer.pauseVideo(); }
}
setInterval(() => {
  if (!ytReady) return;
  // 曲送り後の遷移停滞の見張り。以前は遷移がBUFFERING/UNSTARTEDのまま止まると
  // 自己復帰の経路が無く、前面復帰かAndroid Autoの▶まで無音のままだった。
  // 非破壊のplayVideoAtで一度だけ蹴る(フル再構築はしない: 背面での載せ直しは
  // 拒否されて復帰不能に陥り得るため、それは前面復帰/明示的な▶に委ねる)
  if (ytTransition) {
    const idx = ytPlayer.getPlaylistIndex ? ytPlayer.getPlaylistIndex() : -1;
    const playing = ytIsPlaying();
    if (playing) ytLastPlayingAt = Date.now();
    if (playing && (idx === ytTransition.to || !ytShadowMatchesActual())) {
      ytTransition = null; // 遷移先で鳴り始めた(控えが別物になった時も追わない)
    } else if (!ytTransition.kicked && Date.now() - ytTransition.at > YT_TRANSITION_KICK_MS
      && ytPlaybackIntended && !userPaused && ytExpectedIndex === null && ytShadowMatchesActual()
      && ytTransition.to < ytPlaylistIds.length) {
      const st = ytPlayer.getPlayerState ? ytPlayer.getPlayerState() : null;
      // 蹴るのは「開始待ちで止まっている」(UNSTARTED/CUED)か「nextVideoが無視され
      // 旧動画が鳴り続けている」場合だけ。BUFFERINGは読み込み中なので待ち、
      // PAUSED/ENDEDは本物の停止(2回目の一時停止など)なので逆らわない
      const stalled = st === YT.PlayerState.UNSTARTED || st === YT.PlayerState.CUED
        || (st === YT.PlayerState.PLAYING && idx !== ytTransition.to);
      if (stalled && ytPlayer.playVideoAt) {
        ytTransition.kicked = true;
        ytExpectedIndex = ytTransition.to;
        ytPlayer.playVideoAt(ytTransition.to);
      }
    }
  }
  if (!ytIsPlaying()) return;
  ytLastPlayingAt = Date.now();
  if (!ytPlaylistIds) {
    // 控えを捨てた直後(キュー編集)で再生自体は続いている: プレイリストの曲送りは
    // 使えないので30秒でnext()に渡し、新しいキューから載せ直させる。
    // 以前はここで見張りが止まり、その動画がフル尺で流れていた
    if (!ytPlaybackIntended || userPaused) return;
    const vd = ytPlayer.getVideoData && ytPlayer.getVideoData();
    const key = `stale:${vd?.video_id || ''}`;
    if (ytClipFiredKey === key) return;
    const t = ytPlayer.getCurrentTime ? ytPlayer.getCurrentTime() : 0;
    if (t < YT_CLIP_SECONDS) return;
    ytClipFiredKey = key;
    // 曲送りの遷移中に控えを捨てた場合、YouTube側は次の動画へ進んでいるのに
    // cursorが前の曲を指したままのことがある。実際に鳴っている動画に
    // cursorを合わせてから次へ送る(同じ曲が二度流れるのを防ぐ)
    // 合わせるのは「直後の1曲」に限る。それより先まで飛ぶと、遷移中に手動追加
    // された盤を跨いで取りこぼす(同じ曲が二度流れるより目立つ)
    if (vd?.video_id && queue[cursor]?.youtube !== vd.video_id
      && queue[cursor + 1]?.youtube === vd.video_id) {
      cursor += 1;
      paint();
    }
    cutYtClipToNext();
    return;
  }
  if (ytExpectedIndex !== null) return; // 明示的な曲移動の完了待ち中は手を出さない
  if (!ytShadowMatchesActual()) return; // 実物と控えがズレている間は誤射しない
  const i = ytPlayer.getPlaylistIndex ? ytPlayer.getPlaylistIndex() : -1;
  if (i < 0) return;
  const key = `${ytPlaylistBase}:${i}:${ytPlaylistIds[i]}`;
  if (ytClipFiredKey !== null && ytClipFiredKey !== key) ytClipFiredKey = null; // 次の曲に進んだらガード解除
  if (ytClipFiredKey === key) return;
  const t = ytPlayer.getCurrentTime ? ytPlayer.getCurrentTime() : 0;
  if (t < YT_CLIP_SECONDS) return;
  ytClipFiredKey = key;
  if (i < ytPlaylistIds.length - 1) {
    noteYtTransition(i + 1);
    ytPlayer.nextVideo();
  } else {
    cutYtClipToNext();
  }
}, 1000);

// YouTubeが自前で曲送りした結果に、こちらのcursorを合わせる。
function syncCursorToYtPlaylist() {
  if (!ytPlaylistIds || ytPlaylistBase < 0) return;
  if (!ytReady || !ytPlayer.getPlaylistIndex) return;
  if (!ytShadowMatchesActual()) return; // 背面で載せ直しが拒否された等、実物が別物の間は触らない
  const i = ytPlayer.getPlaylistIndex();
  if (i < 0) return;
  if (ytExpectedIndex !== null) {
    if (i !== ytExpectedIndex) return; // 明示的な曲移動中に遅れて届く移動前のindexは無視
    ytExpectedIndex = null;
  }
  const target = ytPlaylistBase + i;
  if (target === cursor || target < 0 || target >= queue.length) return;
  if (queue[target]?.youtube !== ytPlaylistIds[i]) return; // キューが組み替わっていたら触らない
  cursor = target;
  saveQueue();
  // YouTube再生中はcursorがここで進む(playCurrentを通らない)ため、ここでも
  // ランウェイ補充と次曲の先読みを回す。特にYT区間の最後の動画を再生中に
  // 次のiTunes曲をバッファしておかないと、区間終端→next()の瞬間にコールド
  // ロードとなり、背面ではそのまま凍結して次が始まらない(2曲のYT盤終了時に
  // 止まる報告の原因)。
  ensureShuffleRunway();
  preloadNextTrack();
}
function ytIsPlaying() {
  return !!(ytReady && ytPlayer.getPlayerState && ytPlayer.getPlayerState() === YT.PlayerState.PLAYING);
}

function playCurrent() {
  // 先にランウェイを補充してからプレイリストを組む(YouTube盤の連結範囲に
  // 先のアルバムまで含めるため。iTunes側もqueue[cursor+1]が常に居る状態になり
  // 先読み・前倒し曲送りがアルバム境界でも機能する)
  ensureShuffleRunway();
  // 再生位置(cursor)を曲が変わるたびに保存する。以前は連結時にしか保存して
  // おらず、リロード後に「最後に連結が起きた時点の曲」へ戻ってしまっていた
  saveQueue();
  const q = queue[cursor];
  // 再生履歴(直近50曲)。プレイヤーの「N曲」タップで一覧表示できる。
  // キューが同期事故等で失われても「さっき聴いていた曲」を辿れる保険も兼ねる。
  if (q?.title) {
    try {
      const hist = JSON.parse(localStorage.getItem('gra.history.v1') || '[]');
      const last = hist[hist.length - 1];
      if (!last || last.t !== q.title || last.a !== q.artist) {
        hist.push({ a: q.artist, t: q.title, al: q.album?.title, ts: Date.now() });
        localStorage.setItem('gra.history.v1', JSON.stringify(hist.slice(-50)));
      }
    } catch { /* 履歴は保険なので失敗しても再生は続ける */ }
    markAlbumPlayed(q.album);
  }
  if (q?.preview) {
    if (ytReady) ytPlayer.stopVideo();
    resetYtPlaylist();
    // 先読み役に同じ曲がバッファ済みなら要素ごと入れ替え、すき間なく鳴らす
    // (背面でもネットワーク待ちゼロで開始でき、メディア通知が破棄されない)
    if (preloadAudio._previewUrl === q.preview && !preloadAudio.error) {
      audio.pause();
      [audio, preloadAudio] = [preloadAudio, audio];
      clearTrack(preloadAudio);
    } else {
      assignTrack(audio, q.preview);
    }
    audioErrorRetries = 0;
    playAudioForCursor(); // 再生開始は見張りつき(自動再生ブロック時はユーザーの▶待ち)
  } else if (q?.youtube) {
    audio.pause(); clearTrack(audio);
    clearTimeout(audioStartCheckTimer);
    playYtForCursor();
  } else {
    audio.pause(); clearTrack(audio);
    clearTimeout(audioStartCheckTimer);
    if (ytReady) ytPlayer.stopVideo();
    resetYtPlaylist();
  }
  userPaused = false; // 新しい曲の再生を始めたので、以前の一時停止状態は解除
  preloadNextTrack();
  paint();
}

// Media Session API: ロック画面/通知領域の再生コントロールとバックグラウンド再生に対応。
// 曲が変わるたびにメタデータを更新し、OS側の▶⏸/前後ボタンをこちらの操作につなぐ。
if ('mediaSession' in navigator) {
  // userPausedの更新を忘れると、OSのメディアキーで一時停止→再開した後の
  // 「ユーザーが止めたか」の判定がズレて、タブ復帰時の自動再開が誤って
  // 抑止されたままになる(再生バーの⏸/▶と復帰処理の両方が参照するため)。
  navigator.mediaSession.setActionHandler('play', () => {
    const q = queue[cursor];
    userPaused = false;
    if (q?.preview) playAudioForCursor(); // エラー状態でもsrc再設定から復帰できるように
    // playVideo()直呼びだと壊れたプレイヤーには無反応のままなので、
    // 見張りつきのplayYtForCursor経由にする(リトライ→フル再構築へ繋がる)
    else if (q?.youtube && ytReady) playYtForCursor();
  });
  navigator.mediaSession.setActionHandler('pause', () => {
    // 曲の切り替わり直後(<1秒)に届くpauseは、OS/Chromeのセッション再構築
    // レース起因の偽物のことがある(ユーザー操作ではない)。userPausedを
    // 立てると復帰時の自動再開まで封じてしまうので、無視して再生を続行する。
    // 本物のユーザー操作が開始後1秒以内に入る確率は実用上無視できる。
    if (queue[cursor]?.preview && Date.now() - lastAudioStartAt < 1000) {
      audio.play().catch(() => {});
      return;
    }
    userPaused = true;
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
  // YouTubeは30秒クリップ送りのたびに次動画の読み込みで数秒「非再生」状態に
  // なる。その間に'paused'を公表するとAndroidがメディア通知を畳む口実になる
  // ので、再生を続ける意図がある間(ytPlaybackIntended)は'playing'を維持する。
  navigator.mediaSession.playbackState = (q.youtube
    ? (ytIsPlaying() || (ytPlaybackIntended && !userPaused))
    : !audio.paused) ? 'playing' : 'paused';
}

function paint() {
  const q = queue[cursor];
  saveQueue();
  // 残り曲数の表示 兼 キューリスト/再生履歴画面を開くボタン
  document.getElementById('queueCount').textContent = t('qCount')(Math.max(0, queue.length - Math.max(cursor, 0)));
  // キューが空の間は、押すと年代・スタンプの絞り込み範囲内からランダム再生が
  // 始まることが見た目で分かるよう、シャッフルアイコンにする(配色は通常の
  // ▶と同じまま)。
  $play.innerHTML = !q ? SHUFFLE_ICON_SVG
    : ((q?.youtube ? ytIsPlaying() : !audio.paused) ? PAUSE_ICON_SVG : PLAY_ICON_SVG);
  syncMediaSession(q);
  if (!q) {
    $titleInner.textContent = t('qEmptyT');
    $artist.textContent = t('qEmptyA');
    $art.innerHTML = '♪';
    updateTitleMarquee();
    return;
  }
  $titleInner.textContent = q.title;
  $artist.textContent = (q.preview || q.youtube) ? q.artist : `${q.artist} — ${t('noAudio')}`;
  $art.innerHTML = q.art ? `<img src="${q.art}" alt="">` : '♪';
  updateTitleMarquee();
}

// キューがまだ残っていればそのまま進む。尽きたら、直前まで再生していた
// 曲のアルバムが属する地域から「次のアルバム」を並び順ベースで継ぎ足して
// 続ける(試聴の無いアルバムは飛ばす)。地域の末尾まで来たら自然に停止する。
function next() {
  // 音源なし盤のプレースホルダー(playAlbumが挿入する情報表示専用の項目)に
  // 'ended'連鎖が到達すると再生が恒久停止するため、次へ進む時は飛ばす。
  while (cursor < queue.length - 1) {
    cursor++;
    if (queue[cursor].preview || queue[cursor].youtube) { playCurrent(); return; }
  }
  if (shuffleMode) {
    const album = pendingShuffleAlbum || randomPlayableAlbum();
    pendingShuffleAlbum = null;
    if (album) {
      const items = trackItemsOf(album);
      // 他の連結経路と同様に印を付ける(exitShuffle/pruneShuffleQueueの対象にする)。
      // ここだけ付け漏れており、フィルター変更後も残り続ける原因になっていた
      items.forEach((it) => { it.shuffleAuto = true; });
      queue.push(...items);
      cursor++;
      playCurrent();
      return;
    }
  }
  const lastAlbum = queue[queue.length - 1]?.album;
  const region = lastAlbum && REGIONS.find((r) => r.albums.includes(lastAlbum));
  if (region) {
    const album = randomRegionFollowUp(region);
    if (album) {
      const items = trackItemsOf(album);
      items.forEach((it) => { it.shuffleAuto = true; });
      queue.push(...items);
      cursor++;
      playCurrent();
      return;
    }
  }
  paint();
}
function prev() { if (cursor > 0) { cursor--; playCurrent(); } }

// 非シャッフル時の自動継ぎ足し用: 同じ地域からランダムに1枚選ぶ。
// 以前は年代順で「次のアルバム」を継ぎ足していたが、シャッフル時と挙動が
// 割れて分かりにくいため「自動追加は全てランダム」に統一した(ユーザー指定)。
// 除外条件はrandomPlayableAlbumと同じだが、候補を聴き尽くしたら繰り返さず
// 自然に停止する(非シャッフルを無限ループさせない)。
function randomRegionFollowUp(region) {
  const base = albumsOf(region).filter((a) => autoplayEligible(a) && trackItemsOf(a).length > 0);
  const seen = new Set(queue.map((it) => it.album));
  const unseen = base.filter((a) => !seen.has(a));
  const fresh = unseen.filter((a) => !playedAlbumIds.has(a.id));
  const pool = fresh.length ? fresh : unseen;
  if (!pool.length) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

// 再生済みアルバムの永続セット。キューをクリアしても残り、履歴画面の
// 「履歴と再生済みをクリア」で初めて空になる(ユーザー要望: よく見るアルバムが
// キュークリア後にすぐ戻ってくるのを防ぐ)。曲がひとつでも実再生されたら
// そのアルバムを再生済みとする。
const PLAYED_KEY = 'gra.playedAlbums.v1';
// 「履歴と再生済みをクリア」した時刻。端末間同期でクリアを伝播させるために持つ
// (新しいクリアが勝ち、クリア前の古いデータが後から届いても巻き戻さない)。
const PLAYED_CLEARED_KEY = 'gra.playedCleared.v1';
let playedClearedAt = Number(localStorage.getItem(PLAYED_CLEARED_KEY)) || 0;
let playedAlbumIds = new Set();
try { playedAlbumIds = new Set(JSON.parse(localStorage.getItem(PLAYED_KEY) || '[]')); } catch { /* 壊れていたら空から */ }
function markAlbumPlayed(a) {
  if (!a || a.id == null || playedAlbumIds.has(a.id)) return;
  playedAlbumIds.add(a.id);
  localStorage.setItem(PLAYED_KEY, JSON.stringify([...playedAlbumIds]));
  schedulePushPlayedSync(); // Street Name同期(fav_sync.played)へもデバウンス付きで反映
}

// キューが空の状態で▶を押した時のランダム再生用。年代・スタンプの絞り込み
// (albumsOf()と同じ条件)を尊重し、試聴/動画が1曲も無い盤は対象から外す。
// 地域内シャッフル中(shuffleRegionあり)はその地域の盤に限定する。
function randomPlayableAlbum() {
  const regions = shuffleRegion ? [shuffleRegion] : REGIONS;
  const base = regions.flatMap((r) => albumsOf(r))
    .filter((a) => autoplayEligible(a) && trackItemsOf(a).length > 0);
  // 除外の3段構え:
  //  1. いまキューに載っている盤 + 再生済みセットの盤を除いた「本当に新鮮な盤」
  //  2. それが尽きたら、キューに無い盤(再生済みは許す)
  //  3. それも無ければ全候補(小さな地域内シャッフルで無音になるよりまし)
  const seen = new Set(queue.map((it) => it.album));
  const unseen = base.filter((a) => !seen.has(a));
  const fresh = unseen.filter((a) => !playedAlbumIds.has(a.id));
  const pool = fresh.length ? fresh : (unseen.length ? unseen : base);
  if (!pool.length) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

// この盤が「今の絞り込み条件で」シャッフル継ぎ足し対象になり得るか。
// randomPlayableAlbum()の選盤条件(albumsOfの絞り込み+自動再生除外)と
// 同じ条件を、キューに積んだ後から再判定するために切り出したもの。
function shuffleEligibleNow(a) {
  return eraFilters.has(eraOf(a)) && matchesTagFilter(a)
    && (!activeFilters.size || [...activeFilters].every((f) => hasStamp(a, f)))
    && autoplayEligible(a);
}

// 絞り込み(年代・タグ・スタンプ・自動再生除外)が変わった時に呼ぶ。
// 変更前の条件で選定済みの先読み盤と、キューに連結済みでまだ再生していない
// ランダム盤(shuffleAuto印)のうち新条件に合わないものを取り除く。
// これをしないと「2010年代を外したのに2010年の盤が流れてくる」ように見える
// (選盤時のフィルター自体は正しくても、選定済み分が生き残るため)。
// ユーザーが自分で並べた分(印なし)は消さない。
function pruneShuffleQueue() {
  if (pendingShuffleAlbum && !shuffleEligibleNow(pendingShuffleAlbum)) pendingShuffleAlbum = null;
  let removed = false;
  for (let i = queue.length - 1; i > cursor; i--) {
    if (queue[i].shuffleAuto && !shuffleEligibleNow(queue[i].album)) {
      queue.splice(i, 1);
      removed = true;
    }
  }
  if (removed) {
    // キューから消した分だけYouTubeプレイリスト側とズレるので載せ直させる
    resetYtPlaylist({ keepIntent: true });
    saveQueue();
  }
}

// シャッフル中、キューの残りが少なくなったら次のランダムなアルバムを
// あらかじめ連結してスタンバイさせておく(残り10曲を切ったら補充)。
// 境界の直前に選定・構築を始めると、音が途切れた一瞬にプロセスごと
// 凍結されて次が始まらないことがあるため、まだ十分再生が残っている
// 安全なうちに道を伸ばしておく。YouTube盤は1〜2曲のアルバムが多く
// 境界が頻発するので特に効く(キュー上でYT盤が連続していれば、
// playYtForCursorが最大60本まで1本のプレイリストにまとめて載せる)。
// 連結分にはshuffleAuto印を付け、exitShuffle()で取り除けるようにする。
// 通常再生(非シャッフル)でアルバムを聴き終えた時の「地域内の次のアルバムへ
// 継ぎ足す」動作(next()参照)も、同じ理由でボーダー直前ではなく早めに
// 行う必要がある。両モードをまとめて面倒を見る。
const SHUFFLE_RUNWAY_TRACKS = 10;
function ensureShuffleRunway() {
  if (queue.length - 1 - cursor >= SHUFFLE_RUNWAY_TRACKS) return;
  if (shuffleMode) {
    const upcoming = new Set(queue.slice(Math.max(cursor, 0)).map((it) => it.album));
    let guard = 0;
    let appended = false;
    while (queue.length - 1 - cursor < SHUFFLE_RUNWAY_TRACKS && guard++ < 12) {
      const album = pendingShuffleAlbum || randomPlayableAlbum();
      pendingShuffleAlbum = null;
      if (!album) break;
      if (upcoming.has(album)) continue; // 直近に並んでいる盤の連投は避ける
      const items = trackItemsOf(album);
      if (!items.length) continue;
      items.forEach((it) => { it.shuffleAuto = true; });
      queue.push(...items);
      upcoming.add(album);
      appended = true;
    }
    if (appended) saveQueue();
    return;
  }
  // 非シャッフル: 同じ地域からランダムに1枚だけ先んじて継ぎ足す
  // (next()側の同種ロジックと共通のrandomRegionFollowUpを使う)。
  const lastAlbum = queue[queue.length - 1]?.album;
  const region = lastAlbum && REGIONS.find((r) => r.albums.includes(lastAlbum));
  if (!region) return;
  const album = randomRegionFollowUp(region);
  if (!album) return;
  const items = trackItemsOf(album);
  items.forEach((it) => { it.shuffleAuto = true; });
  queue.push(...items);
  saveQueue();
}

// 地域一覧ヘッダーのシャッフルボタン: その地域の再生可能な盤から1枚選んで
// 再生を始め、聴き終えたら同じ地域内の別のランダムな盤へ連結し続ける。
async function startRegionShuffle(region) {
  const base = albumsOf(region).filter((a) => autoplayEligible(a) && trackItemsOf(a).length > 0);
  // 初回の1枚もキュー上の盤・再生済みの盤を避ける(randomPlayableAlbumと同じ3段構え)
  const seen = new Set(queue.map((it) => it.album));
  const unseen = base.filter((a) => !seen.has(a));
  const fresh = unseen.filter((a) => !playedAlbumIds.has(a.id));
  const pool = fresh.length ? fresh : (unseen.length ? unseen : base);
  if (!pool.length) return;
  // 既存のキューが残ったまま始めると、1枚目が終わった時点で旧キューへ
  // 戻ってしまい「地域シャッフルのはずが別の曲が流れる」挙動になる。
  // 確認を取って破棄し、まっさらな状態から地域シャッフルを始める(ユーザー指定)
  if (queue.length) {
    if (!(await confirmDialog(t('regionShuffleConfirm')))) return;
    queue = []; cursor = -1; pendingShuffleAlbum = null;
    resetYtPlaylist();
  }
  const album = pool[Math.floor(Math.random() * pool.length)];
  playAlbum(album); // 中のexitShuffle()でshuffleRegionは一旦クリアされる
  shuffleMode = true;
  shuffleRegion = region;
  ensureShuffleRunway(); // フラグを立てた後に道を敷き直す(playAlbum時点では無効だったため)
  // YouTube盤起点の場合、playAlbum時点ではshuffleModeがfalseでプレイリスト
  // 連結が働いていないため、フラグを立ててからやり直す(キュー空の▶と同じ理由)
  if (queue[cursor]?.youtube) playYtForCursor();
}

[audioA, audioB].forEach((el) => {
  el.addEventListener('play', () => { if (el === audio) paint(); });
  el.addEventListener('pause', () => {
    if (el !== audio) return; // スワップ時に旧再生役を止める分などは無視
    // 自然終了時は仕様上pause→endedの順で発火する。前者でpaintすると
    // 30秒ごとに通知へ'paused'を公表するフラッピングになり、Android側の
    // 通知再構築(=消える機会)を誘発するので、endedに任せて何もしない。
    if (audio.ended) return;
    // システム起因で直接止められた場合の自動復帰。ユーザー操作の一時停止は
    // 必ずuserPaused=trueが先に立つので、userPausedがfalseのままのpauseは
    // すべてシステム起因(アルバム切替後のオーディオフォーカス再交渉、
    // セッション再構築レース等)と判定できる。開始1秒以内は無条件で復帰し、
    // それ以降も曲ごとに1回だけ復帰を試みる(「切り替え後5秒で止まる」対策。
    // 電話着信など本物のフォーカス喪失は2回目のpauseが来るのでそこで従う)。
    if (!userPaused && queue[cursor]?.preview) {
      const withinStart = Date.now() - lastAudioStartAt < 1000;
      if (withinStart || audioAutoResumeUsedAt !== lastAudioStartAt) {
        if (!withinStart) audioAutoResumeUsedAt = lastAudioStartAt;
        audio.play().catch(() => {});
      }
    }
    // 公表は復帰を試みた後で行う。play()は同期的にpaused=falseにするので、
    // 復帰する分岐では'playing'のまま(以前は先に'paused'を公表してから
    // 復帰していたため、通知/Android Autoが一瞬⏸に変わって戻っていた)。
    // 復帰しない分岐(2回目の本物の喪失)は従来どおり'paused'になる
    paint();
  });
});
document.getElementById('nextBtn').addEventListener('click', next);
document.getElementById('prevBtn').addEventListener('click', prev);
$play.addEventListener('click', () => {
  const q = queue[cursor];
  if (!q) {
    const album = randomPlayableAlbum();
    if (album) {
      playAlbum(album); // 1曲目から(playAlbum内でshuffleMode=falseされるので、その後で立て直す)
      shuffleMode = true; // このアルバムを聴き終えたら続けて別のランダムなアルバムへ
      ensureShuffleRunway(); // フラグを立てた後に道を敷き直す(playAlbum時点では無効だったため)
      // YouTube盤起点の場合、上のplayAlbum時点ではshuffleModeがfalseで
      // プレイリスト連結が働いていないので、フラグを立ててからやり直す
      // (連結しないと最初のアルバム境界の載せ直しが背面で拒否されて止まる)。
      if (queue[cursor]?.youtube) playYtForCursor();
    }
    return;
  }
  if (q?.preview) {
    // 読み込み失敗時はpaused=falseのまま音が出ていない(audio.errorが立つ)。
    // その状態の1タップ目が「止まっている再生をさらにpauseする」逆動作に
    // ならないよう、エラー時も再生側に倒す(src再設定から復帰する)。
    if (audio.paused || audio.error) { userPaused = false; playAudioForCursor(); }
    else { userPaused = true; audio.pause(); }
  } else if (q?.youtube && ytReady) {
    if (ytIsPlaying()) { userPaused = true; ytPlayer.pauseVideo(); }
    // 同上: playVideo()直呼びは壊れたプレイヤーに無反応。見張りつき経由で復帰させる
    else { userPaused = false; playYtForCursor(); }
  }
  // 再生/一時停止はユーザーの再生操作なので端末間同期の「最終再生時刻」を主張する
  // (キューの中身は変わらないためsaveQueue()内の自動更新には掛からない)。
  // 保存はYouTube側のpause反映が非同期なので少し待ってから。
  bumpQueueTs();
  setTimeout(saveQueue, 400);
});
// 再生バーから直接、今流れてる曲にスタンプを押せるように
// (曲一覧まで戻らなくてもその場で押せた方が使い勝手が良い)
document.getElementById('playerStampBtn').addEventListener('click', () => {
  // 開いている状態でもう一度押したら閉じる(トグル)
  if (stampOverlay.classList.contains('open')) { closeStampPicker(); return; }
  const q = queue[cursor];
  if (!q?.album) return;
  const key = q.youtube ? trackKey(q.album, `yt:${q.youtube}`) : trackKey(q.album, q.title);
  // 開いているディスク詳細がまさに今流れてるアルバムなら、押した内容をそこにも反映する
  const rerenderIfOpen = () => { if (currentDisc === q.album) renderDisc(q.album, false); };
  openStampPicker(key, q.title,
    (id) => { toggleStampAt(key, id); rerenderIfOpen(); },
    rerenderIfOpen);
});
document.querySelector('.player-now').addEventListener('click', () => {
  const album = queue[cursor]?.album;
  if (!album) return;
  // 地図に戻った後も連続再生は続くので、そこからプレイヤーバーを押すと
  // 一覧が一段も開いていない(navLevel 0)ことがある。
  // その状態からいきなりディスク詳細を開くと #list に body.detail が
  // 付かないままになり、描画はされてもopacity:0で操作できなくなる。
  // 地域一覧を経由させて階層を正しく積み直す。openRegion()自体は
  // 着弾演出のためdetailクラスの付与を450ms遅らせるが、ここではその場で
  // ディスク詳細まで一気に開くので、演出を待たず即座に付け直す
  // (待ってしまうとその間タップしても反応しないように見えるバグになる)。
  favsDiscChain = false; // 再生バーからの直接ジャンプはお気に入りの続きではない
  if (navLevel === 0) {
    const region = REGIONS.find((r) => r.albums.includes(album));
    if (region) openRegion(region, true);
    document.body.classList.add('detail');
  }
  renderDisc(album);
});
document.getElementById('clearQueue').addEventListener('click', async () => {
  // 隣の「履歴」ボタンと押し間違えてキューが飛ぶと面倒なので確認を挟む
  if (queue.length && !(await confirmDialog(t('clearQueueConfirm')))) return;
  queue = []; cursor = -1; shuffleMode = false; shuffleRegion = null; pendingShuffleAlbum = null;
  audio.pause(); clearTrack(audio);
  clearTimeout(audioStartCheckTimer);
  if (ytReady) ytPlayer.stopVideo();
  resetYtPlaylist();
  paint();
});

// ピンをズームへ忠実に追従させる。
// 'zoom' はアニメーション中も毎フレーム発火するので、そこでスケールを更新する。
const BASE_ZOOM = 3.6;
let lastMarkerScale = '';
function syncMarkerScale() {
  const z = map.getZoom();
  const s = Math.max(0.6, Math.min(2.1, Math.pow(2, (z - BASE_ZOOM) * 0.45)));
  // --sは全マーカー共通なのでルートに1回だけ書き、継承で全.mkへ効かせる。
  // 以前は645個のマーカーへ毎ズームイベントで個別に書き込んでおり、全マーカーの
  // スタイル再計算が毎フレーム走って地図がちらついていた(墓石の大型化で顕在化)。
  // さらに0.01刻みに量子化し、値が変わったフレームだけ書き込む
  const sv = s.toFixed(2);
  if (sv !== lastMarkerScale) {
    lastMarkerScale = sv;
    document.documentElement.style.setProperty('--s', sv);
  }
  document.body.classList.toggle('zoomed-in', z >= 4.6);
}
// rAFでの間引きはしない: 書き込みが1回になった今は十分軽く、逆に非表示タブでは
// rAFが発火せずスケールが固まったままになる(実際に起きた)
map.on('zoom', syncMarkerScale);
syncMarkerScale();

// ---------- キューリスト / 再生履歴 ----------
// プレイヤーの「N曲」タップで開くタブ切り替え画面。使い方ページが無いため、
// 各タブに自動継ぎ足し・再生済み除外の説明文も載せる(ユーザー要望)。
let queueViewTab = 'queue';
function renderQueueView(push = true, tab = queueViewTab) {
  queueViewTab = tab;
  listView = 'queueview';
  currentDisc = null;
  if (push) navGoto(1);
  document.body.classList.remove('stamps-open');
  document.body.classList.add('detail');
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  let body = '';
  if (tab === 'queue') {
    // 再生済み(cursorより前)は表示しない。プレイヤーの「N曲」と数を一致させる
    const from = Math.max(cursor, 0);
    const rows = queue.slice(from).map((it, i) => `<li class="hist-row${from + i === cursor ? ' now' : ''}" data-qi="${from + i}">
      <span class="hist-time">${from + i === cursor ? '▶' : i + 1}</span>
      <span class="hist-main"><b>${esc(it.title)}${it.shuffleAuto ? `<span class="qv-auto">${t('qAutoTag')}</span>` : ''}</b><span class="hist-sub">${esc(it.artist)}${it.album?.title && it.album.title !== it.title ? ` ─ ${esc(it.album.title)}` : ''}</span></span>
    </li>`).join('');
    // タイトル未解決のYouTube曲(アルバム名の仮置き表示)は、開いたついでに
    // oEmbedで曲名を引いてその場で差し替える(キャッシュされ次回以降は即表示)
    setTimeout(() => {
      if (listView !== 'queueview') return;
      queue.slice(from, from + 20).forEach((it, i) => {
        if (!it.youtube || it.title !== it.album?.title) return;
        fetchYtTitle(it.youtube).then((title) => {
          if (!title || listView !== 'queueview') return;
          it.title = title;
          const b = listEl.querySelector(`.hist-row[data-qi="${from + i}"] .hist-main b`);
          if (b) b.firstChild.textContent = title;
        });
      });
    }, 0);
    body = rows
      ? `<ul class="hist-list">${rows}</ul>`
      : `<p class="form-note hist-empty">${t('qEmptyT')} ─ ${t('qEmptyA')}</p>`;
  } else {
    let hist = [];
    try { hist = JSON.parse(localStorage.getItem('gra.history.v1') || '[]'); } catch { hist = []; }
    const rows = hist.slice().reverse().map((h) => {
      const d = new Date(h.ts || 0);
      const when = h.ts ? `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}` : '';
      return `<li class="hist-row">
        <span class="hist-time">${when}</span>
        <span class="hist-main"><b>${esc(h.t)}</b><span class="hist-sub">${esc(h.a)}${h.al && h.al !== h.t ? ` ─ ${esc(h.al)}` : ''}</span></span>
      </li>`;
    }).join('');
    body = (rows
      ? `<ul class="hist-list">${rows}</ul>`
      : `<p class="form-note hist-empty">${t('histEmpty')}</p>`)
      + `<button type="button" class="tr-toggle hist-clear">${t('histClear')}</button>`;
  }

  listEl.innerHTML = `
    ${listHead(tab === 'queue' ? t('qTabQueue') : t('histTitle'), '', '')}
    <div class="qv-tabs">
      <button type="button" class="qv-tab${tab === 'queue' ? ' on' : ''}" data-tab="queue">${t('qTabQueue')}</button>
      <button type="button" class="qv-tab${tab === 'history' ? ' on' : ''}" data-tab="history">${t('qTabHist')}</button>
    </div>
    <ul class="qv-note">${(tab === 'queue' ? t('qNoteItems') : t('histNoteItems')).map((n) => `<li>${n}</li>`).join('')}</ul>
    ${body}`;
  listEl.querySelector('.close').addEventListener('click', closeList);
  listEl.querySelectorAll('.qv-tab').forEach((b) => b.addEventListener('click', () => renderQueueView(false, b.dataset.tab)));
  listEl.querySelector('.hist-clear')?.addEventListener('click', async () => {
    if (!(await confirmDialog(t('histClearConfirm')))) return;
    localStorage.removeItem('gra.history.v1');
    playedAlbumIds = new Set();
    localStorage.removeItem(PLAYED_KEY);
    // クリアは他端末にも伝播させる(cleared_atが新しい方が勝つルール)
    playedClearedAt = Date.now();
    localStorage.setItem(PLAYED_CLEARED_KEY, String(playedClearedAt));
    pushPlayedSync();
    renderQueueView(false, 'history');
  });
}
document.getElementById('queueCount').addEventListener('click', () => renderQueueView(true, 'queue'));

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
      <div class="fTags">
        ${TAGS.map((tg) => `<label class="fTag"><input type="checkbox" name="tags" value="${tg.id}"><span>${tagName(tg)}</span></label>`).join('')}
      </div>
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
    const tags = f.getAll('tags');
    if (!body.url) { msg.textContent = t('needFields'); return; }
    msg.textContent = t('sending');
    form.querySelector('.send').disabled = true;
    try {
      let res = await fetch(`${SB_URL}/submissions`, {
        method: 'POST',
        headers: { ...SB_HEADERS, Prefer: 'return=minimal' },
        body: JSON.stringify({ ...body, tags }),
      });
      if (!res.ok) {
        // tags列のマイグレーション未実施のDBへのフォールバック
        res = await fetch(`${SB_URL}/submissions`, {
          method: 'POST',
          headers: { ...SB_HEADERS, Prefer: 'return=minimal' },
          body: JSON.stringify(body),
        });
      }
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
  document.getElementById('filterHintText').innerHTML = t('filterHint');
  buildFilterBar();
  buildTagBar();
  buildAutoplayBar();
  paint();
  // 開いている画面を同じ状態のまま描き直す
  if (document.body.classList.contains('detail')) {
    if (currentDisc) renderDisc(currentDisc, false);
    else if (listView === 'favs') renderFavs(false);
    else if (listView === 'submit') renderSubmit(false);
    else if (listView === 'queueview') renderQueueView(false);
    else if (activeRegion) renderList(activeRegion);
  }
}
document.getElementById('langBtn').addEventListener('click', () => {
  lang = lang === 'ja' ? 'en' : 'ja';
  localStorage.setItem('gra.lang', lang);
  applyLang();
});
restoreQueue();
paint(); // restoreQueue()は保存済みキューが無いと何もしないため、真っ新な初回起動時にも▶アイコンをSVGへ差し替える
applyLang();
loadSharedStamps();
loadTagScores();
autoPullFavSync();
loadPublishedReleases();

refreshMarkers();
map.on('load', () => { map.resize(); refreshMarkers(); });

// 共有リンク(#r/<地域ID>または#r/<地域ID>/<artist|title>)を開いたときの復元。
// ページの初回読み込み時だけでなく、ページを閉じずに(=スクリプトを再実行せずに)
// 別の共有リンクを開いた場合にも呼ばれる必要があるため、hashchange/popstateの
// リスナーからも呼べるよう独立した関数にしてある(Android版アプリがバックグラウンド
// 起動中に共有リンクを開くと、URLのハッシュ部分だけが変わる「同一ドキュメント内
// 遷移」としてOS/ブラウザに扱われ、ページの初回読み込み処理は再実行されない。
// この場合ブラウザはhashchangeイベントだけを発火させ、下のnavGoto()自体は
// pushState/replaceStateしか呼ばないためhashchange/popstateは発火しない、
// という前提で組んである)。
function openFromHash(rawHash) {
  const h = (rawHash != null ? rawHash : location.hash).slice(1);
  if (!h.startsWith('r/')) return;
  const [regionId, discId] = h.slice(2).split('/');
  const region = REGIONS.find((r) => r.id === decodeURIComponent(regionId));
  if (!region) return;
  // 同じ内容へ既に遷移済みなら何もしない。hashchangeとpopstateの両方が発火する
  // 環境(Android版アプリのWebViewなど)だと、この関数が同じ1回のリンク操作で
  // 二重に呼ばれ、そのたびにopenRegion()/renderDisc()がhistoryへpushしてしまい、
  // 「閉じる」を何度も押さないと地図まで戻れなくなる不具合になっていた。
  const discIdNum = discId != null ? Number(discId) : null;
  if (activeRegion?.id === region.id
    && (discIdNum == null ? navLevel !== 2 : currentDisc?.id === discIdNum)) return;
  openRegion(region);
  if (discId != null) {
    const album = resolveDiscShareId(region, discId);
    if (album) {
      setTimeout(() => {
        // openRegion()はbody.detailの付与を着弾演出のため450ms遅延させるが、
        // ページ読み込み直後は他の初期化処理が重なってこのタイマーの発火が
        // ずれやすく、renderDisc()側のタイマー(460ms)がそれより先に走ると
        // #listがopacity:0のまま操作できないバグになっていた
        // (共有リンクを開いた直後だけ再現しやすかった理由)。
        // ここで明示的に付け直すことで、どちらが先に発火しても確実にする。
        document.body.classList.add('detail');
        renderDisc(album);
      }, 460);
    }
  }
}
openFromHash(initialShareHash);
// Android版アプリ(TWA)がバックグラウンド起動中に共有リンクを開いた場合など、
// hashchangeとして届くケースをここで拾う。
// ただし「戻る/進む」の履歴移動でもhashchangeは発火する。自アプリが積んだ
// エントリ(state.levelあり)への移動なら描画はpopstateハンドラの担当なので
// ここでは何もしない。以前はこの区別が無く、ディスクから戻るたびに
// openFromHash()が「共有リンクを開いた」と誤解して前の地域を開き直し、
// その遅延タイマーがdetail表示を付け直すため、地図まで戻っても画面が
// 閉じず、もう一度戻るとアプリごと終了する実バグになっていた。
window.addEventListener('hashchange', () => {
  if (history.state && typeof history.state.level === 'number') return;
  openFromHash();
});

// PWAとしてインストール可能にするための最小Service Worker登録
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

// ---------- 別コンテキスト(TWAアプリ⇄ブラウザ)とのキュー同期 ----------
// アプリとブラウザは同じlocalStorageを共有するが、TWAは再開時にページを
// 再読み込みしないため、起動時に読んだ状態を表示し続ける(ブラウザ側の変更が
// 「アプリに伝わらない」ように見える原因)。他コンテキストが保存キューを
// 書き換えたことを、storageイベント(生きている間のライブ通知)と
// 前面復帰(visibilitychange/pageshow)の両方で拾って取り込む。
// 自分が再生中の時は自分を正として取り込まない(音が突然別の曲へ飛ぶのを
// 防ぐ。こちらの次のsaveQueue()が最新として他コンテキストへ伝わる)。
// 「自分が再生中(または再生継続の意図がある)か」。YouTubeは30秒送りの読み込み中
// (BUFFERING等)にytIsPlaying()が偽になるため、意図フラグも見る。以前はここを
// 停止中と誤判定して他端末のキューを取り込み、再生を止めてしまう経路があった。
// 意図フラグ単独では「再生を試みたが始まらないまま固まった」状態(自動再生
// 拒否後のリロード等)まで再生中扱いになり同期が永久に止まるので、
// 「読み込み中(BUFFERING)」か「直近15秒以内に実際に鳴っていた」証拠で縛る
const YT_ACTIVE_GRACE_MS = 15000;
function playbackActive() {
  const q = queue[cursor];
  if (!q) return false;
  if (!q.youtube) return !audio.paused;
  if (ytIsPlaying()) return true;
  if (!ytPlaybackIntended || userPaused) return false;
  // YT.PlayerStateはIFrame API到着後にしか存在しない(オフライン/遮断環境では永久に
  // 来ない)ので、ytReadyが真の時だけ比較する
  const buffering = ytReady && ytPlayer.getPlayerState
    && ytPlayer.getPlayerState() === YT.PlayerState.BUFFERING;
  return !!buffering || Date.now() - ytLastPlayingAt < YT_ACTIVE_GRACE_MS;
}
function adoptExternalQueue() {
  if (queueRestoreDeferred) return;
  const raw = localStorage.getItem(QUEUE_KEY);
  if (raw == null || raw === lastQueueSnapshot) return; // 自分の書いた内容なら何もしない
  if (playbackActive()) return;
  audio.pause();
  restoreQueue(true, false); // 取り込み時は自動再生しない(両方で鳴るのを防ぐ)
}
window.addEventListener('storage', (e) => {
  if (e.key === QUEUE_KEY) adoptExternalQueue();
});
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') adoptExternalQueue();
});
window.addEventListener('pageshow', () => adoptExternalQueue());

// ---------- 別端末(PC⇄スマホ)との再生キュー同期 ----------
// Street Nameを持つユーザーのキューをfav_sync.queue(jsonb)に載せて端末間で
// 引き継ぐ。同一端末のアプリ⇄ブラウザ同期(adoptExternalQueue)と同じ思想で、
// 「再生中の側が常に正」。取り込みはlocalStorageへ書いてから
// adoptExternalQueue()に任せる(自動再生しない・自分と同内容なら無視、の
// 安全弁を共有するため)。列が無い(マイグレーション未実施)環境では
// 最初の400応答で静かに無効化する。
// 注意: Postgresのjsonbはキー順を保存しない(長さ→辞書順に並び替える)ため、
// サーバーから返るJSONの文字列は自分の保存形式と一致しない。比較や保存の前に
// saveQueue()と同じキー順へ正規化する。
// varで宣言する: 関数宣言(schedulePushQueueSync等)は巻き上げで先に呼べるため、
// 起動中のpaint()→saveQueue()経由でこの行の実行前に参照されることがある。
// letだとTDZでスクリプト全体が落ちる(実際に起きた)。varならundefined=無効
// として安全に素通りし、この行の実行後に有効化される。
var queueSyncEnabled = true;
var queueSyncPushTimer = null;
var lastQueuePushedSnapshot = null;
function normalizeQueuePayload(remote) {
  if (!remote || !Array.isArray(remote.items)) return null;
  const items = remote.items.map((it) => (it && it.albumId != null
    ? { albumId: it.albumId, idx: it.idx ?? 0, ...(it.auto ? { auto: 1 } : {}) }
    : null));
  return JSON.stringify({ cursor: remote.cursor ?? 0, items, playing: !!remote.playing });
}
function schedulePushQueueSync() {
  if (!queueSyncEnabled || !streetName) return;
  clearTimeout(queueSyncPushTimer);
  queueSyncPushTimer = setTimeout(pushQueueSync, 2000);
}
async function pushQueueSync() {
  if (!queueSyncEnabled || !streetName || lastQueueSnapshot == null) return;
  if (lastQueueSnapshot === lastQueuePushedSnapshot) return;
  const snapshot = lastQueueSnapshot;
  try {
    const res = await fetch(`${SB_URL}/fav_sync?gangsta_name=eq.${encodeURIComponent(streetName)}`, {
      method: 'PATCH',
      headers: { ...SB_HEADERS, Prefer: 'return=minimal' },
      body: JSON.stringify({
        queue: JSON.parse(snapshot),
        queue_updated_at: new Date(lastQueueLocalTs || Date.now()).toISOString(),
      }),
    });
    if (res.status === 400) { queueSyncEnabled = false; return; }
    if (res.ok) lastQueuePushedSnapshot = snapshot;
  } catch { /* オフライン時は次の変更時に再試行 */ }
}
async function pullQueueSync() {
  if (!queueSyncEnabled || !streetName) return;
  try {
    // 再生済みセット(played)も同じリクエストに相乗りさせて取得する
    let res = await fetch(
      `${SB_URL}/fav_sync?gangsta_name=eq.${encodeURIComponent(streetName)}&select=queue,queue_updated_at${playedSyncEnabled ? ',played' : ''}`,
      { headers: SB_HEADERS });
    if (res.status === 400 && playedSyncEnabled) {
      // played列のマイグレーション未実施のDB: キュー同期だけは生かす
      playedSyncEnabled = false;
      res = await fetch(
        `${SB_URL}/fav_sync?gangsta_name=eq.${encodeURIComponent(streetName)}&select=queue,queue_updated_at`,
        { headers: SB_HEADERS });
    }
    if (res.status === 400) { queueSyncEnabled = false; return; }
    if (!res.ok) return;
    const rows = await res.json();
    mergePlayedFromRow(rows[0]);
    const normalized = normalizeQueuePayload(rows[0]?.queue);
    if (!normalized) return;
    if (normalized === lastQueueSnapshot) { lastQueuePushedSnapshot = normalized; return; }
    // 「最近再生していた側が勝つ」: サーバー側の最終再生時刻が自分の最終操作
    // より古ければ取り込まず、逆に自分の状態を押し返す(ユーザー指定ルール)
    const remoteTs = Date.parse(rows[0]?.queue_updated_at || '') || 0;
    if (remoteTs <= lastQueueLocalTs) { schedulePushQueueSync(); return; }
    // 上書きで消える直前のキューを1世代だけ退避しておく(誤同期時の救出用)。
    const prev = localStorage.getItem(QUEUE_KEY);
    if (prev && prev !== normalized) localStorage.setItem('gra.queue.prev.v1', prev);
    localStorage.setItem(QUEUE_KEY, normalized);
    localStorage.setItem(QUEUE_TS_KEY, String(remoteTs));
    lastQueueLocalTs = remoteTs;
    lastQueuePushedSnapshot = normalized; // 取り込んだ内容をそのまま押し返さない
    adoptExternalQueue();
  } catch { /* オフライン時は何もしない */ }
}
// ---------- カスタム確認ダイアログ ----------
// ネイティブのconfirm()の置き換え。誌面デザイン(紙色+インク枠)に合わせる。
// 戻り値はPromise<boolean>(OK=true / ヤメル・外側タップ・Esc=false)。
let confirmDlgResolve = null;
function confirmDialog(msg) {
  return new Promise((resolve) => {
    let ov = document.getElementById('confirmOverlay');
    if (!ov) {
      ov = document.createElement('div');
      ov.id = 'confirmOverlay';
      ov.className = 'confirm-overlay';
      ov.innerHTML = `<div class="confirm-box" role="alertdialog" aria-modal="true">
        <p class="confirm-msg"></p>
        <div class="confirm-actions">
          <button type="button" class="tr-toggle confirm-no"></button>
          <button type="button" class="tr-toggle confirm-yes"></button>
        </div></div>`;
      document.body.appendChild(ov);
      ov.querySelector('.confirm-yes').addEventListener('click', () => closeConfirmDialog(true));
      ov.querySelector('.confirm-no').addEventListener('click', () => closeConfirmDialog(false));
      ov.addEventListener('click', (e) => { if (e.target === ov) closeConfirmDialog(false); });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && ov.classList.contains('open')) closeConfirmDialog(false);
      });
    }
    ov.querySelector('.confirm-msg').textContent = msg;
    ov.querySelector('.confirm-yes').textContent = t('dlgOk');
    ov.querySelector('.confirm-no').textContent = t('dlgCancel');
    confirmDlgResolve = resolve;
    ov.classList.add('open');
  });
}
function closeConfirmDialog(answer) {
  document.getElementById('confirmOverlay')?.classList.remove('open');
  const r = confirmDlgResolve;
  confirmDlgResolve = null;
  if (r) r(answer);
}

// ---------- 再生済みセットの端末間同期(fav_sync.played) ----------
// { ids: [albumId...], cleared_at: ミリ秒 } を保存する。
// 通常は「増えるだけの集合」なので和集合マージで両方向の追加が合流し、
// クリアだけは cleared_at の新しい方が勝つ(クリア前の古いデータが
// 後から届いてもクリアを巻き戻さない)。プルはpullQueueSyncに相乗り。
var playedSyncEnabled = true; // varで宣言(TDZ対策、queueSyncEnabledと同じ理由)
var playedSyncPushTimer = null;
function schedulePushPlayedSync() {
  if (!playedSyncEnabled || !streetName) return;
  clearTimeout(playedSyncPushTimer);
  playedSyncPushTimer = setTimeout(pushPlayedSync, 5000);
}
async function pushPlayedSync() {
  if (!playedSyncEnabled || !streetName) return;
  try {
    const res = await fetch(`${SB_URL}/fav_sync?gangsta_name=eq.${encodeURIComponent(streetName)}`, {
      method: 'PATCH',
      headers: { ...SB_HEADERS, Prefer: 'return=minimal' },
      body: JSON.stringify({ played: { ids: [...playedAlbumIds], cleared_at: playedClearedAt } }),
    });
    if (res.status === 400) playedSyncEnabled = false; // 列のマイグレーション未実施
  } catch { /* オフライン時は次の再生時に再試行 */ }
}
function mergePlayedFromRow(row) {
  if (!playedSyncEnabled || !row || !('played' in row)) return;
  const remote = row.played;
  if (!remote || !Array.isArray(remote.ids)) {
    // サーバーがまだ空: こちらに中身があれば初回プッシュ
    if (playedAlbumIds.size || playedClearedAt) schedulePushPlayedSync();
    return;
  }
  const remoteCleared = Number(remote.cleared_at) || 0;
  const before = playedAlbumIds.size;
  if (remoteCleared > playedClearedAt) {
    // 他端末でのクリアが自分の状態より新しい: そちらを正として置き換える
    playedClearedAt = remoteCleared;
    localStorage.setItem(PLAYED_CLEARED_KEY, String(playedClearedAt));
    playedAlbumIds = new Set(remote.ids);
  } else if (remoteCleared === playedClearedAt) {
    remote.ids.forEach((id) => playedAlbumIds.add(id)); // 和集合マージ
  } else {
    // サーバー側は自分のクリアより古いデータ: 取り込まず、クリア済みの状態を押し返す
    schedulePushPlayedSync();
    return;
  }
  if (playedAlbumIds.size !== before || remoteCleared > 0) {
    localStorage.setItem(PLAYED_KEY, JSON.stringify([...playedAlbumIds]));
  }
  // こちらにしか無い追加分があればサーバーへ返す
  if (playedAlbumIds.size !== remote.ids.length) schedulePushPlayedSync();
}
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') pullQueueSync();
});
// 開きっぱなしの端末はvisibilitychangeが発火しないため、自分が再生していない
// 間は定期的にサーバーを見に行く(別端末で再生中の曲を追従させる)。
// 自分が再生中のときは取り込まない — 自分が最新のはずで、曲間の一瞬に
// 相手のキューへ飛ばされるフラつきを防ぐ。
setInterval(() => {
  if (document.visibilityState !== 'visible') return;
  if (!playbackActive()) pullQueueSync();
}, 20000);
