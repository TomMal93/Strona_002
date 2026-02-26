import { gzipSync } from 'node:zlib'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const CHUNKS_DIR = '.next/static/chunks'
const MAX_ROWS = 15

function walk(dir) {
  const entries = readdirSync(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...walk(fullPath))
      continue
    }

    if (entry.isFile() && entry.name.endsWith('.js')) {
      files.push(fullPath)
    }
  }

  return files
}

function formatKb(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`
}

function run() {
  try {
    statSync(CHUNKS_DIR)
  } catch {
    console.error(`Missing "${CHUNKS_DIR}". Run "npm run build" first.`)
    process.exit(1)
  }

  const rows = walk(CHUNKS_DIR).map((filePath) => {
    const contents = readFileSync(filePath)
    return {
      file: filePath.replace('.next/', ''),
      size: contents.length,
      gzip: gzipSync(contents).length,
    }
  })

  rows.sort((a, b) => b.gzip - a.gzip)
  const top = rows.slice(0, MAX_ROWS)

  const totalSize = rows.reduce((sum, row) => sum + row.size, 0)
  const totalGzip = rows.reduce((sum, row) => sum + row.gzip, 0)

  console.log('\nTop JS chunks by gzip size:\n')
  console.table(
    top.map((row) => ({
      file: row.file,
      size: formatKb(row.size),
      gzip: formatKb(row.gzip),
    })),
  )
  console.log(`Total JS (raw):  ${formatKb(totalSize)}`)
  console.log(`Total JS (gzip): ${formatKb(totalGzip)}`)
}

run()
