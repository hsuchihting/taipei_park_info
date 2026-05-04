export interface DisasterInfo {
  areaM2: number
  capacity: number
  amounts: number[]
  hospital: string
  fire: string
  police: string
  longitude: number
  latitude: number
  complete: boolean
}

export interface Park {
  id: string
  sourceId: string | number
  city: string
  name: string
  englishName: string
  district: string
  type: string
  address: string
  management: string
  phone: string
  description: string
  longitude: number
  latitude: number
  areaM2: number
  openingHours: string
  sports: string[]
  recreation: string[]
  services: string[]
  transit: string
  playgroundType: string
  playgroundArea: number
  playground: string[]
  disaster: DisasterInfo | null
  completeness: string
  mapUrl?: string
}

type Row = Record<string, unknown>

const clean = (v: unknown) => String(v ?? '').replace(/^﻿/, '').trim()
const toNum = (v: unknown) => {
  const n = Number(String(v ?? '').replace(/,/g, ''))
  return Number.isFinite(n) ? n : 0
}
const uniqueList = (v: unknown) =>
  [...new Set(clean(v).split(/[、,，.。；;\r\n]+/).map(s => s.trim()).filter(Boolean))]
const nameKey = (v: unknown) =>
  clean(v).replace(/[\s　]/g, '').replace(/[()（）].*?[)）]/g, '')
const inferType = (name: unknown, fallback = '') => {
  const t = clean(`${name} ${fallback}`)
  if (t.includes('綠地')) return '綠地'
  if (t.includes('廣場')) return '廣場'
  return '公園'
}

export const formatNumber = (v: number) => v.toLocaleString('zh-TW')

export const hasUsableCoord = (p: Park) =>
  p.longitude > 120 && p.longitude < 122 && p.latitude > 24 && p.latitude < 26

export function getParkTags(park: Park): string[] {
  const tags = [park.type, park.completeness]
  if (park.playgroundType) tags.push(`${park.playgroundType}遊戲場`)
  if (park.sports.length) tags.push('運動設施')
  if (park.services.some(s => s.includes('公廁') || s.includes('廁所'))) tags.push('公廁')
  if (park.services.some(s => s.includes('停車'))) tags.push('停車')
  if (park.services.some(s => s.includes('涼亭'))) tags.push('涼亭')
  if (park.disaster?.complete) tags.push(`可容納 ${formatNumber(park.disaster.capacity)} 人`)
  return tags.filter(Boolean)
}

function normalizeDisaster(row: Row): DisasterInfo {
  return {
    areaM2: toNum(row.di_area),
    capacity: toNum(row.di_capacity),
    amounts: Array.from({ length: 18 }, (_, i) => toNum(row[`di_Amount${i + 1}`])),
    hospital: clean(row.di_hospital),
    fire: clean(row.di_fire),
    police: clean(row.di_police),
    longitude: toNum(row.pm_Longitude),
    latitude: toNum(row.pm_Latitude),
    complete: !!(clean(row.di_capacity as string) || clean(row.di_area as string))
  }
}

function normalizeTaipei(row: Row, disasterMap: Map<string, Row>): Park {
  const disaster = disasterMap.get(nameKey(row.pm_name))
  return {
    id: `tp-${row.SeqNo}`,
    sourceId: row.SeqNo as string,
    city: '臺北市',
    name: clean(row.pm_name),
    englishName: clean(row.pm_name_eng),
    district: clean(row.pm_libie).replace(/里$/, '里'),
    type: clean(row.pm_type) || inferType(row.pm_name),
    address: clean(row.pm_location),
    management: clean(row.pm_unit),
    phone: clean(row.pm_phone),
    description: clean(row.pm_overview),
    longitude: toNum(row.pm_Longitude),
    latitude: toNum(row.pm_Latitude),
    areaM2: toNum(row.pm_LandPublicArea),
    openingHours: `${clean(row.pm_opening_s)}-${clean(row.pm_opening_e)}`,
    sports: uniqueList(row.pm_sports),
    recreation: uniqueList(row.pm_recreation),
    services: uniqueList(row.pm_service),
    transit: clean(row.pm_transit),
    playgroundType: clean(row.pm_playtype),
    playgroundArea: toNum(row.pm_playarea),
    playground: uniqueList(row.pm_playeq).slice(0, 24),
    disaster: disaster ? normalizeDisaster(disaster) : null,
    completeness: disaster ? '完整 + 防災' : '完整'
  }
}

function normalizeNewTaipei(row: Row): Park {
  const name = clean(row.name)
  return {
    id: `nt-${row.seqno}`,
    sourceId: row.seqno as string,
    city: '新北市',
    name,
    englishName: '',
    district: clean(row.area),
    type: inferType(row.name),
    address: clean(row.address),
    management: clean(row.management),
    phone: clean(row.localcallservice),
    description: '',
    longitude: 0, latitude: 0, areaM2: 0,
    openingHours: '',
    sports: [],
    recreation: name.includes('兒') || name.includes('遊') ? ['兒童遊憩推估'] : [],
    services: [], transit: '',
    playgroundType: '', playgroundArea: 0, playground: [],
    disaster: null, completeness: '名錄'
  }
}

