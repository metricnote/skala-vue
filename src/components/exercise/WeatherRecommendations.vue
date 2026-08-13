<script setup>
import { computed } from 'vue'

const props = defineProps({
  weather: { type: Object, default: null },
  meal: { type: Object, default: null },
  mealLoading: { type: Boolean, default: false },
  mealError: { type: String, default: '' },
})

const advice = computed(() => {
  if (!props.weather) return null

  const { temp, status } = props.weather

  if (/폭우/.test(status)) return {
    theme: 'rain', alert: '저지대와 하천 주변 접근을 피하고 외출을 미뤄 주세요.',
    foodEmoji: '🍲🥞', food: '칼국수와 해물파전', foodDetail: '따뜻한 국물과 든든한 메뉴로 습한 날의 기분을 달래 보세요.',
    outfitEmoji: '🧥☔🥾', outfit: '고프코어 레인 룩', outfitItems: ['방수 셸 재킷', '퀵드라이 팬츠', '레인 부츠'], outfitDetail: '젖어도 빨리 마르는 기능성 소재와 방수 신발 조합이에요.',
  }
  if (/폭염/.test(status) || temp >= 35) return {
    theme: 'heat', alert: '낮 시간 야외활동을 줄이고 물을 자주 마셔 주세요.',
    foodEmoji: '🍜🍉🧊', food: '냉면과 수박 화채', foodDetail: '수분이 풍부하고 시원한 메뉴로 열기를 식혀 보세요.',
    outfitEmoji: '👕🩳🧢', outfit: '미니멀 쿨링 룩', outfitItems: ['오버핏 반소매', '나일론 쇼츠', '메시 스니커즈'], outfitDetail: '밝은 색과 통기성 좋은 소재를 선택하고 모자를 챙기세요.',
  }
  if ((/한파/.test(status) || temp <= -10) && !/폭설|대설/.test(status)) return {
    theme: 'cold', alert: '노출 부위를 가리고 빙판길과 동파 사고에 주의해 주세요.',
    foodEmoji: '🍚🍲🔥', food: '국밥과 뜨끈한 전골', foodDetail: '체온을 오래 유지할 수 있는 따뜻하고 든든한 한 끼예요.',
    outfitEmoji: '🧥🧣🧤', outfit: '헤비 아우터 레이어드', outfitItems: ['롱 패딩', '기모 후디', '비니·장갑'], outfitDetail: '보온 이너부터 겹쳐 입고 목과 손을 빈틈없이 보호하세요.',
  }
  if (/폭설|대설/.test(status)) return {
    theme: 'snow', alert: '대중교통을 이용하고 차량 운행 시 스노 체인을 확인하세요.',
    foodEmoji: '🍠🍢☕', food: '군고구마와 어묵', foodDetail: '눈 오는 날에 잘 어울리는 따뜻한 간식과 음료를 추천해요.',
    outfitEmoji: '🥾🧥🧤', outfit: '윈터 아웃도어 룩', outfitItems: ['발수 패딩', '기모 카고팬츠', '논슬립 부츠'], outfitDetail: '발수 소재와 미끄럼 방지 밑창으로 눈길에 대비하세요.',
  }
  if (/비|소나기|뇌우/.test(status)) return {
    theme: 'rain', alert: '우산을 챙기고 미끄러운 길을 조심하세요.',
    foodEmoji: '🍲🥞', food: '따뜻한 국물과 파전', foodDetail: '습한 날에는 따뜻하고 든든한 메뉴가 잘 어울려요.',
    outfitEmoji: '🧥☔👟', outfit: '라이트 레인 룩', outfitItems: ['얇은 방수 재킷', '퀵드라이 팬츠', '발수 스니커즈'], outfitDetail: '젖어도 빨리 마르는 소재를 선택하세요.',
  }
  if (/눈/.test(status) || temp < 5) return {
    theme: 'cold', alert: '보온에 신경 쓰고 그늘진 빙판길을 조심하세요.',
    foodEmoji: '🍲🍚', food: '전골이나 국밥', foodDetail: '체온을 채워 줄 따뜻한 한 끼를 추천해요.',
    outfitEmoji: '🧥🧣🧤', outfit: '웜 레이어드 룩', outfitItems: ['패딩 또는 코트', '도톰한 니트', '목도리'], outfitDetail: '여러 겹으로 입어 체온을 지켜 주세요.',
  }
  if (temp >= 28) return {
    theme: 'heat', alert: '자외선 차단제와 물을 챙기면 좋아요.',
    foodEmoji: '🍜🥗', food: '냉면과 샐러드', foodDetail: '수분이 풍부하고 부담이 적은 메뉴가 좋아요.',
    outfitEmoji: '👕👖🧢', outfit: '서머 캐주얼 룩', outfitItems: ['반소매 티셔츠', '린넨 팬츠', '가벼운 모자'], outfitDetail: '통기성 좋은 소재와 밝은 색을 골라 보세요.',
  }
  return {
    theme: 'mild', alert: '일교차에 대비해 가벼운 겉옷을 준비하세요.',
    foodEmoji: '🍛🥗', food: '비빔밥이나 카레', foodDetail: '활동하기 좋은 날에는 산뜻하고 균형 잡힌 한 끼가 어울려요.',
    outfitEmoji: '👔👖👟', outfit: '데일리 캐주얼 룩', outfitItems: ['얇은 셔츠', '면바지', '가벼운 재킷'], outfitDetail: '기온 변화에 맞춰 벗기 쉬운 겉옷을 더하세요.',
  }
})
</script>

