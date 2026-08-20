# SKALA Vue 종합실습



뉴스는 GitHub Actions가 GNews API에서 6시간마다 받아 정적 JSON으로 제공하므로 localhost뿐 아니라 GitHub Pages에서도 표시됩니다.

Vue 3와 Vite를 사용한 날씨 대시보드 종합실습 프로젝트입니다. 수업 중 작성하는 개념 예제는 `practice`, 과제로 제출하는 종합실습은 `exercise`로 분리했습니다.

## 실행 방법

```sh
npm install
npm run dev
```

프로덕션 빌드는 다음 명령으로 확인할 수 있습니다.

```sh
npm run build
```

## 프로젝트 구조

```text
src/
├── App.vue
├── PracticeApp.vue
├── ExerciseApp.vue
├── assets/
│   ├── practice.css
│   └── exercise.css
├── components/
    ├── practices/
    │   ├── basic/
    │   ├── composition/
    │   ├── component/
    │   └── library/
    └── exercise/
        ├── WeatherMockup.vue
        ├── WeatherComposition.vue
        ├── WeatherParent.vue
        ├── BaseDashboardCard.vue
        ├── SearchBar.vue
        └── WeatherCard.vue
├── router/
│   └── index.js
└── views/
    ├── WeatherHomeView.vue
    ├── WeatherDetailView.vue
    ├── WeatherAboutView.vue
    └── NotFoundView.vue
```

`App.vue`의 `MODE` 값으로 두 화면을 전환할 수 있습니다.

```js
const MODE = 'exercise'
```

- `practice`: 수업 중 작성한 Vue 개념별 예제
- `exercise`: Day 1부터 이어지는 날씨 대시보드 과제

## Day 1 - 날씨 대시보드 Mockup

### 학습 및 구현 내용

- `ref`를 사용해 날씨 목록, 검색어, 선택 상태를 반응형 데이터로 관리
- `v-for`와 `:key`로 서울, 수원, 부산 날씨 카드 출력
- `v-if`, `v-else`로 25도 이상과 미만의 온도 배지 구분
- `:value`와 `@input`으로 검색어 입력 상태 동기화
- 카드 클릭 시 하단 상태 표시줄 변경
- `@click.stop`으로 상세보기 버튼의 이벤트 버블링 방지

### 개인별 Customization

- 날씨 상태를 빠르게 구분할 수 있도록 제목과 검색·목록 영역에 날씨 및 도시 이모지를 적용했습니다.
- 온도 상태를 `🔥 더움`과 `❄️ 선선함` 배지로 구분하고, 기준 온도를 문구에 표시했습니다.
- 카드 선택 결과를 화면 하단 상태바에 한국어 문장으로 표시했습니다.
- 상세보기 클릭 시 도시명과 날씨 상태가 포함된 한국어 알림창을 표시하도록 구성했습니다.

## Day 2-1 - Composition API와 실시간 검색

### 학습 및 구현 내용

- Day 1의 Mockup을 보존하고 `WeatherComposition.vue`를 별도로 작성
- `computed`를 사용해 검색어가 포함된 도시만 실시간으로 필터링
- 검색어 앞뒤의 공백을 `trim()`으로 제거
- `watch`로 선택 도시 상태의 변경을 감시
- `watchEffect`로 검색어 의존성을 자동 추적
- 검색 결과가 없을 때 조건부 안내 문구 출력

### 개인별 Customization

- 원본 과제와 개선 과제를 한 화면에서 비교할 수 있도록 과제 1과 과제 2를 독립된 블록으로 배치했습니다.
- 검색 결과가 없을 때 `😭 검색 결과와 일치하는 도시가 없습니다.`라는 눈에 띄는 안내 문구를 추가했습니다.
- `watch`와 `watchEffect` 로그에 서로 다른 아이콘과 한국어 설명을 넣어 어떤 반응성 기능이 실행됐는지 쉽게 구분할 수 있게 했습니다.
- 빈 검색어나 공백만 입력한 경우 원본 도시 3개가 그대로 유지되도록 처리했습니다.

## Day 2-2 - 컴포넌트 분리와 통신

### 학습 및 구현 내용

- Day 2-1의 기능을 유지하면서 화면을 부모와 자식 컴포넌트로 분리
- `WeatherParent.vue`에서 날씨 데이터와 검색·선택 로직 관리
- `SearchBar.vue`에서 `props`로 검색어를 받고 `update-query` 이벤트 전달
- `WeatherCard.vue`에서 도시 객체를 `props`로 받고 `select-card`, `click-detail` 이벤트 전달
- `BaseDashboardCard.vue`에서 `slot`을 사용해 공통 박스 레이아웃 재사용
- 각 컴포넌트에 `<style scoped>`를 적용해 스타일 범위 격리

