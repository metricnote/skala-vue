const naturalKoreanWeather = {
  '튼구름': '구름 많음',
  '온흐림': '흐림',
}

export const normalizeWeatherDescription = (description = '') => {
  const normalized = description.trim()
  return naturalKoreanWeather[normalized] || normalized
}
