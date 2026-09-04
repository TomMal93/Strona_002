import test from 'node:test'
import assert from 'node:assert/strict'
import { createContentSecurityPolicy } from '../lib/content-security-policy.ts'

test('production CSP uses a nonce and restricts scripts and connections', () => {
  const policy = createContentSecurityPolicy({
    isDevelopment: false,
    nonce: 'test-nonce',
  })
  const scriptDirective = policy.match(/script-src [^;]+;/)?.[0]
  const connectDirective = policy.match(/connect-src [^;]+;/)?.[0]

  assert.equal(
    scriptDirective,
    "script-src 'self' 'nonce-test-nonce' 'strict-dynamic';",
  )
  assert.equal(
    connectDirective,
    "connect-src 'self' https://vitals.vercel-insights.com;",
  )
  assert.doesNotMatch(scriptDirective ?? '', /'unsafe-inline'/)
  assert.doesNotMatch(connectDirective ?? '', /\shttps:\s|\shttps:;/)
  assert.match(policy, /style-src 'self' 'nonce-test-nonce';/)
  assert.match(policy, /style-src-attr 'unsafe-inline';/)
  assert.match(policy, /upgrade-insecure-requests;/)
})

test('development CSP permits eval and local websocket connections', () => {
  const policy = createContentSecurityPolicy({
    isDevelopment: true,
    nonce: 'dev-nonce',
  })

  assert.match(policy, /script-src [^;]*'unsafe-eval';/)
  assert.match(policy, /connect-src [^;]* ws: wss:;/)
  assert.doesNotMatch(policy, /upgrade-insecure-requests;/)
})