### 개인별 Customization

- Mockup, Composition API, 컴포넌트 분리 결과를 각각 과제 1·2·3 블록으로 구성해 단계별 변화를 한 화면에서 비교할 수 있게 했습니다.
- 검색 박스와 목록 박스의 공통 디자인을 `BaseDashboardCard`로 만들어 중복 마크업을 줄였습니다.
- 날씨 카드의 클릭과 상세보기 클릭을 서로 다른 커스텀 이벤트로 분리해 사용자 동작별 책임을 명확하게 했습니다.
- 컴포넌트 분리 후에도 기존 검색, 결과 없음 안내, 상태바, 상세보기 알림과 반응성 로그가 동일하게 동작하도록 유지했습니다.

## 동작 확인

`exercise` 모드에서 다음 항목을 확인할 수 있습니다.

1. 과제 1, 과제 2, 과제 3 블록이 모두 표시되는지 확인
2. 과제 2와 과제 3 검색창에 `부` 입력 시 부산 카드만 표시되는지 확인
3. `제주` 입력 시 검색 결과 없음 안내가 표시되는지 확인
4. 검색창을 비우면 도시 카드 3개가 다시 표시되는지 확인
5. 카드의 빈 곳을 클릭하면 상태바가 변경되는지 확인
6. 상세보기 버튼을 클릭하면 카드 선택 없이 알림창만 표시되는지 확인
7. 개발자 도구 Console에서 `watch`, `watchEffect` 로그 확인

## Day 3-1 - Vue Router 화면 전환

### 학습 및 구현 내용

- `createRouter`와 `createWebHistory`를 사용해 클라이언트 사이드 라우터 구성
- `/`, `/about`, `/weather/:cityId`와 Catch-all Route 정의
- About, Detail, NotFound 화면에 지연 로딩 적용
- `RouterLink`와 `RouterView`로 새로고침 없는 화면 전환 구현
- `useRouter`로 상세 화면과 홈 화면 이동
- `useRoute`로 상세 화면의 도시 ID와 검색 쿼리 읽기
- 검색어를 `?search=` 쿼리에 저장하고 새로고침 시 복원

### 개인별 Customization

- 기존 과제 1~3을 보존하고 과제 4 라우터 영역을 별도 블록으로 추가해 단계별 결과를 비교할 수 있게 했습니다.
- 상세 화면에 전체 지역명, 기온, 날씨, 습도와 풍속을 한 카드에 표시했습니다.
- 존재하지 않는 도시 ID에는 별도의 데이터 없음 안내를 표시했습니다.
- 존재하지 않는 주소에는 날씨 아이콘을 사용한 전용 404 화면과 홈 이동 버튼을 제공했습니다.
- 라우터 화면에서도 검색 결과 없음 안내를 유지하고 해당 스타일을 화면 컴포넌트에 격리했습니다.

### 라우터 동작 확인

1. 과제 4 검색창에 `부` 입력 후 주소가 `/?search=부`로 변경되는지 확인
2. 검색 상태에서 새로고침해도 `부` 검색 결과가 복원되는지 확인
3. 부산 카드의 상세보기를 눌러 `/weather/city_03`으로 이동하는지 확인
4. 상세 화면에서 부산의 상세 기상 정보가 표시되는지 확인
5. 돌아가기 버튼으로 메인 대시보드에 복귀하는지 확인
6. 서비스 소개 링크를 눌러 `/about` 화면으로 이동하는지 확인
7. 존재하지 않는 주소에서 404 화면이 표시되는지 확인
8. `/weather/city_99`에서 데이터 없음 안내가 표시되는지 확인

## Day 3-2 - Pinia 전역 상태 관리

### 학습 및 구현 내용

- `defineStore`로 온도 단위를 관리하는 `configStore` 구성
- state 역할의 `unit`, getter 역할의 `unitSymbol`, action 역할의 `toggleUnit` 구현
- `UnitToggler`에서 단위를 변경하고 목록과 상세 화면이 같은 상태를 공유
- 원본 섭씨 값은 유지하면서 화면 표시 값만 화씨 공식으로 변환

### 개인별 Customization

- 기본 버튼 대신 Element Plus `el-switch`를 사용해 현재 단위를 직관적으로 표현했습니다.
- 전역 단위가 실제 API 날씨와 가상 극한 날씨 지역 모두에 동일하게 적용되도록 확장했습니다.

## Day 3-3 - Axios 실시간 날씨 연동

### 사전 준비

OpenWeatherMap에서 발급받은 API 키를 프로젝트 루트의 `.env.local`에 설정합니다.

```sh
VITE_OPENWEATHER_API_KEY=발급받은_32자리_API_키
```