function normalizeTaoyuan(row: Row, index: number): Park {
  const services: string[] = []
  if (clean(row['停車'])) services.push('停車')
  if (clean(row['廁所'])) services.push('廁所')
  const facilities = uniqueList(row['設施'])
  return {
    id: `ty-${index + 1}`,
    sourceId: index + 1,
    city: '桃園市',
    name: clean(row['公園名稱']),
    englishName: '',
    district: clean(row['區域']),
    type: inferType(row['公園名稱']),
    address: clean(row['地址']),
    management: '', phone: '',
    description: clean(row['特色']),
    longitude: 0, latitude: 0, areaM2: 0,
    openingHours: '',
    sports: facilities.filter(s => /單槓|滑板|BMX|極限|運動|Pump/i.test(s)),
    recreation: facilities,
    services,
    transit: '',
    mapUrl: clean(row['地標']),
    playgroundType: '特色', playgroundArea: 0,
    playground: facilities.slice(0, 24),
    disaster: null, completeness: '特色遊戲場'
  }
}

const scorePark = (p: Park) =>
  (p.disaster ? 8 : 0) + (p.playgroundType ? 4 : 0) + (p.sports.length ? 2 : 0) +
  (p.services.length ? 2 : 0) + Math.min(p.areaM2 / 50000, 3)

export function useParks() {
  const parks = useState<Park[]>('parks', () => [])
  const selectedId = useState<string | null>('selectedId', () => null)
  const city = useState('city', () => 'all')
  const scenario = useState('scenario', () => 'all')
  const district = useState('district', () => '')
  const sort = useState('sort', () => 'relevance')
  const search = useState('search', () => '')
  const loading = useState('loading', () => false)

  const config = useRuntimeConfig()

  async function fetchJson(path: string) {
    const base = config.app.baseURL.replace(/\/$/, '')
    const response = await fetch(base + path)
    const text = await response.text()
    return JSON.parse(text.replace(/^﻿/, ''))
  }

  async function fetchJsonSafe(path: string, fallback: Row[] = []) {
    try { return await fetchJson(path) } catch { return fallback }
  }

  async function loadData() {
    loading.value = true
    try {
      const [taipeiRows, newTaipeiRows, disasterRows, taoyuanRows] = await Promise.all([
        fetchJson('/臺北市公園基本資料.json'),
        fetchJson('/新北市公園_export.json'),
        fetchJson('/防災公園資訊.json'),
        fetchJsonSafe('/桃園市特色公園.json')
      ])

      const disasterMap = new Map<string, Row>(
        (disasterRows as Row[]).map(r => [nameKey(r.pm_name), r])
      )

      parks.value = [
        ...(taipeiRows as Row[]).map(r => normalizeTaipei(r, disasterMap)),
        ...(newTaipeiRows as Row[]).map(r => normalizeNewTaipei(r)),
        ...(taoyuanRows as Row[]).map((r, i) => normalizeTaoyuan(r, i))
      ]

      selectedId.value = parks.value.find(p => p.disaster)?.id ?? parks.value[0]?.id ?? null
    } finally {
      loading.value = false
    }
  }

  const districts = computed(() =>
    [...new Set(parks.value.map(p => p.district).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b, 'zh-Hant'))
  )

  const filtered = computed(() => {
    const keyword = clean(search.value).toLowerCase()
    const result = parks.value.filter(park => {
      if (city.value !== 'all' && park.city !== city.value) return false
      if (district.value && park.district !== district.value) return false
      if (!matchesScenario(park)) return false
      if (keyword && !searchText(park).includes(keyword)) return false
      return true
    })

    result.sort((a, b) => {
      if (sort.value === 'area') return b.areaM2 - a.areaM2
      if (sort.value === 'capacity') return (b.disaster?.capacity ?? 0) - (a.disaster?.capacity ?? 0)
      if (sort.value === 'name') return a.name.localeCompare(b.name, 'zh-Hant')
      return scorePark(b) - scorePark(a)
    })

    return result
  })

  function matchesScenario(park: Park): boolean {
    if (scenario.value === 'all') return true
    if (scenario.value === 'family') return !!(park.recreation.length || park.playground.length || park.playgroundType)
    if (scenario.value === 'sport') return park.sports.length > 0
    if (scenario.value === 'service') return park.services.length > 0
    if (scenario.value === 'disaster') return !!park.disaster
    return true
  }

  function searchText(park: Park): string {
    return [
      park.city, park.name, park.englishName, park.district, park.type,
      park.address, park.management, park.phone, park.description,
      ...park.sports, ...park.recreation, ...park.services, ...park.playground,
      park.transit, park.mapUrl ?? ''
    ].join(' ').toLowerCase()
  }

  const selectedPark = computed(() => parks.value.find(p => p.id === selectedId.value) ?? null)

  const stats = computed(() => ({
    total: parks.value.length,
    disaster: parks.value.filter(p => p.disaster).length,
    mappable: parks.value.filter(hasUsableCoord).length
  }))

  function selectPark(id: string) {
    selectedId.value = id
  }

  return {
    parks, selectedId, city, scenario, district, sort, search, loading,
    filtered, districts, selectedPark, stats,
    loadData, selectPark
  }
}
