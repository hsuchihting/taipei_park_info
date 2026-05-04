const files = {
  taipei: "./臺北市公園基本資料.json",
  newTaipei: "./新北市公園_export.json",
  disaster: "./防災公園資訊.json"
};

const state = {
  parks: [],
  filtered: [],
  selectedId: null,
  city: "all",
  scenario: "all",
  district: "",
  sort: "relevance",
  search: ""
};

const cityFilters = [
  ["all", "全部"],
  ["臺北市", "臺北"],
  ["新北市", "新北"]
];

const scenarioFilters = [
  ["all", "全部"],
  ["family", "親子"],
  ["sport", "運動"],
  ["service", "設施"],
  ["disaster", "防災"]
];

const $ = (id) => document.getElementById(id);
const formatNumber = (value) => Number(value || 0).toLocaleString("zh-TW");
const clean = (value) => String(value ?? "").replace(/^\uFEFF/, "").trim();
const toNumber = (value) => {
  const n = Number(String(value ?? "").replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
};

function uniqueList(value) {
  return [...new Set(clean(value).split(/[、,，.。；;\r\n]+/).map((item) => item.trim()).filter(Boolean))];
}

function nameKey(name) {
  return clean(name).replace(/[\s　]/g, "").replace(/[()（）].*?[)）]/g, "");
}

function inferType(name, fallback = "") {
  const text = clean(`${name} ${fallback}`);
  if (text.includes("綠地")) return "綠地";
  if (text.includes("廣場")) return "廣場";
  return "公園";
}

function normalizeTaipei(row, disasterMap) {
  const disaster = disasterMap.get(nameKey(row.pm_name));
  const sports = uniqueList(row.pm_sports);
  const recreation = uniqueList(row.pm_recreation);
  const services = uniqueList(row.pm_service);
  const playground = uniqueList(row.pm_playeq).slice(0, 24);
  const district = clean(row.pm_libie).replace(/里$/, "里");

  return {
    id: `tp-${row.SeqNo}`,
    sourceId: row.SeqNo,
    city: "臺北市",
    name: clean(row.pm_name),
    englishName: clean(row.pm_name_eng),
    district,
    type: clean(row.pm_type) || inferType(row.pm_name),
    address: clean(row.pm_location),
    management: clean(row.pm_unit),
    phone: clean(row.pm_phone),
    description: clean(row.pm_overview),
    longitude: toNumber(row.pm_Longitude),
    latitude: toNumber(row.pm_Latitude),
    areaM2: toNumber(row.pm_LandPublicArea),
    openingHours: `${clean(row.pm_opening_s)}-${clean(row.pm_opening_e)}`,
    sports,
    recreation,
    services,
    transit: clean(row.pm_transit),
    playgroundType: clean(row.pm_playtype),
    playgroundArea: toNumber(row.pm_playarea),
    playground,
    disaster: disaster ? normalizeDisaster(disaster) : null,
    completeness: disaster ? "完整 + 防災" : "完整"
  };
}

function normalizeNewTaipei(row) {
  return {
    id: `nt-${row.seqno}`,
    sourceId: row.seqno,
    city: "新北市",
    name: clean(row.name),
    englishName: "",
    district: clean(row.area),
    type: inferType(row.name),
    address: clean(row.address),
    management: clean(row.management),
    phone: clean(row.localcallservice),
    description: "",
    longitude: 0,
    latitude: 0,
    areaM2: 0,
    openingHours: "",
    sports: [],
    recreation: clean(row.name).includes("兒") || clean(row.name).includes("遊") ? ["兒童遊憩推估"] : [],
    services: [],
    transit: "",
    playgroundType: "",
    playgroundArea: 0,
    playground: [],
    disaster: null,
    completeness: "名錄"
  };
}

function normalizeDisaster(row) {
  const amounts = Array.from({ length: 18 }, (_, index) => toNumber(row[`di_Amount${index + 1}`]));
  return {
    areaM2: toNumber(row.di_area),
    capacity: toNumber(row.di_capacity),
    amounts,
    hospital: clean(row.di_hospital),
    fire: clean(row.di_fire),
    police: clean(row.di_police),
    longitude: toNumber(row.pm_Longitude),
    latitude: toNumber(row.pm_Latitude),
    complete: Boolean(clean(row.di_capacity) || clean(row.di_area))
  };
}

async function loadJson(url) {
  const text = await fetch(url).then((response) => response.text());
  return JSON.parse(text.replace(/^\uFEFF/, ""));
}