`.env.local`은 Git에 포함되지 않습니다. 값을 설정하거나 변경한 뒤에는 개발 서버를 다시 실행해야 합니다.

### 학습 및 구현 내용

- Axios를 설치하고 `axios.get()`으로 OpenWeatherMap API 호출
- `Promise.all`로 서울, 수원, 부산 날씨를 병렬 요청
- API 응답을 기존 `WeatherCard`의 데이터 규격으로 변환
- 상세 주소의 도시 ID를 API용 영문 도시명으로 매핑해 단건 요청
- `async`/`await`와 `try`/`catch`/`finally`로 비동기 흐름과 오류 처리
- 목록과 상세 화면에 로딩, 성공, 오류 상태를 구분해 표시
- Pinia의 섭씨/화씨 단위 전환을 실제 API 온도에도 적용

### 개인별 Customization

- API 키를 Vue 소스에 직접 작성하지 않고 `VITE_OPENWEATHER_API_KEY` 환경변수로 분리했습니다.
- API 키 누락, 네트워크 실패, 존재하지 않는 도시 ID를 서로 구분해 사용자 안내를 표시했습니다.
- Axios의 `params` 옵션으로 도시명, API 키, 단위와 언어 요청값을 구조화했습니다.
- 제공 소스의 과제 3-2 전제 기능이 누락되어 있던 부분을 보완해 `configStore`와 단위변경 UI가 목록·상세 화면에서 함께 동작하도록 연결했습니다.
- OpenWeather Air Pollution API를 추가해 상세 화면에서 AQI, PM2.5, PM10과 오존 수치를 제공합니다.
- TheMealDB API를 추가해 날씨별 카테고리에서 실제 음식 이미지와 레시피를 추천합니다.
- 추가 API 호출은 서로 독립적으로 처리해 일부 통신이 실패해도 날씨 화면과 내부 추천이 유지되도록 구성했습니다.

### Axios 동작 확인

1. API 키 설정 후 화면을 열면 로딩 문구가 표시되는지 확인
2. 로딩이 끝나면 서울, 수원, 부산의 실시간 날씨 카드가 표시되는지 확인
3. 카드의 날씨 설명이 API의 한국어 응답으로 표시되는지 확인
4. 상세보기 클릭 시 선택한 도시의 실시간 상세 정보가 표시되는지 확인
5. 단위변경 버튼 클릭 시 목록과 상세 기온이 섭씨와 화씨로 전환되는지 확인
6. API 키를 제거하고 재실행했을 때 키 설정 안내가 표시되는지 확인

## 주요 실습 파일

- `src/components/exercise/WeatherMockup.vue`: Day 1 과제
- `src/components/exercise/WeatherComposition.vue`: Day 2-1 과제
- `src/components/exercise/WeatherParent.vue`: Day 2-2 부모 컴포넌트
- `src/components/exercise/SearchBar.vue`: 검색 입력 컴포넌트
- `src/components/exercise/WeatherCard.vue`: 도시별 날씨 카드 컴포넌트
- `src/components/exercise/BaseDashboardCard.vue`: 공통 슬롯 컨테이너
- `src/router/index.js`: Day 3-1 주소 규칙
- `src/views/WeatherHomeView.vue`: 라우터 기반 날씨 대시보드
- `src/views/WeatherDetailView.vue`: 도시별 상세 화면
- `src/views/WeatherAboutView.vue`: 서비스 소개 화면
- `src/views/NotFoundView.vue`: 404 화면
- `src/stores/configStore.js`: 전역 온도 단위 상태
- `src/components/exercise/UnitToggler.vue`: 섭씨/화씨 전환 UI
- `src/components/exercise/AirQualityCard.vue`: OpenWeather 대기질 정보
- `src/components/exercise/WeatherRecommendations.vue`: TheMealDB 음식과 날씨별 코디 추천
- `.env.example`: OpenWeatherMap API 키 설정 예시

## UI Library - Element Plus

교재 214~231페이지의 UI Library 단원을 바탕으로 Element Plus를 날씨 대시보드에 적용했습니다.

### 적용 컴포넌트

- `el-container`, `el-header`, `el-main`: 전체 앱 레이아웃
- `el-card`: 실시간 대시보드, 날씨 카드와 이전 실습 영역
- `el-input`: 지우기 기능이 포함된 도시 검색창
- `el-tag`: LIVE 상태, 날씨 상태와 API 정보 표시
- `el-switch`: 섭씨/화씨 단위 전환
- `el-button`: 상세보기와 화면 이동 버튼
- `el-skeleton`: API 데이터를 기다리는 동안 로딩 상태 표시
- `el-alert`: API 오류와 선택 상태 안내
- `el-empty`: 검색 결과 없음 안내
- `el-page-header`, `el-descriptions`, `el-result`: 상세 날씨와 오류 화면
- `el-collapse`: 과제 1~3 학습 이력을 접어서 확인

