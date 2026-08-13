<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import axios from 'axios'
import WeatherRecommendations from '../components/exercise/WeatherRecommendations.vue'
import AirQualityCard from '../components/exercise/AirQualityCard.vue'
import KoreanNewsCard from '../components/exercise/KoreanNewsCard.vue'
import { normalizeWeatherDescription } from '../utils/weatherText'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()

const cityData = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')
const airQuality = ref(null)
const airLoading = ref(false)
const airError = ref('')
const meal = ref(null)
const mealLoading = ref(false)
const mealError = ref('')
const newsArticles = ref([])
const newsLoading = ref(false)
const newsError = ref('')
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'
const AIR_URL = 'https://api.openweathermap.org/data/2.5/air_pollution'
const MEAL_URL = 'https://www.themealdb.com/api/json/v1/1'
const NEWS_URL = 'https://gnews.io/api/v4/top-headlines'
const GNEWS_API_KEY = import.meta.env.VITE_GNEWS_API_KEY
const publicPath = (fileName) => `${import.meta.env.BASE_URL}weather-examples/${fileName}`

const cityMapping = {
  city_01: { english: 'Seoul', korean: '대한민국 서울특별시' },
  city_02: { english: 'Suwon', korean: '경기도 수원시 영통구' },
  city_03: { english: 'Busan', korean: '부산광역시 해운대구' },
}

const simulatedMapping = {
  sim_siberia: { name: '시베리아', temp: -32, status: '한파 경보', humidity: '52%', wind: '14.2m/s', simulated: true, image: publicPath('cold-wave.png') },
  sim_amazon: { name: '아마존', temp: 29, status: '시간당 50mm 폭우', humidity: '96%', wind: '11.8m/s', simulated: true, image: publicPath('heavy-rain.png') },
  sim_alaska: { name: '알래스카', temp: -18, status: '대설 경보 · 폭설', humidity: '88%', wind: '16.4m/s', simulated: true, image: publicPath('heavy-snow.png') },
  sim_sahara: { name: '사하라 사막', temp: 46, status: '폭염 경보', humidity: '9%', wind: '8.7m/s', simulated: true, image: publicPath('heat-wave.png') },
}

const getMealCategory = (weather) => {
  if (/비|폭우|소나기/.test(weather.status)) return 'Pasta'
  if (/눈|폭설|한파/.test(weather.status) || weather.temp < 8) return 'Beef'
  if (weather.temp >= 28) return 'Seafood'
  return 'Vegetarian'
}

const fetchMeal = async (weather) => {
  mealLoading.value = true
  mealError.value = ''
  try {
    const category = getMealCategory(weather)
    const listResponse = await axios.get(`${MEAL_URL}/filter.php`, { params: { c: category } })
    const candidates = listResponse.data.meals || []
    if (!candidates.length) throw new Error('추천 음식 없음')
    const selected = candidates[Math.floor(Math.random() * candidates.length)]
    const detailResponse = await axios.get(`${MEAL_URL}/lookup.php`, { params: { i: selected.idMeal } })
    const detail = detailResponse.data.meals?.[0]
    meal.value = {
      name: detail?.strMeal || selected.strMeal,
      thumbnail: detail?.strMealThumb || selected.strMealThumb,
      category: detail?.strCategory || category,
      area: detail?.strArea || '세계 요리',
      source: detail?.strSource || detail?.strYoutube || '',
    }
  } catch (error) {
    console.error('TheMealDB 추천 실패:', error)
    mealError.value = '외부 음식 추천을 불러오지 못해 날씨 기반 기본 메뉴를 표시합니다.'
  } finally {
    mealLoading.value = false
  }
}

const fetchAirQuality = async (coord) => {
  airLoading.value = true
  airError.value = ''
  try {
    const response = await axios.get(AIR_URL, { params: { lat: coord.lat, lon: coord.lon, appid: API_KEY } })
    const result = response.data.list?.[0]
    if (!result) throw new Error('대기질 데이터 없음')
    airQuality.value = { aqi: result.main.aqi, pm25: result.components.pm2_5, pm10: result.components.pm10, o3: result.components.o3 }
  } catch (error) {
    console.error('OpenWeather 대기질 API 실패:', error)
    airError.value = '대기질 정보를 불러오지 못했습니다.'
  } finally {
    airLoading.value = false
  }
}

const fetchKoreanNews = async () => {
  if (!GNEWS_API_KEY) {
    newsError.value = 'GNews API 키를 설정하면 한국 최신 기사가 표시됩니다.'
    return
  }
  newsLoading.value = true
  newsError.value = ''
  try {
    const response = await axios.get(NEWS_URL, {
      params: { category: 'general', country: 'kr', lang: 'ko', max: 4, apikey: GNEWS_API_KEY },
    })
    newsArticles.value = (response.data.articles || []).map((article) => ({
      title: article.title,
      url: article.url,
      source: article.source?.name || '언론사',
      publishedAt: article.publishedAt,
    }))
    if (!newsArticles.value.length) newsError.value = '현재 표시할 최신 기사가 없습니다.'
  } catch (error) {
    console.error('GNews API 실패:', error)
    newsError.value = '최신 뉴스를 불러오지 못했습니다. GNews API 키와 사용량을 확인해 주세요.'
  } finally {
    newsLoading.value = false
  }
}