<template>
  <section v-if="weather && advice" class="recommendation-section" :class="`theme-${advice.theme}`" aria-labelledby="recommendation-title">
    <div v-if="weather.image" class="weather-example-visual">
      <img :src="weather.image" :alt="`${weather.name} 기상 상황 예시`" />
      <div class="visual-overlay"><strong>{{ weather.name }}</strong><span>{{ weather.status }} · {{ weather.temp }}℃</span></div>
    </div>

    <el-alert class="safety-alert" :title="advice.alert" type="warning" show-icon :closable="false" />

    <div class="recommendation-heading">
      <div>
        <el-text type="primary" size="small">DAILY CURATION</el-text>
        <h3 id="recommendation-title">{{ weather.name }} 맞춤 생활 추천</h3>
        <p>{{ Math.round(weather.temp) }}℃ · {{ weather.status }} 기준으로 추천했어요.</p>
      </div>
    </div>

    <div class="recommendation-grid">
      <el-card class="recommendation-card food-card" shadow="never">
        <el-skeleton v-if="mealLoading" :rows="3" animated />
        <template v-else-if="meal">
          <img class="meal-thumbnail" :src="meal.thumbnail" :alt="`${meal.name} 음식 이미지`" />
          <el-tag type="warning" effect="light" round>THEMEALDB 추천</el-tag>
          <h4>{{ meal.name }}</h4>
          <p>{{ meal.category }} · {{ meal.area }}</p>
          <el-link v-if="meal.source" :href="meal.source" target="_blank" type="primary">레시피 원문 보기 ↗</el-link>
        </template>
        <template v-else>
          <el-tag type="warning" effect="light" round>{{ mealError ? '추천 API 대체 메뉴' : '오늘의 음식' }}</el-tag>
          <h4>{{ advice.food }}</h4><p>{{ mealError || advice.foodDetail }}</p>
        </template>
      </el-card>
      <el-card class="recommendation-card outfit-card" shadow="never">
        <div class="outfit-emoji" aria-hidden="true">{{ advice.outfitEmoji }}</div>
        <el-tag type="primary" effect="light" round>스타일 코디</el-tag>
        <h4>{{ advice.outfit }}</h4>
        <div class="outfit-items"><el-tag v-for="item in advice.outfitItems" :key="item" size="small" effect="plain" round>{{ item }}</el-tag></div>
        <p>{{ advice.outfitDetail }}</p>
      </el-card>
    </div>
    <el-text class="recommendation-note" type="info" size="small">실제 음식 정보는 TheMealDB API에서 제공하며, 코디는 날씨별 스타일 참고용 아이템 조합입니다.</el-text>
  </section>
</template>
