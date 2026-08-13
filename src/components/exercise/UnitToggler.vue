<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()
const isFahrenheit = computed({
  get: () => configStore.unit === 'fahrenheit',
  set: () => configStore.toggleUnit(),
})
</script>

<template>
  <div class="unit-control">
    <el-text size="small">℃</el-text>
    <el-switch v-model="isFahrenheit" aria-label="온도 단위 변경" />
    <el-text size="small">℉</el-text>
  </div>
</template>
