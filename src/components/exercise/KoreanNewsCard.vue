<script setup>
defineProps({
  articles: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
})

const formatPublishedAt = (value) => {
  if (!value) return ''
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}
</script>

<template>
  <section class="news-section" aria-labelledby="korean-news-title">
    <div class="news-heading">
      <div>
        <el-text type="primary" size="small">LIVE HEADLINES</el-text>
        <h3 id="korean-news-title">한국 최신 뉴스</h3>
      </div>
      <el-tag type="info" effect="plain" round>GNews</el-tag>
    </div>

    <el-skeleton v-if="loading" :rows="4" animated />
    <el-alert v-else-if="error" :title="error" type="info" :closable="false" />
    <div v-else class="news-list">
      <a v-for="article in articles" :key="article.url" class="news-item" :href="article.url" target="_blank" rel="noopener noreferrer">
        <strong>{{ article.title }}</strong>
        <span>{{ article.source }} · {{ formatPublishedAt(article.publishedAt) }}</span>
      </a>
    </div>
  </section>
</template>

<style scoped>
.news-section { padding: 24px; margin-top: 18px; background: rgba(255, 255, 255, 0.66); border: 1px solid rgba(255, 255, 255, 0.88); border-radius: 24px; box-shadow: 0 18px 44px rgba(37, 99, 235, 0.08); backdrop-filter: blur(20px); }
.news-heading { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 14px; }
.news-heading h3 { margin: 5px 0 0; font-size: 1.35rem; letter-spacing: -0.03em; }
.news-list { display: grid; gap: 8px; }
.news-item { display: grid; gap: 6px; padding: 14px 16px; color: #172033; text-decoration: none; background: rgba(248, 250, 252, 0.72); border: 1px solid rgba(148, 163, 184, 0.2); border-radius: 14px; transition: 0.2s ease; }
.news-item:hover { border-color: rgba(37, 99, 235, 0.35); box-shadow: 0 8px 24px rgba(37, 99, 235, 0.09); transform: translateY(-1px); }
.news-item strong { line-height: 1.45; }
.news-item span { color: #64748b; font-size: 0.82rem; }
@media (max-width: 600px) { .news-section { padding: 18px; } }
</style>
