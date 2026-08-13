<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import SearchBar from '../components/exercise/SearchBar.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'
import { normalizeWeatherDescription } from '../utils/weatherText'

const router = useRouter()
const route = useRoute()

const weatherList = ref([])
const searchQuery = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'
const simulatedRegions = [
  { id: 'sim_siberia', name: '시베리아', temp: -32, status: '한파 경보', simulated: true, image: '/weather-examples/cold-wave.png' },
  { id: 'sim_amazon', name: '아마존', temp: 29, status: '시간당 50mm 폭우', simulated: true, image: '/weather-examples/heavy-rain.png' },
  { id: 'sim_alaska', name: '알래스카', temp: -18, status: '대설 경보 · 폭설', simulated: true, image: '/weather-examples/heavy-snow.png' },
  { id: 'sim_sahara', name: '사하라 사막', temp: 46, status: '폭염 경보', simulated: true, image: '/weather-examples/heat-wave.png' },
]

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  if (!query) return weatherList.value
  return weatherList.value.filter((item) => item.name.includes(query))
})

const fetchRealTimeWeather = async () => {
  if (!API_KEY) {
    errorMessage.value = 'OpenWeatherMap API 키를 .env.local에 설정해 주세요.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    const requests = ['Seoul', 'Suwon', 'Busan'].map((city) =>
      axios.get(BASE_URL, {
        params: { q: city, appid: API_KEY, units: 'metric', lang: 'kr' },
      }),
    )
    const [seoulRes, suwonRes, busanRes] = await Promise.all(requests)

    weatherList.value = [
      { id: 'city_01', name: '서울', temp: seoulRes.data.main.temp, status: normalizeWeatherDescription(seoulRes.data.weather[0].description) },
      { id: 'city_02', name: '수원', temp: suwonRes.data.main.temp, status: normalizeWeatherDescription(suwonRes.data.weather[0].description) },
      { id: 'city_03', name: '부산', temp: busanRes.data.main.temp, status: normalizeWeatherDescription(busanRes.data.weather[0].description) },
      ...simulatedRegions,
    ]
  } catch (error) {
    console.error('날씨 API 연동 실패:', error)
    errorMessage.value = '실시간 날씨를 불러오지 못했습니다. API 키와 네트워크 상태를 확인해 주세요.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (route.query.search) {
    searchQuery.value = route.query.search
  }
  fetchRealTimeWeather()
})

watch(searchQuery, (newQuery) => {
  router.push({
    path: route.path,
    query: { search: newQuery || undefined },
  })
})

const handleDetailJump = (id) => {
  router.push(`/weather/${id}`)
}
</script>

<template>
  <div class="dashboard-wrapper">
    <BaseDashboardCard>
      <SearchBar :current-query="searchQuery" @update-query="(val) => (searchQuery = val)" />
    </BaseDashboardCard>

    <BaseDashboardCard>
      <div class="list-heading">
        <div>
          <h3>지역별 날씨</h3>
          <el-text type="info">국내 실시간 관측 + 세계 극한 날씨 시뮬레이션</el-text>
        </div>
        <div class="weather-legend"><el-tag type="success" effect="plain" round>LIVE</el-tag><el-tag type="warning" effect="plain" round>SIMULATION</el-tag></div>
      </div>

      <el-skeleton v-if="isLoading" :rows="5" animated />
      <el-alert v-else-if="errorMessage" :title="errorMessage" type="error" show-icon :closable="false" />

      <template v-else>
        <WeatherCard
          v-for="item in filteredWeatherList"
          :key="item.id"
          :city-item="item"
          @click-detail="handleDetailJump(item.id)"
        />
        <el-empty v-if="filteredWeatherList.length === 0" description="검색 결과와 일치하는 도시가 없습니다." />
      </template>
    </BaseDashboardCard>

  </div>
</template>

<style scoped>
.list-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.list-heading h3 {
  margin: 0 0 4px;
}
</style>
