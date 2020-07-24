# API Auth for SPAs with Auth0 on Cloudflare Workers

This example illustrates API authentication for
APIs that are hosted on Cloudflare workers.

## Prerequisites

- Cloudflare Account
- Auth0 Account
- Auth0 SPA application configured for your workers.dev subdomain
  - `https://spa-api-auth.<YOUR_WORKERS_SUBDOMAIN>.workers.dev/index.html`

## Setup & Deploy

Please add your Cloudflare and Auth0 account details
to the `credentials.json` before deployment.

    $ npm i
    $ npm start

## View

The example can be viewed on your workers.dev subdomain.

    https://spa-api-auth.<YOUR_WORKERS_SUBDOMAIN>.workers.dev/index.html