onMounted(async () => {
  fetchKoreanNews()
  const simulatedCity = simulatedMapping[route.params.cityId]
  if (simulatedCity) {
    cityData.value = simulatedCity
    fetchMeal(simulatedCity)
    return
  }

  const targetCity = cityMapping[route.params.cityId]
  if (!targetCity) {
    errorMessage.value = '해당 지역의 상세 데이터가 존재하지 않습니다.'
    return
  }
  if (!API_KEY) {
    errorMessage.value = 'OpenWeatherMap API 키를 .env.local에 설정해 주세요.'
    return
  }

  isLoading.value = true
  try {
    const response = await axios.get(BASE_URL, {
      params: { q: targetCity.english, appid: API_KEY, units: 'metric', lang: 'kr' },
    })
    const raw = response.data
    cityData.value = {
      name: targetCity.korean,
      temp: raw.main.temp,
      status: normalizeWeatherDescription(raw.weather[0].description),
      humidity: `${raw.main.humidity}%`,
      wind: `${raw.wind.speed}m/s`,
    }
    await Promise.allSettled([fetchAirQuality(raw.coord), fetchMeal(cityData.value)])
  } catch (error) {
    console.error('상세 정보 로딩 중 네트워크 오류 발생:', error)
    errorMessage.value = '상세 날씨를 불러오지 못했습니다. API 키와 네트워크 상태를 확인해 주세요.'
  } finally {
    isLoading.value = false
  }
})

const displayTemp = computed(() => {
  if (!cityData.value) return 0
  return configStore.unit === 'fahrenheit' ? Math.round((cityData.value.temp * 9) / 5 + 32) : Math.round(cityData.value.temp)
})
</script>

<template>
  <div class="detail-container">
    <el-page-header title="대시보드" content="상세 기상 정보" @back="router.push('/')" />

    <el-skeleton v-if="isLoading" :rows="5" animated class="detail-loading" />
    <el-result v-else-if="errorMessage" icon="error" title="날씨 정보를 불러올 수 없습니다" :sub-title="errorMessage">
      <template #extra><el-button type="primary" @click="router.push('/')">대시보드로 돌아가기</el-button></template>
    </el-result>

    <template v-else-if="cityData">
      <div class="detail-hero">
        <div>
          <el-tag :type="cityData.simulated ? 'warning' : 'success'" effect="dark" round>{{ cityData.simulated ? 'SIMULATION' : 'LIVE' }}</el-tag>
          <h3>{{ cityData.name }}</h3>
          <el-text type="info">{{ cityData.status }}</el-text>
        </div>
        <div class="detail-temperature">{{ displayTemp }}<small>{{ configStore.unitSymbol }}</small></div>
      </div>
      <el-descriptions :column="2" border class="weather-descriptions">
        <el-descriptions-item label="현재 기온">{{ displayTemp }}{{ configStore.unitSymbol }}</el-descriptions-item>
        <el-descriptions-item label="기상 현황">{{ cityData.status }}</el-descriptions-item>
        <el-descriptions-item label="대기 습도">{{ cityData.humidity }}</el-descriptions-item>
        <el-descriptions-item label="현재 풍속">{{ cityData.wind }}</el-descriptions-item>
      </el-descriptions>
      <AirQualityCard :air-quality="airQuality" :loading="airLoading" :error="airError" :simulated="cityData.simulated" />
      <WeatherRecommendations :weather="cityData" :meal="meal" :meal-loading="mealLoading" :meal-error="mealError" />
      <KoreanNewsCard :articles="newsArticles" :loading="newsLoading" :error="newsError" />
    </template>
  </div>
</template>

<style scoped>
.detail-container { padding: 8px 0; }
.detail-loading { margin-top: 28px; }
.detail-hero { display: flex; align-items: center; justify-content: space-between; padding: 32px 4px 24px; }
.detail-hero h3 { margin: 10px 0 4px; font-size: 1.55rem; }
.detail-temperature { color: #2563eb; font-size: 3.5rem; font-weight: 800; letter-spacing: -0.08em; }
.detail-temperature small { margin-left: 4px; font-size: 1.25rem; }
.weather-descriptions { margin-bottom: 8px; }
@media (max-width: 600px) {
  .detail-hero { align-items: flex-start; }
  .detail-temperature { font-size: 2.5rem; }
  .weather-descriptions :deep(.el-descriptions__body) { overflow-x: auto; }
}
</style>