async function init() {
  const [taipeiRows, newTaipeiRows, disasterRows] = await Promise.all([
    loadJson(files.taipei),
    loadJson(files.newTaipei),
    loadJson(files.disaster)
  ]);

  const disasterMap = new Map(disasterRows.map((row) => [nameKey(row.pm_name), row]));
  state.parks = [
    ...taipeiRows.map((row) => normalizeTaipei(row, disasterMap)),
    ...newTaipeiRows.map(normalizeNewTaipei)
  ];

  state.selectedId = state.parks.find((park) => park.disaster)?.id || state.parks[0]?.id;
  buildFilters();
  bindEvents();
  render();
}

function buildFilters() {
  $("city-filters").innerHTML = cityFilters.map(([value, label]) => filterButton("city", value, label, value === state.city)).join("");
  $("scenario-filters").innerHTML = scenarioFilters.map(([value, label]) => filterButton("scenario", value, label, value === state.scenario)).join("");

  const districts = [...new Set(state.parks.map((park) => park.district).filter(Boolean))].sort((a, b) => a.localeCompare(b, "zh-Hant"));
  $("district").innerHTML = `<option value="">全部</option>${districts.map((district) => `<option value="${district}">${district}</option>`).join("")}`;
}

function filterButton(kind, value, label, active) {
  const base = "rounded-md border px-3 py-2 text-sm font-medium transition";
  const classes = active
    ? "border-moss bg-moss text-white"
    : "border-ink/10 bg-white text-ink/70 hover:border-moss hover:text-moss";
  return `<button class="${base} ${classes}" data-${kind}="${value}" type="button">${label}</button>`;
}

function bindEvents() {
  $("search").addEventListener("input", (event) => {
    state.search = event.target.value;
    render();
  });
  $("district").addEventListener("change", (event) => {
    state.district = event.target.value;
    render();
  });
  $("sort").addEventListener("change", (event) => {
    state.sort = event.target.value;
    render();
  });
  $("city-filters").addEventListener("click", (event) => {
    const button = event.target.closest("[data-city]");
    if (!button) return;
    state.city = button.dataset.city;
    buildFilters();
    render();
  });
  $("scenario-filters").addEventListener("click", (event) => {
    const button = event.target.closest("[data-scenario]");
    if (!button) return;
    state.scenario = button.dataset.scenario;
    buildFilters();
    render();
  });
  $("park-list").addEventListener("click", (event) => {
    const button = event.target.closest("[data-id]");
    if (!button) return;
    state.selectedId = button.dataset.id;
    render();
  });
  $("map").addEventListener("click", (event) => {
    const marker = event.target.closest("[data-marker]");
    if (!marker) return;
    state.selectedId = marker.dataset.marker;
    render();
  });
}

function matchesScenario(park) {
  if (state.scenario === "all") return true;
  if (state.scenario === "family") return park.recreation.length || park.playground.length || park.playgroundType;
  if (state.scenario === "sport") return park.sports.length;
  if (state.scenario === "service") return park.services.length;
  if (state.scenario === "disaster") return park.disaster;
  return true;
}

function searchText(park) {
  return [
    park.city,
    park.name,
    park.englishName,
    park.district,
    park.type,
    park.address,
    park.management,
    park.phone,
    park.description,
    park.sports.join(" "),
    park.recreation.join(" "),
    park.services.join(" "),
    park.playground.join(" "),
    park.transit
  ].join(" ").toLowerCase();
}

function getFilteredParks() {
  const keyword = clean(state.search).toLowerCase();
  const parks = state.parks.filter((park) => {
    if (state.city !== "all" && park.city !== state.city) return false;
    if (state.district && park.district !== state.district) return false;
    if (!matchesScenario(park)) return false;
    if (keyword && !searchText(park).includes(keyword)) return false;
    return true;
  });

  parks.sort((a, b) => {
    if (state.sort === "area") return b.areaM2 - a.areaM2;
    if (state.sort === "capacity") return (b.disaster?.capacity || 0) - (a.disaster?.capacity || 0);
    if (state.sort === "name") return a.name.localeCompare(b.name, "zh-Hant");
    return scorePark(b) - scorePark(a);
  });

  return parks;
}

function scorePark(park) {
  return (park.disaster ? 8 : 0) + (park.playgroundType ? 4 : 0) + (park.sports.length ? 2 : 0) + (park.services.length ? 2 : 0) + Math.min(park.areaM2 / 50000, 3);
}

function render() {
  state.filtered = getFilteredParks();
  if (!state.filtered.some((park) => park.id === state.selectedId)) {
    state.selectedId = state.filtered[0]?.id || null;
  }
  renderStats();
  renderList();
  renderMap();
  renderDetail();
}

function renderStats() {
  $("stat-total").textContent = formatNumber(state.parks.length);
  $("stat-disaster").textContent = formatNumber(state.parks.filter((park) => park.disaster).length);
  $("stat-map").textContent = formatNumber(state.parks.filter(hasUsableCoord).length);
  $("result-count").textContent = `${formatNumber(state.filtered.length)} 筆`;
}

