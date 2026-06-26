import fs from 'fs'
import path from 'path'
import { performanceMetrics } from '../src/data/performanceMetrics.js'

const PUBLIC_DIR = path.resolve('public')
const OUTPUT_FILE = path.resolve('src/data/performanceMetrics.json')

function formatBytes(bytes) {
  if (bytes === 0) return '0.0 KB'
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function parseSizeToBytes(sizeStr) {
  if (!sizeStr) return 0
  const match = sizeStr.trim().match(/^~?([0-9.]+)\s*(KB|MB|B)?/i)
  if (!match) return 0
  const val = parseFloat(match[1])
  const unit = (match[2] || '').toUpperCase()
  if (unit === 'MB') return val * 1024 * 1024
  if (unit === 'KB') return val * 1024
  return val
}

console.log('⚡ Running compile-time performance metrics resolver...')

const resolvedMetrics = {}

for (const [route, config] of Object.entries(performanceMetrics)) {
  let totalBytes = 0
  const resolvedBreakdown = []

  if (config.assets) {
    for (const asset of config.assets) {
      let resolvedSize = asset.size

      if (asset.path) {
        const filePath = path.join(PUBLIC_DIR, asset.path)
        if (fs.existsSync(filePath)) {
          const stats = fs.statSync(filePath)
          resolvedSize = formatBytes(stats.size)
        } else if (asset.fallbackSize) {
          resolvedSize = asset.fallbackSize
          console.log(`  ⚠️ Asset "${asset.path}" not found. Using fallback: ${asset.fallbackSize}`)
        } else {
          resolvedSize = '0.0 KB'
          console.log(`  ❌ Asset "${asset.path}" not found on disk.`)
        }
      }

      totalBytes += parseSizeToBytes(resolvedSize)
      resolvedBreakdown.push({
        name: asset.name,
        size: resolvedSize,
        type: asset.type || 'file'
      })
    }
  }

  // Calculate dynamic comparison percentage compared to the 2.4 MB web average
  const WEB_AVERAGE_BYTES = 2.4 * 1024 * 1024
  let refCompareVal = 0
  let refCompareText = ''

  if (totalBytes < WEB_AVERAGE_BYTES) {
    refCompareVal = ((WEB_AVERAGE_BYTES - totalBytes) / WEB_AVERAGE_BYTES) * 100
    refCompareText = `${refCompareVal.toFixed(1)}% lighter than the average web page (2.4 MB)!`
  } else {
    refCompareText = `Higher payload due to ultra-high fidelity assets.`
  }

  resolvedMetrics[route] = {
    chapter: config.chapter,
    title: config.title,
    rating: config.rating,
    totalSize: formatBytes(totalBytes),
    accentColor: config.accentColor,
    accentColorRgb: config.accentColorRgb,
    refCompare: refCompareText,
    refCompareVal: refCompareVal,
    description: config.description,
    breakdown: resolvedBreakdown,
    techs: config.techs
  }

  console.log(`  ✓ Route: ${route} | Total Resolved: ${resolvedMetrics[route].totalSize} | Rating: ${resolvedMetrics[route].rating}`)
}

// Write the output file
const dir = path.dirname(OUTPUT_FILE)
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true })
}

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(resolvedMetrics, null, 2), 'utf-8')
console.log(`⚡ Metrics successfully written to: ${OUTPUT_FILE}\n`)
