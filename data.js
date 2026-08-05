// プロトタイプ用サンプルデータ
// 本番では Spotify API / Discogs API / MusicBrainz から取得してDBに格納する。
// youtubeId は YouTube Data API の検索結果から埋める想定のため、ここでは null。
// stampSeed は「ネット上のレビューをLLMでムード分析した初期値」を模した仮の数値。

const STAMPS = [
  { id: 'doro',    label: 'ドロドロ',   en: 'murky',    color: '#7b5cff' },
  { id: 'horror',  label: 'ホラー',     en: 'horror',   color: '#c2372f' },
  { id: 'mellow',  label: 'メロウ',     en: 'mellow',   color: '#4aa3a0' },
  { id: 'smooth',  label: 'スムース',   en: 'smooth',   color: '#3f7fd6' },
  { id: 'aishu',   label: '哀愁',       en: 'melancholy', color: '#8a6fa8' },
  { id: 'bangin',  label: 'バンギン',   en: "bangin'",  color: '#d9822b' },
  { id: 'funky',   label: 'ファンキー', en: 'funky',    color: '#c9a227' },
  { id: 'laidbk',  label: 'レイドバック', en: 'laid-back', color: '#5f9e5f' },
  { id: 'dark',    label: 'ダーク',     en: 'dark',     color: '#5a5f70' },
  { id: 'party',   label: 'パーティー', en: 'party',    color: '#d4568c' },
];

// 地域(出身地)が特定できなかった収集物の置き場。
// 西海岸から少し離した太平洋上に浮かべ、「まだ漂着していない情報」として見せる。
// scripts/collect_grap.py が地域を解決できなかった候補はここに集約する想定。
const UNCLASSIFIED_REGION = {
  id: 'unclassified', name: '未確認情報', area: 'UNCHARTED — 出身地未特定',
  lng: -129, lat: 36,
  unclassified: true,
  albums: [],
};

