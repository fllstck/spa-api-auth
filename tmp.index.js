addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  if (request.url.includes("/index.html"))
    return new Response(html, { headers: { "Content-Type": "text/html" } });

  if (request.url.includes("api/public"))
    return createJsonResponse({
      title: "Public Kitty",
      url: "http://placekitten.com/300/300",
    });

  let isAuthenticated = false;
  try {
    isAuthenticated = await authenticate(request);
  } catch (e) {
    // No token present or token invalid
    return new Response('{"error": "403 Forbidden" }', { status: 403 });
  }

  // Token present but not authorized
  if (!isAuthenticated)
    return new Response('{"error": "401 Unauthorized" }', { status: 401 });

  if (request.url.includes("api/private"))
    return createJsonResponse({
      title: "Private Kitty",
      url: "http://placekitten.com/500/500",
    });

  return new Response('{"error": "404 Not found" }', { status: 404 });
}

function createJsonResponse(o) {
  return new Response(JSON.stringify(o), {
    headers: { "Content-Type": "application/json" },
  });
}

async function authenticate(request) {
  const [rawHeader, rawPayload, rawSignature] = request.headers
    .get("Authorization")
    .substring(6)
    .trim()
    .split(".");

  // ID of the key that was used to sign the JWT
  const { kid } = JSON.parse(atob(rawHeader));
  const key = await getSigningKey(kid);

  let signature = atob(rawSignature.replace(/_/g, "/").replace(/-/g, "+"));
  signature = new Uint8Array(Array.from(signature).map((c) => c.charCodeAt(0)));

  const content = new TextEncoder().encode([rawHeader, rawPayload].join("."));

  return crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, signature, content);
}

async function getSigningKey(kid) {
  // TODO: needs rate limiting
  const request = await fetch("https://%AUTH0_DOMAIN%/.well-known/jwks.json");

  // key rotation can lead to multiple keys
  // get the one that was used for the JWT in our request
  const { keys } = await request.json();
  const jwk = keys.find((key) => key.kid === kid);

  return crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"]
  );
}

const html = `
%INDEX_HTML%
`;
