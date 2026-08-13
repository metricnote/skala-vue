import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import process from 'node:process'

const outputPath = resolve('public/data/news.json')
const apiKey = process.env.GNEWS_API_KEY || process.env.VITE_GNEWS_API_KEY

const keepExistingCache = async (message) => {
  try {
    await readFile(outputPath, 'utf8')
    console.warn(`${message} 기존 뉴스 캐시를 유지합니다.`)
  } catch {
    throw new Error(`${message} 사용할 기존 뉴스 캐시도 없습니다.`)
  }
}

if (!apiKey) {
  await keepExistingCache('GNews API 키가 없습니다.')
} else {
  try {
    const url = new URL('https://gnews.io/api/v4/top-headlines')
    url.search = new URLSearchParams({
      category: 'general',
      country: 'kr',
      lang: 'ko',
      max: '10',
      apikey: apiKey,
    })

    const response = await fetch(url)
    const payload = await response.json()
    if (!response.ok) throw new Error(payload.errors?.join(' ') || `HTTP ${response.status}`)

    const articles = (payload.articles || []).map((article) => ({
      title: article.title,
      url: article.url,
      source: { name: article.source?.name || '언론사' },
      publishedAt: article.publishedAt,
    }))
    if (!articles.length) throw new Error('받은 기사가 없습니다.')

    await mkdir(dirname(outputPath), { recursive: true })
    await writeFile(outputPath, `${JSON.stringify({ updatedAt: new Date().toISOString(), articles }, null, 2)}\n`)
    console.log(`한국 뉴스 ${articles.length}개를 갱신했습니다.`)
  } catch (error) {
    await keepExistingCache(`GNews 갱신 실패: ${error.message}`)
  }
}