const REGIONS = [
  UNCLASSIFIED_REGION,
  {
    id: 'compton', name: 'Compton', area: 'Los Angeles County, CA',
    lng: -118.2201, lat: 33.8958,
    albums: [
      { artist: 'N.W.A', title: 'Straight Outta Compton', year: 1988, label: 'Ruthless', youtubeId: null,
        stampSeed: { bangin: 96, dark: 61, doro: 34, funky: 52 } },
      { artist: 'DJ Quik', title: 'Quik Is the Name', year: 1991, label: 'Profile', youtubeId: null,
        stampSeed: { funky: 88, smooth: 71, party: 55, laidbk: 44 } },
      { artist: "Compton's Most Wanted", title: 'Music to Driveby', year: 1992, label: 'Orpheus', youtubeId: null,
        stampSeed: { doro: 74, aishu: 58, dark: 49, mellow: 31 } },
      { artist: 'MC Eiht', title: 'We Come Strapped', year: 1994, label: 'Epic Street', youtubeId: null,
        stampSeed: { doro: 41, dark: 33, bangin: 27 } },
    ],
  },
  {
    id: 'longbeach', name: 'Long Beach', area: 'Los Angeles County, CA',
    lng: -118.1937, lat: 33.7701,
    albums: [
      { artist: 'Snoop Doggy Dogg', title: 'Doggystyle', year: 1993, label: 'Death Row', youtubeId: null,
        stampSeed: { smooth: 99, funky: 84, laidbk: 77, party: 63 } },
      { artist: 'Warren G', title: 'Regulate...G Funk Era', year: 1994, label: 'Violator/RAL', youtubeId: null,
        stampSeed: { mellow: 91, smooth: 80, laidbk: 68, aishu: 40 } },
      { artist: 'Domino', title: 'Domino', year: 1993, label: 'Outburst', youtubeId: null,
        stampSeed: { smooth: 22, party: 18, funky: 15 } },
    ],
  },
  {
    id: 'southcentral', name: 'South Central LA', area: 'Los Angeles, CA',
    lng: -118.2917, lat: 33.9897,
    albums: [
      { artist: 'Ice-T', title: 'Rhyme Pays', year: 1987, label: 'Sire', youtubeId: null,
        stampSeed: { bangin: 44, funky: 30, dark: 22 } },
      { artist: 'South Central Cartel', title: "'N Gatz We Truss", year: 1994, label: 'G.W.K./RAL', youtubeId: null,
        stampSeed: { doro: 29, aishu: 24, dark: 19 } },
    ],
  },
  {
    id: 'vallejo', name: 'Vallejo', area: 'Bay Area, CA',
    lng: -122.2566, lat: 38.1041,
    albums: [
      { artist: 'E-40', title: 'In a Major Way', year: 1995, label: 'Sick Wid It/Jive', youtubeId: null,
        stampSeed: { funky: 57, bangin: 43, party: 35 } },
      { artist: 'Mac Dre', title: 'Young Black Brotha', year: 1989, label: 'Strictly Business', youtubeId: null,
        stampSeed: { funky: 21, party: 17, laidbk: 12 } },
    ],
  },
  {
    id: 'oakland', name: 'Oakland', area: 'Bay Area, CA',
    lng: -122.2712, lat: 37.8044,
    albums: [
      { artist: 'Too $hort', title: 'Life Is...Too $hort', year: 1988, label: 'Dangerous Music/Jive', youtubeId: null,
        stampSeed: { funky: 48, laidbk: 39, party: 30 } },
      { artist: 'Spice 1', title: 'Spice 1', year: 1992, label: 'Jive', youtubeId: null,
        stampSeed: { doro: 33, dark: 26, bangin: 24 } },
    ],
  },
  {
    id: 'houston', name: 'Houston', area: 'Texas',
    lng: -95.3698, lat: 29.7604,
    albums: [
      { artist: 'Geto Boys', title: "We Can't Be Stopped", year: 1991, label: 'Rap-A-Lot', youtubeId: null,
        stampSeed: { horror: 72, dark: 66, doro: 51, aishu: 33 } },
      { artist: 'DJ Screw', title: '3 \'N the Mornin\' (Part Two)', year: 1996, label: 'Bigtyme', youtubeId: null,
        stampSeed: { doro: 38, mellow: 29, laidbk: 26 } },
    ],
  },
  {
    id: 'portarthur', name: 'Port Arthur', area: 'Texas',
    lng: -93.9399, lat: 29.8850,
    albums: [
      { artist: 'UGK', title: 'Too Hard to Swallow', year: 1992, label: 'Jive', youtubeId: null,
        stampSeed: { doro: 26, funky: 19, aishu: 14 } },
    ],
  },
  {
    id: 'memphis', name: 'Memphis', area: 'Tennessee',
    lng: -90.0490, lat: 35.1495,
    albums: [
      { artist: 'Three 6 Mafia', title: 'Mystic Stylez', year: 1995, label: 'Prophet', youtubeId: null,
        stampSeed: { horror: 94, dark: 78, doro: 62 } },
      { artist: 'Tommy Wright III', title: 'On the Run', year: 1996, label: 'Street Smart', youtubeId: null,
        stampSeed: { horror: 11, doro: 9, dark: 7 } },
    ],
  },
  {
    id: 'neworleans', name: 'New Orleans', area: 'Louisiana',
    lng: -90.0715, lat: 29.9511,
    albums: [
      { artist: 'UNLV', title: 'Uptown 4 Life', year: 1996, label: 'Cash Money', youtubeId: null,
        stampSeed: { bangin: 13, party: 10, doro: 8 } },
      { artist: 'Master P', title: 'Ice Cream Man', year: 1996, label: 'No Limit', youtubeId: null,
        stampSeed: { bangin: 31, doro: 22, dark: 18 } },
    ],
  },
  {
    id: 'sf', name: 'San Francisco', area: 'Hunters Point / Fillmore, CA',
    lng: -122.4194, lat: 37.7749,
    albums: [
      { artist: 'RBL Posse', title: 'A Lesson to Be Learned', year: 1992, label: 'In-A-Minute', youtubeId: null,
        stampSeed: { doro: 16, bangin: 13, funky: 11 } },
      { artist: 'Dre Dog', title: 'The New Jim Jones', year: 1993, label: 'In-A-Minute', youtubeId: null,
        stampSeed: { horror: 14, doro: 12, dark: 9 } },
    ],
  },
  {
    id: 'sacramento', name: 'Sacramento', area: 'California',
    lng: -121.4944, lat: 38.5816,
    albums: [
      { artist: 'Brotha Lynch Hung', title: 'Season of da Siccness', year: 1995, label: 'Black Market', youtubeId: null,
        stampSeed: { horror: 47, doro: 39, dark: 34 } },
      { artist: 'X-Raided', title: 'Psycho Active', year: 1992, label: 'Black Market', youtubeId: null,
        stampSeed: { horror: 12, dark: 10, doro: 8 } },
    ],
  },
  {
    id: 'yokohama', name: 'Yokohama', area: 'Japan — 世界のG-RAP',
    lng: 139.6380, lat: 35.4437,
    albums: [
      { artist: 'DS455', title: 'DabStar Clique', year: 2002, label: 'Universal J', youtubeId: null,
        stampSeed: { laidbk: 19, mellow: 15, smooth: 13 } },
      { artist: 'OZROSAURUS', title: 'Rollin\'045', year: 2001, label: 'Street Flava/Polystar', youtubeId: null,
        stampSeed: { bangin: 17, aishu: 12, funky: 9 } },
    ],
  },
  {
    id: 'queens', name: 'Queensbridge', area: 'New York, NY',
    lng: -73.9430, lat: 40.7550,
    albums: [
      { artist: 'Mobb Deep', title: 'The Infamous', year: 1995, label: 'Loud', youtubeId: null,
        stampSeed: { dark: 88, doro: 69, aishu: 57, horror: 30 } },
      { artist: 'Kool G Rap & DJ Polo', title: 'Live and Let Die', year: 1992, label: 'Cold Chillin\'', youtubeId: null,
        stampSeed: { dark: 28, bangin: 23, doro: 17 } },
    ],
  },
];
