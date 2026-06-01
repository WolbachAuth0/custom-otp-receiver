# phone-provider-front

A web app for displaying SMS messages.

## Environment variables

Configure these in a `.env` file at the project root (loaded by `dotenv` in `start.js` / `start-dev.js` when `NODE_ENV !== 'production'`). In production (e.g. Heroku), set them as config vars on the host.

### Runtime

| Variable | Required | Description |
| --- | --- | --- |
| `NODE_ENV` | yes | `development` or `production`. Controls whether `dotenv` loads a local `.env` and which port the server binds to. |
| `PORT` | no | Port the server listens on in production. Defaults to `8080`. In `development` mode the port is hardcoded to `4000`. |
| `NODE_TLS_REJECT_UNAUTHORIZED` | no | Set to `0` in local development only to disable TLS certificate validation. **Never set in production.** |

### Auth0 — token verification

Used by `middleware/auth.js` to validate access tokens issued to the SPA.

| Variable | Required | Description |
| --- | --- | --- |
| `AUTH0_DOMAIN` | yes | Auth0 tenant domain (e.g. `your-tenant.us.auth0.com`). Used to build the JWKS URI and the expected token issuer. |
| `AUDIENCE` | yes | The API identifier (audience) configured in Auth0. Tokens must be issued for this audience. |

### Auth0 — Management API client

Used by `models/Auth0.js` to instantiate the Auth0 Management API client.

| Variable | Required | Description |
| --- | --- | --- |
| `AUTH0_API_ID` | yes | Client ID of the M2M application authorized for the Auth0 Management API. |
| `AUTH0_API_CLIENT_SECRET` | yes | Client secret for the Management API M2M application. |

### Auth0 — `/oauth/token` exchange (scripts only)

Used by `scripts/get-token.js` to fetch an access token via client credentials. Only required if you run that script.

| Variable | Required | Description |
| --- | --- | --- |
| `M2M_CLIENT_ID` | script-only | Client ID used by `npm run send-message` / `scripts/get-token.js`. |
| `M2M_CLIENT_SECRET` | script-only | Matching client secret. |

### Redis

Used by `models/Cache.js`. Optimized for Redis Enterprise Cloud / Heroku.

| Variable | Required | Description |
| --- | --- | --- |
| `REDIS_URL` | yes | Redis host (hostname only — no scheme or port). |
| `REDIS_PORT` | yes | Redis port. |
| `REDIS_PASSWORD` | yes | Redis password. |

## Example `.env`

```ini
NODE_ENV=development
NODE_TLS_REJECT_UNAUTHORIZED=0

AUTH0_DOMAIN=your-tenant.us.auth0.com
AUDIENCE=https://your-api.example.com/api

AUTH0_API_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AUTH0_API_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

M2M_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
M2M_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

REDIS_URL=redis-xxxxx.c283.us-east-1-4.ec2.cloud.redislabs.com
REDIS_PORT=13223
REDIS_PASSWORD=your-redis-password
```

## Getting a free Redis Cloud database

The app requires a Redis instance. The free tier of [Redis Cloud](https://redis.io) provides a 30 MB database with no credit card required — enough to run this app locally or on Heroku.

1. **Sign up.** Go to [redis.io](https://redis.io) and click **Try Free**. Create an account with an email/password or sign in with Google/GitHub. Verify your email.
2. **Open the Redis Cloud console.** After verification you land in the Redis Cloud admin UI (`app.redislabs.com` / `cloud.redis.io`).
3. **Create a subscription.** Choose **Essentials** (the free plan). Select a cloud provider (AWS, GCP, or Azure) and a region close to where the app will run. Confirm — the free 30 MB tier is the default.
4. **Create a database.** Once the subscription is provisioned, click **New database**. Give it a name (e.g. `phone-provider-front`), accept the defaults, and click **Activate database**. Provisioning takes ~30 seconds.
5. **Grab the connection details.** Open the database from the list and look at the **General** / **Configuration** section:
   - **Public endpoint** is shown as `host:port`, e.g. `redis-13223.c283.us-east-1-4.ec2.cloud.redislabs.com:13223`. Split it into:
     - `REDIS_URL` — the **hostname only**, with no scheme and no port (everything before the `:`).
     - `REDIS_PORT` — the port number after the `:`.
   - **Default user password** — click the eye icon (or **Copy**) next to the password field under the **Security** section. This is your `REDIS_PASSWORD`.
6. **Paste into `.env`.** Add the three values to your `.env` file:

   ```ini
   REDIS_URL=redis-13223.c283.us-east-1-4.ec2.cloud.redislabs.com
   REDIS_PORT=13223
   REDIS_PASSWORD=your-default-user-password
   ```

> The app expects the host and port as separate variables (see `models/Cache.js`). Don't paste the full `redis://` URL into `REDIS_URL` — only the hostname.

## Scripts

- `npm start` — start the server (`start.js`).
- `npm run dev` — start with `nodemon` for local development (`start-dev.js`).
- `npm run send-message` — run `scripts/send-message.js`.
