<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push({ name: 'WeatherHome' })
}
</script>

<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <div class="error-icon">☀️❓</div>
      <h2>페이지를 찾을 수 없습니다.</h2>
      <p>요청하신 주소가 존재하지 않거나,<br />아직 개발되지 않았습니다.</p>
      <button class="home-button" @click="goHome">날씨 메인으로 이동</button>
    </div>
  </div>
</template>

<style scoped>
.not-found-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  font-family: 'Noto Sans KR', sans-serif;
  background-color: #f8f9fa;
}

.not-found-content {
  padding: 50px;
  text-align: center;
  background-color: #fff;
  border: 1px solid #e9ecef;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.error-icon {
  margin-bottom: 20px;
  font-size: 5rem;
}

h2 {
  margin-bottom: 15px;
  font-size: 2rem;
  font-weight: 700;
  color: #343a40;
  letter-spacing: -0.5px;
}

p {
  margin-bottom: 35px;
  font-size: 1.1rem;
  line-height: 1.6;
  color: #6c757d;
}

.home-button {
  padding: 12px 30px;
  font-size: 1.1rem;
  font-weight: 500;
  color: white;
  cursor: pointer;
  background-color: #007bff;
  border: none;
  border-radius: 30px;
  transition: background-color 0.2s ease, transform 0.1s ease;
}

.home-button:hover {
  background-color: #0056b3;
}

.home-button:active {
  transform: scale(0.98);
}
</style>