function renderList() {
  const list = state.filtered.slice(0, 160);
  $("park-list").innerHTML = list.map((park) => {
    const active = park.id === state.selectedId;
    const tags = getTags(park).slice(0, 4).map(tag).join("");
    return `
      <button data-id="${park.id}" type="button" class="w-full rounded-md border p-3 text-left transition ${active ? "border-moss bg-mist" : "border-ink/10 bg-white hover:border-moss/60"}">
        <div class="flex items-start justify-between gap-3">
          <div>
            <div class="font-semibold leading-snug">${park.name}</div>
            <div class="mt-1 text-sm text-ink/60">${park.city}${park.district ? ` · ${park.district}` : ""}</div>
          </div>
          ${park.disaster ? `<span class="shrink-0 rounded bg-clay px-2 py-1 text-xs font-medium text-white">防災</span>` : ""}
        </div>
        <div class="mt-2 flex flex-wrap gap-1.5">${tags}</div>
      </button>
    `;
  }).join("") || `<div class="rounded-md border border-ink/10 bg-white p-4 text-sm text-ink/60">找不到符合條件的公園。</div>`;
}

function getTags(park) {
  const tags = [park.type, park.completeness];
  if (park.playgroundType) tags.push(`${park.playgroundType}遊戲場`);
  if (park.sports.length) tags.push("運動設施");
  if (park.services.some((item) => item.includes("公廁") || item.includes("廁所"))) tags.push("公廁");
  if (park.services.some((item) => item.includes("涼亭"))) tags.push("涼亭");
  if (park.disaster?.complete) tags.push(`可容納 ${formatNumber(park.disaster.capacity)} 人`);
  return tags.filter(Boolean);
}

function tag(label, tone = "default") {
  const color = tone === "danger" ? "bg-clay/10 text-clay" : "bg-ink/5 text-ink/70";
  return `<span class="rounded px-2 py-1 text-xs font-medium ${color}">${label}</span>`;
}

function hasUsableCoord(park) {
  return park.longitude > 120 && park.longitude < 122 && park.latitude > 24 && park.latitude < 26;
}

function renderMap() {
  const points = state.filtered.filter(hasUsableCoord);
  const selected = state.parks.find((park) => park.id === state.selectedId);
  const lons = points.map((park) => park.longitude);
  const lats = points.map((park) => park.latitude);
  const minLon = Math.min(...lons, 121.45);
  const maxLon = Math.max(...lons, 121.65);
  const minLat = Math.min(...lats, 24.95);
  const maxLat = Math.max(...lats, 25.18);
  const pad = 8;

  $("map").innerHTML = `
    <div class="absolute inset-0 opacity-70">
      <div class="absolute left-[8%] top-[14%] h-[72%] w-[52%] rounded-full border border-white/70"></div>
      <div class="absolute right-[9%] top-[18%] h-[58%] w-[38%] rounded-full border border-white/70"></div>
      <div class="absolute bottom-[16%] left-[20%] h-1 w-[68%] rotate-[-18deg] rounded-full bg-river/20"></div>
    </div>
    ${points.slice(0, 500).map((park) => {
      const x = pad + ((park.longitude - minLon) / Math.max(maxLon - minLon, 0.01)) * (100 - pad * 2);
      const y = 100 - pad - ((park.latitude - minLat) / Math.max(maxLat - minLat, 0.01)) * (100 - pad * 2);
      const color = park.disaster ? "bg-clay" : park.type === "公園" ? "bg-moss" : "bg-river";
      const size = park.id === state.selectedId ? "h-4 w-4 ring-4 ring-white" : "h-2.5 w-2.5";
      return `<button data-marker="${park.id}" title="${park.name}" class="absolute ${size} -translate-x-1/2 -translate-y-1/2 rounded-full ${color} shadow" style="left:${x}%;top:${y}%"></button>`;
    }).join("")}
    ${selected ? `<div class="absolute bottom-3 left-3 right-3 rounded-md bg-white/95 p-3 shadow-soft">
      <div class="font-semibold">${selected.name}</div>
      <div class="mt-1 truncate text-sm text-ink/60">${selected.address || "尚無地址資料"}</div>
    </div>` : ""}
  `;
}

