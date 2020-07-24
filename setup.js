const fs = require("fs");
const { auth0, cloudflare } = require("./credentials.json");

const indexHtml = fs.readFileSync("index.html", "utf8");
const indexJs = fs
  .readFileSync("tmp.index.js", "utf8")
  .replace("%INDEX_HTML%", indexHtml)
  .replace("%AUTH0_CLIENT_ID%", auth0.clientId)
  .split("%AUTH0_DOMAIN%")
  .join(auth0.domain);
fs.writeFileSync("index.js", indexJs);

const wranglerToml = fs
  .readFileSync("tmp.wrangler.toml", "utf8")
  .replace("%CF_ACCOUNT_ID%", cloudflare.accountId);
fs.writeFileSync("wrangler.toml", wranglerToml);

const setkeyenvSh = fs
  .readFileSync("tmp.setkeyenv.sh", "utf8")
  .replace("%CF_API_KEY%", cloudflare.apiKey)
  .replace("%CF_EMAIL%", cloudflare.email);
fs.writeFileSync("setkeyenv.sh", setkeyenvSh);