### 개인별 Customization

- 실시간 Axios 대시보드를 첫 화면의 핵심 영역으로 배치하고 이전 실습은 접이식 학습 이력으로 정리했습니다.
- 파란색과 하늘색을 중심으로 날씨 서비스에 맞는 반응형 디자인을 구성했습니다.
- 모바일 화면에서는 내비게이션과 단위 선택기가 자연스럽게 줄바꿈되도록 최적화했습니다.
- API 로딩, 오류, 빈 결과를 서로 다른 Element Plus 피드백 컴포넌트로 구분했습니다.
- 최종 Axios 화면의 과제 표기를 제거하고 실제 날씨 생활 서비스처럼 제목과 안내 문구를 구성했습니다.
- 선택한 도시의 기온과 비·눈 등 기상 상태에 따라 음식과 옷차림을 자동 추천하는 생활 큐레이션 카드를 추가했습니다.
- 과제 1~3은 기존처럼 접이식 학습 이력으로 보존해 최종 서비스와 학습 과정을 모두 확인할 수 있습니다.
- 폭우·폭염·한파·폭설 체험 버튼을 추가해 실제 기상 상황이 아니어도 추천과 안전 안내를 확인할 수 있습니다.
- 음식은 이모지 비주얼로, 코디는 날씨별 스타일명과 핵심 아이템 조합으로 표현했습니다.
- 위험기상 버튼을 별도로 두는 대신 시베리아·아마존·알래스카·사하라 사막을 가상 시뮬레이션 지역으로 지역별 날씨 목록에 통합했습니다.
- 가상 지역은 임의 기온과 한파·폭우·폭설·폭염 상태를 사용하며 실제 관측 지역과 구분되는 배지를 표시합니다.
- 생활 추천은 목록 밖에 노출하지 않고 각 지역의 상세보기 화면 안에 배치해 지역별 날씨 정보, 짤, 음식과 코디를 한 흐름으로 확인하도록 개선했습니다.
- SVG `feGaussianBlur`와 `feColorMatrix`를 조합한 구이 필터로 헤더에 서로 들러붙는 젤리 방울 효과를 구현했습니다.
- 텍스트는 필터 밖의 `clip-path`·격리 레이어에 배치하고, 카드에는 반투명 배경·backdrop blur·내부 하이라이트를 적용해 글자 선명도를 유지한 리퀴드 글라스 UI를 구성했습니다.
- OpenWeather의 어색한 한국어 표현인 `튼구름`, `온흐림`을 화면에서 각각 `구름 많음`, `흐림`으로 자연스럽게 표시하도록 정규화했습니다.
- 상단의 장식용 이모지와 젤리 원형 효과, 상세 추천 영역의 이모지를 제거해 콘텐츠 중심의 화면으로 정리했습니다.
- GNews API의 한국어 최신 헤드라인을 지역 상세 화면에 연결하고 기사 제목, 언론사, 발행 시각과 원문 링크를 간결하게 표시했습니다.
- 코디 추천 카드에는 날씨별 옷차림 이모지를 다시 배치하고, 목록의 `가상 지역` 문구는 제거해 카드 표현을 간결하게 다듬었습니다.
- 메인 배너 아래에 한국 최신 뉴스 한 줄 티커를 추가하고, 5초마다 다음 기사가 위로 굴러가듯 전환되도록 구성했습니다.

### GNews 배포 환경 문제와 해결

- 문제: GNews 무료 플랜은 브라우저 CORS 요청을 `localhost`에서만 허용하므로, 로컬에서는 뉴스가 표시되지만 같은 공유기의 IP 주소와 GitHub Pages 외부 주소에서는 직접 API 호출이 차단됐습니다.
- 해결: Vue 브라우저 코드가 GNews를 직접 호출하지 않도록 변경했습니다. GitHub Actions 서버가 저장소 Secret의 API 키로 한국 뉴스 10개를 받아 `public/data/news.json` 형식의 정적 캐시를 생성하고, Vue는 배포된 JSON 파일만 읽습니다.
- 갱신: GitHub Actions는 `main` 푸시, 수동 실행, 6시간 주기로 뉴스 캐시를 갱신하고 GitHub Pages를 다시 배포합니다.
- 안정성: GNews 호출이 일시적으로 실패하거나 일일 사용량을 초과하면 마지막으로 정상 생성된 JSON 캐시를 유지합니다.
- 보안: GNews API 주소와 키를 브라우저 번들에서 제거했으며, 실제 키는 GitHub Secrets와 로컬 `.env.local`에서만 관리합니다.
