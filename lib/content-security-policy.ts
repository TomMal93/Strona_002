type ContentSecurityPolicyOptions = {
  isDevelopment: boolean
  nonce: string
}

export function createContentSecurityPolicy({
  isDevelopment,
  nonce,
}: ContentSecurityPolicyOptions) {
  return `
    default-src 'self';
    base-uri 'self';
    frame-src https://www.youtube-nocookie.com;
    frame-ancestors 'none';
    form-action 'self';
    object-src 'none';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDevelopment ? " 'unsafe-eval'" : ''};
    style-src 'self' 'nonce-${nonce}';
    style-src-attr 'unsafe-inline';
    img-src 'self' data: blob: https://img.youtube.com;
    font-src 'self' data:;
    connect-src 'self' https://vitals.vercel-insights.com${isDevelopment ? ' ws: wss:' : ''};
    media-src 'self' data: blob:;
    manifest-src 'self';
    worker-src 'self' blob:;
    ${isDevelopment ? '' : 'upgrade-insecure-requests;'}
  `
    .replace(/\s{2,}/g, ' ')
    .trim()
}
