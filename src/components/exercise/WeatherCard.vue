<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'

const props = defineProps({
  cityItem: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['click-detail'])
const configStore = useConfigStore()

const displayTemp = computed(() => {
  const rawTemp = props.cityItem.temp
  return configStore.unit === 'fahrenheit' ? Math.round((rawTemp * 9) / 5 + 32) : Math.round(rawTemp)
})

const isHot = computed(() => props.cityItem.temp >= 25)
const conditionLabel = computed(() => {
  if (/폭우/.test(props.cityItem.status)) return '🌊 폭우'
  if (/폭설|대설/.test(props.cityItem.status)) return '☃️ 폭설'
  if (/한파/.test(props.cityItem.status)) return '🥶 한파'
  if (/폭염/.test(props.cityItem.status)) return '🥵 폭염'
  return isHot.value ? '🔥 더움' : '❄️ 선선함'
})
</script>

<template>
  <el-card class="weather-card" shadow="hover">
    <div class="weather-card-content">
      <div>
        <div class="city-row">
          <h4>{{ cityItem.name }}</h4>
          <el-tag :type="isHot ? 'danger' : 'primary'" effect="light" round>
            {{ conditionLabel }}
          </el-tag>
        </div>
        <el-text type="info">{{ cityItem.status }}</el-text>
      </div>
      <div class="temperature">{{ displayTemp }}<small>{{ configStore.unitSymbol }}</small></div>
    </div>
    <el-button type="primary" plain round @click.stop="emit('click-detail', cityItem.name, cityItem.status)">
      상세보기
    </el-button>
  </el-card>
</template>
