export async function onRequest({ request, env }) {
  // 预检请求处理
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  // 正常 POST 请求逻辑
  const url = new URL(request.url);
  url.hostname = 'generativelanguage.googleapis.com';
  url.pathname = url.pathname.replace(/^\/api/, '');
  url.searchParams.set('key', env.GEMINI_KEY);

  const proxyReq = new Request(url, {
    method: request.method,
    headers: { 'Content-Type': 'application/json' },
    body: request.body,
  });

  const resp = await fetch(proxyReq);
  const out = new Response(resp.body, resp);
  out.headers.set('Access-Control-Allow-Origin', '*');
  out.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return out;
}