function renderDetail() {
  const park = state.parks.find((item) => item.id === state.selectedId);
  if (!park) {
    $("detail").innerHTML = `<div class="flex h-full min-h-[260px] items-center justify-center text-center text-ink/60">沒有符合條件的公園。</div>`;
    return;
  }

  const googleMaps = park.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${park.city} ${park.address}`)}` : "";
  $("detail").innerHTML = `
    <div class="grid gap-5 xl:grid-cols-[1fr_300px]">
      <div>
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div class="flex flex-wrap gap-2">${getTags(park).map((item) => tag(item, item.includes("容納") ? "danger" : "default")).join("")}</div>
            <h2 class="mt-3 text-2xl font-semibold">${park.name}</h2>
            ${park.englishName ? `<p class="mt-1 text-sm text-ink/50">${park.englishName}</p>` : ""}
          </div>
          ${googleMaps ? `<a class="rounded-md bg-ink px-4 py-2 text-sm font-medium text-white transition hover:bg-moss" href="${googleMaps}" target="_blank" rel="noreferrer">開啟地圖</a>` : ""}
        </div>

        <dl class="mt-5 grid gap-3 sm:grid-cols-2">
          ${info("城市", park.city)}
          ${info("行政區", park.district || "尚無資料")}
          ${info("地址", park.address || "尚無資料")}
          ${info("管理單位", park.management || "尚無資料")}
          ${info("電話", park.phone || "尚無資料")}
          ${info("開放時間", park.openingHours || "尚無資料")}
          ${info("面積", park.areaM2 ? `${formatNumber(park.areaM2)} 平方公尺` : "尚無資料")}
          ${info("資料完整度", park.completeness)}
        </dl>

        ${park.description ? `<p class="mt-5 max-h-28 overflow-auto rounded-md bg-mist p-4 text-sm leading-6 text-ink/75">${park.description}</p>` : ""}

        <div class="mt-5 grid gap-4 md:grid-cols-3">
          ${chipSection("運動設施", park.sports)}
          ${chipSection("遊憩遊具", [...park.recreation, ...park.playground])}
          ${chipSection("服務設施", park.services)}
        </div>
      </div>

      <aside class="space-y-4">
        ${disasterPanel(park)}
        <div class="rounded-md border border-ink/10 bg-mist p-4">
          <h3 class="font-semibold">交通資訊</h3>
          <p class="mt-2 text-sm leading-6 text-ink/70">${park.transit || "尚無資料"}</p>
        </div>
      </aside>
    </div>
  `;
}

function info(label, value) {
  return `
    <div class="rounded-md border border-ink/10 bg-white p-3">
      <dt class="text-xs font-medium text-ink/50">${label}</dt>
      <dd class="mt-1 break-words text-sm text-ink">${value}</dd>
    </div>
  `;
}

function chipSection(title, items) {
  const chips = [...new Set(items)].slice(0, 18);
  return `
    <section class="rounded-md border border-ink/10 bg-white p-4">
      <h3 class="font-semibold">${title}</h3>
      <div class="mt-3 flex flex-wrap gap-1.5">
        ${chips.length ? chips.map((item) => tag(item)).join("") : `<span class="text-sm text-ink/45">尚無資料</span>`}
      </div>
    </section>
  `;
}

function disasterPanel(park) {
  if (!park.disaster) {
    return `
      <div class="rounded-md border border-ink/10 bg-white p-4">
        <h3 class="font-semibold">防災資訊</h3>
        <p class="mt-2 text-sm text-ink/60">此公園目前未列入防災公園資料。</p>
      </div>
    `;
  }

  if (!park.disaster.complete) {
    return `
      <div class="rounded-md border border-clay/20 bg-clay/5 p-4">
        <h3 class="font-semibold text-clay">防災資訊</h3>
        <p class="mt-2 text-sm text-ink/70">已列入防災公園清單，但容量與應變單位資料尚未完整提供。</p>
      </div>
    `;
  }

  const amountTotal = park.disaster.amounts.reduce((sum, item) => sum + item, 0);
  return `
    <div class="rounded-md border border-clay/20 bg-clay/5 p-4">
      <h3 class="font-semibold text-clay">防災資訊</h3>
      <div class="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div class="rounded bg-white p-3">
          <div class="text-ink/50">收容人數</div>
          <div class="mt-1 text-lg font-semibold">${formatNumber(park.disaster.capacity)}</div>
        </div>
        <div class="rounded bg-white p-3">
          <div class="text-ink/50">收容面積</div>
          <div class="mt-1 text-lg font-semibold">${formatNumber(park.disaster.areaM2)}</div>
        </div>
      </div>
      <dl class="mt-3 space-y-2 text-sm">
        ${infoCompact("醫院", park.disaster.hospital)}
        ${infoCompact("消防", park.disaster.fire)}
        ${infoCompact("警察", park.disaster.police)}
        ${infoCompact("設備數量", `${formatNumber(amountTotal)} 項次`)}
      </dl>
    </div>
  `;
}

function infoCompact(label, value) {
  return `<div><dt class="text-ink/50">${label}</dt><dd class="mt-0.5 text-ink/75">${value || "尚無資料"}</dd></div>`;
}

init().catch((error) => {
  console.error(error);
  document.body.innerHTML = `<main class="mx-auto max-w-3xl p-6 text-red-700">資料讀取失敗，請確認是否透過本機伺服器開啟 index.html。</main>`;
});
