<script setup>
import { computed } from 'vue'

const props = defineProps({
  airQuality: { type: Object, default: null },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
  simulated: { type: Boolean, default: false },
})

const levels = {
  1: { label: '좋음', type: 'success', advice: '환기와 야외활동을 즐기기 좋은 대기 상태예요.' },
  2: { label: '보통', type: 'success', advice: '대체로 무난하지만 민감군은 장시간 야외활동에 유의하세요.' },
  3: { label: '보통 이상', type: 'warning', advice: '민감군은 외출 시간을 줄이고 마스크를 준비하세요.' },
  4: { label: '나쁨', type: 'danger', advice: '장시간 야외활동을 피하고 보건용 마스크를 권장해요.' },
  5: { label: '매우 나쁨', type: 'danger', advice: '외출과 환기를 최소화하고 실내 공기 관리에 신경 써 주세요.' },
}

const level = computed(() => levels[props.airQuality?.aqi] || levels[3])
</script>

<template>
  <el-card class="air-quality-card" shadow="never">
    <div class="api-card-heading">
      <div><el-text type="primary" size="small">OPENWEATHER AIR POLLUTION API</el-text><h3>🌬️ 실시간 대기질</h3></div>
      <el-tag v-if="airQuality" :type="level.type" effect="dark" round>{{ level.label }}</el-tag>
    </div>
    <el-skeleton v-if="loading" :rows="2" animated />
    <el-alert v-else-if="simulated" title="대기질 정보는 실제 관측 지역에서만 제공됩니다." type="info" show-icon :closable="false" />
    <el-alert v-else-if="error" :title="error" type="warning" show-icon :closable="false" />
    <template v-else-if="airQuality">
      <div class="air-metrics">
        <div><span>PM2.5</span><strong>{{ airQuality.pm25 }}</strong><small>㎍/㎥</small></div>
        <div><span>PM10</span><strong>{{ airQuality.pm10 }}</strong><small>㎍/㎥</small></div>
        <div><span>오존</span><strong>{{ airQuality.o3 }}</strong><small>㎍/㎥</small></div>
      </div>
      <p class="api-advice">{{ level.advice }}</p>
    </template>
  </el-card>
</template>
