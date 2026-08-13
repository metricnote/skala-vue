<script setup>
import WeatherMockup from './components/exercise/WeatherMockup.vue'
import WeatherComposition from './components/exercise/WeatherComposition.vue'
import WeatherParent from './components/exercise/WeatherParent.vue'
import UnitToggler from './components/exercise/UnitToggler.vue'
import MainNewsTicker from './components/exercise/MainNewsTicker.vue'
</script>

<template>
  <el-container class="weather-app-shell">
    <el-header class="hero-header">
      <div class="hero-copy">
        <el-tag effect="dark" round>SKALA Vue Weather</el-tag>
        <h1>오늘의 날씨를 한눈에</h1>
        <p>날씨를 확인하고 오늘의 식사와 옷차림까지 한 번에 준비하세요.</p>
      </div>
    </el-header>
    <MainNewsTicker />

    <el-main class="weather-main">
      <el-card class="app-container featured-card" shadow="always">
        <template #header>
          <div class="section-heading">
            <div>
              <el-text type="primary" size="small">TODAY'S WEATHER</el-text>
              <h2>오늘을 준비하는 날씨 생활 서비스</h2>
            </div>
            <el-tag type="success" effect="light" round>OpenWeatherMap</el-tag>
          </div>
        </template>

        <div class="dashboard-wrapper">
          <nav class="navigation-bar">
            <RouterLink to="/" class="nav-item">🌦️ 오늘의 날씨</RouterLink>
            <RouterLink to="/about" class="nav-item">ℹ️ 서비스 소개</RouterLink>
            <UnitToggler />
          </nav>
          <main><RouterView /></main>
        </div>
      </el-card>

      <el-collapse class="learning-history">
        <el-collapse-item name="history">
          <template #title>
            <div class="history-title">
              <span>📚 이전 실습 과정 보기</span>
              <el-tag type="info" size="small" round>과제 1~3</el-tag>
            </div>
          </template>

          <div class="history-grid">
            <el-card class="app-container" shadow="hover">
              <template #header><strong>과제 1 · 날씨 Mockup</strong></template>
              <WeatherMockup />
            </el-card>
            <el-card class="app-container" shadow="hover">
              <template #header><strong>과제 2 · Composition API</strong></template>
              <WeatherComposition />
            </el-card>
            <el-card class="app-container" shadow="hover">
              <template #header><strong>과제 3 · 컴포넌트 분리</strong></template>
              <WeatherParent />
            </el-card>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-main>
  </el-container>
</template>
