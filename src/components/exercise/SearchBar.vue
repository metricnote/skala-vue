<script setup>
defineEmits(['update-query'])

defineProps({
  currentQuery: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="search-inner">
    <div class="field-label">
      <span>도시 검색</span>
    </div>
    <el-input
      :model-value="currentQuery"
      size="large"
      clearable
      placeholder="도시 이름을 입력해 주세요"
      aria-label="도시 검색"
      @update:model-value="$emit('update-query', $event)"
    >
      <template #prefix>🔍</template>
    </el-input>
    <el-text v-if="currentQuery" class="search-caption" type="primary">‘{{ currentQuery }}’ 검색 결과입니다.</el-text>
  </div>
</template>
