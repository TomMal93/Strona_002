import { gzipSync } from 'node:zlib'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const NEXT_DIR = '.next'
const CHUNKS_DIR = join(NEXT_DIR, 'static/chunks')
const BUILD_MANIFEST = join(NEXT_DIR, 'build-manifest.json')
const MAX_ROWS = 15

const budgets = {
  totalOutputGzipKb: 425,
  maxChunkGzipKb: 75,
  commonInitialGzipKb: 240,
  routes: {
    '/': { manifest: 'page_client-reference-manifest.js', gzipKb: 245 },
    '/contact': { manifest: 'contact/page_client-reference-manifest.js', gzipKb: 245 },
    '/o-mnie': { manifest: 'o-mnie/page_client-reference-manifest.js', gzipKb: 245 },
    '/oferta': { manifest: 'oferta/page_client-reference-manifest.js', gzipKb: 245 },
    '/polityka-prywatnosci': {
      manifest: 'polityka-prywatnosci/page_client-reference-manifest.js',
      gzipKb: 240,
    },
  },
}

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) return walk(fullPath)
    return entry.isFile() && entry.name.endsWith('.js') ? [fullPath] : []
  })
}

function gzipBytes(filePath) {
  return gzipSync(readFileSync(filePath)).length
}

function kb(bytes) {
  return bytes / 1024
}

function formatKb(bytes) {
  return `${kb(bytes).toFixed(1)} KB`
}

function readRouteChunks(manifestPath) {
  const source = readFileSync(manifestPath, 'utf8')
  const chunks = [...source.matchAll(/"chunks":\[(.*?)\]/g)].flatMap((match) => (
    [...match[1].matchAll(/"([^"]+\.js)"/g)].map((chunk) => (
      chunk[1].replace(/^\/_next\//, '')
    ))
  ))
  return new Set(chunks)
}

function sumChunks(chunks) {
  return [...chunks].reduce((sum, chunk) => {
    const filePath = join(NEXT_DIR, chunk)
    if (!existsSync(filePath)) {
      throw new Error(`Chunk referenced by a manifest does not exist: ${filePath}`)
    }
    return sum + gzipBytes(filePath)
  }, 0)
}

function status(actualKb, limitKb) {
  return actualKb <= limitKb ? 'PASS' : 'FAIL'
}

function run() {
  if (!existsSync(CHUNKS_DIR) || !existsSync(BUILD_MANIFEST)) {
    console.error('Missing production build. Run "npm run build" first.')
    process.exit(1)
  }

  const rows = walk(CHUNKS_DIR).map((filePath) => ({
    file: filePath.replace(`${NEXT_DIR}/`, ''),
    size: readFileSync(filePath).length,
    gzip: gzipBytes(filePath),
  })).sort((a, b) => b.gzip - a.gzip)

  const totalGzip = rows.reduce((sum, row) => sum + row.gzip, 0)
  const largestChunkGzip = rows[0]?.gzip ?? 0
  const buildManifest = JSON.parse(readFileSync(BUILD_MANIFEST, 'utf8'))
  const frameworkChunks = new Set([
    ...(buildManifest.polyfillFiles ?? []),
    ...(buildManifest.rootMainFiles ?? []),
  ])

  const routeChunks = Object.entries(budgets.routes).map(([route, config]) => {
    const manifestPath = join(NEXT_DIR, 'server/app', config.manifest)
    if (!existsSync(manifestPath)) {
      throw new Error(`Missing client reference manifest for ${route}: ${manifestPath}`)
    }
    return {
      route,
      limitKb: config.gzipKb,
      chunks: new Set([...frameworkChunks, ...readRouteChunks(manifestPath)]),
    }
  })

  const commonChunks = new Set(
    [...routeChunks[0].chunks].filter((chunk) => (
      routeChunks.every((route) => route.chunks.has(chunk))
    )),
  )
  const commonGzip = sumChunks(commonChunks)

  console.log('\nTop JS chunks by gzip size:\n')
  console.table(rows.slice(0, MAX_ROWS).map((row) => ({
    file: row.file,
    size: formatKb(row.size),
    gzip: formatKb(row.gzip),
  })))

  const checks = [
    {
      scope: 'All emitted JS',
      actualKb: kb(totalGzip),
      limitKb: budgets.totalOutputGzipKb,
    },
    {
      scope: 'Largest chunk',
      actualKb: kb(largestChunkGzip),
      limitKb: budgets.maxChunkGzipKb,
    },
    {
      scope: 'Conservative common upper bound',
      actualKb: kb(commonGzip),
      limitKb: budgets.commonInitialGzipKb,
    },
    ...routeChunks.map((route) => ({
      scope: `Conservative route upper bound ${route.route}`,
      actualKb: kb(sumChunks(route.chunks)),
      limitKb: route.limitKb,
    })),
  ].map((check) => ({
    scope: check.scope,
    actual: `${check.actualKb.toFixed(1)} KB`,
    budget: `${check.limitKb.toFixed(1)} KB`,
    status: status(check.actualKb, check.limitKb),
  }))

  console.log('\nJavaScript budgets (gzip):\n')
  console.table(checks)

  if (checks.some((check) => check.status === 'FAIL')) {
    console.error('JavaScript bundle budget exceeded.')
    process.exit(1)
  }

  console.log('All JavaScript bundle budgets passed.')
}

try {
  run()
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
}
