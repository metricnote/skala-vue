<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import axios from 'axios'

const articles = ref([])
const currentIndex = ref(0)
const isLoading = ref(true)
let rotationTimer

const currentArticle = computed(() => articles.value[currentIndex.value] || null)

const fetchHeadlines = async () => {
  const apiKey = import.meta.env.VITE_GNEWS_API_KEY
  if (!apiKey) {
    isLoading.value = false
    return
  }

  try {
    const response = await axios.get('https://gnews.io/api/v4/top-headlines', {
      params: { category: 'general', country: 'kr', lang: 'ko', max: 10, apikey: apiKey },
    })
    articles.value = response.data.articles || []
    if (articles.value.length > 1) {
      rotationTimer = window.setInterval(() => {
        currentIndex.value = (currentIndex.value + 1) % articles.value.length
      }, 5000)
    }
  } catch (error) {
    console.error('메인 뉴스 티커 로딩 실패:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchHeadlines)
onBeforeUnmount(() => window.clearInterval(rotationTimer))
</script>

<template>
  <aside v-if="isLoading || currentArticle" class="news-ticker" aria-label="한국 최신 뉴스">
    <span class="news-label">최신 뉴스</span>
    <div class="news-viewport">
      <el-skeleton v-if="isLoading" :rows="0" animated />
      <Transition v-else name="news-roll" mode="out-in">
        <a :key="currentArticle.url" :href="currentArticle.url" target="_blank" rel="noopener noreferrer">
          <strong>{{ currentArticle.title }}</strong>
          <span>{{ currentArticle.source?.name }}</span>
        </a>
      </Transition>
    </div>
  </aside>
</template>

<style scoped>
.news-ticker { display: flex; align-items: center; width: min(1120px, calc(100% - 40px)); min-height: 48px; margin: 10px auto 0; overflow: hidden; background: rgba(255, 255, 255, 0.72); border: 1px solid rgba(255, 255, 255, 0.9); border-radius: 15px; box-shadow: 0 10px 30px rgba(37, 99, 235, 0.09); backdrop-filter: blur(18px); }
.news-label { flex: 0 0 auto; padding: 0 18px; color: #2563eb; font-size: 0.82rem; font-weight: 800; }
.news-viewport { position: relative; min-width: 0; height: 48px; flex: 1; overflow: hidden; border-left: 1px solid rgba(148, 163, 184, 0.22); }
.news-viewport a { position: absolute; inset: 0; display: flex; align-items: center; gap: 12px; min-width: 0; padding: 0 18px; color: #172033; text-decoration: none; }
.news-viewport strong { min-width: 0; overflow: hidden; font-size: 0.92rem; font-weight: 650; text-overflow: ellipsis; white-space: nowrap; }
.news-viewport span { flex: 0 0 auto; color: #64748b; font-size: 0.78rem; }
.news-roll-enter-active, .news-roll-leave-active { transition: transform 0.5s cubic-bezier(.22,.75,.25,1), opacity 0.5s ease; }
.news-roll-enter-from { opacity: 0; transform: translateY(100%) rotateX(-35deg); }
.news-roll-leave-to { opacity: 0; transform: translateY(-100%) rotateX(35deg); }
@media (max-width: 600px) {
  .news-ticker { width: calc(100% - 24px); }
  .news-label { padding: 0 12px; }
  .news-viewport a { padding: 0 12px; }
  .news-viewport span { display: none; }
}
</style>
